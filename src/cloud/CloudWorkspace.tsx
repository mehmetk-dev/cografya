import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { useLiveQuery } from "dexie-react-hooks";
import { LoaderCircle } from "lucide-react";
import { FLASHCARD_PROGRESS_CHANGED_EVENT } from "../flashcards";
import { HISTORY_PROGRESS_CHANGED_EVENT } from "../historyStudy";
import {
  CloudAccountContext,
  type CloudSyncStatus,
} from "./CloudAccountContext";
import {
  clearLocalWorkspace,
  collectLocalSnapshot,
  hasAtlasContent,
  LAST_SYNC_AT_KEY,
  LAST_SYNC_SIGNATURE_KEY,
  loadLocalSyncState,
  LOCAL_WORKSPACE_OWNER_KEY,
  replaceLocalSnapshot,
  saveLocalSyncState,
} from "./localWorkspace";
import {
  mergeAtlasSnapshots,
  mergeAtlasSnapshotsThreeWay,
  parseAtlasSnapshot,
  snapshotSignature,
  type AtlasSnapshot,
} from "./snapshot";
import { supabase } from "./supabaseClient";

type CloudWorkspaceProps = {
  user: User;
  children: ReactNode;
};

type CloudRow = {
  data: unknown;
  updated_at: string;
  revision: number;
};

type SavedCloudRevision = {
  updated_at: string;
  revision: number;
};

const MAX_SAVE_ATTEMPTS = 5;

function getSupabase() {
  if (!supabase) throw new Error("SUPABASE_NOT_CONFIGURED");
  return supabase;
}

function friendlySyncError(error: unknown) {
  const code =
    typeof error === "object" && error && "code" in error
      ? String(error.code)
      : "";
  if (code === "42P01") return "Bulut veri tablosu henüz kurulmamış.";
  if (code === "42703") return "Bulut eşitleme güncellemesi henüz kurulmamış.";
  if (code === "42501") return "Bulut veri tablosunun erişim izni eksik.";
  if (error instanceof Error && error.message === "INVALID_CLOUD_SNAPSHOT") {
    return "Buluttaki veri biçimi doğrulanamadı; yerel kayıtların korunuyor.";
  }
  if (error instanceof Error && error.message === "CLOUD_SAVE_CONFLICT") {
    return "Başka bir cihaz aynı anda kayıt yaptı. Tekrar deneniyor.";
  }
  return "Bulut bağlantısı kurulamadı. Yerel kayıtların korunuyor.";
}

async function fetchCloudRow(userId: string): Promise<CloudRow | null> {
  const { data, error } = await getSupabase()
    .from("user_atlas_data")
    .select("data, updated_at, revision")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as CloudRow | null;
}

function LocalChangeWatcher({
  onSnapshot,
}: {
  onSnapshot: (snapshot: AtlasSnapshot) => void;
}) {
  const observedSnapshot = useLiveQuery(() => collectLocalSnapshot(), []);
  const [localStudyRevision, setLocalStudyRevision] = useState(0);

  useEffect(() => {
    const refresh = () => setLocalStudyRevision((value) => value + 1);
    window.addEventListener(FLASHCARD_PROGRESS_CHANGED_EVENT, refresh);
    window.addEventListener(HISTORY_PROGRESS_CHANGED_EVENT, refresh);
    return () => {
      window.removeEventListener(FLASHCARD_PROGRESS_CHANGED_EVENT, refresh);
      window.removeEventListener(HISTORY_PROGRESS_CHANGED_EVENT, refresh);
    };
  }, []);

  useEffect(() => {
    if (!observedSnapshot) return;
    const timer = window.setTimeout(() => {
      void collectLocalSnapshot().then(onSnapshot);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [observedSnapshot, localStudyRevision, onSnapshot]);

  return null;
}

export function CloudWorkspace({ user, children }: CloudWorkspaceProps) {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<CloudSyncStatus>("loading");
  const [statusMessage, setStatusMessage] = useState("Bulut verisi hazırlanıyor");
  const [signingOut, setSigningOut] = useState(false);
  const lastSignatureRef = useRef(
    window.localStorage.getItem(LAST_SYNC_SIGNATURE_KEY) ?? "",
  );
  const lastCloudUpdatedAtRef = useRef(
    window.localStorage.getItem(LAST_SYNC_AT_KEY) ?? "",
  );
  const lastCloudRevisionRef = useRef(0);
  const baseSnapshotRef = useRef<AtlasSnapshot | null>(null);
  const uploadQueueRef = useRef<Promise<AtlasSnapshot>>(Promise.resolve(null as never));

  const rememberSync = useCallback((signature: string, updatedAt: string) => {
    lastSignatureRef.current = signature;
    lastCloudUpdatedAtRef.current = updatedAt;
    window.localStorage.setItem(LAST_SYNC_SIGNATURE_KEY, signature);
    window.localStorage.setItem(LAST_SYNC_AT_KEY, updatedAt);
  }, []);

  const recordSyncedSnapshot = useCallback(
    async (
      snapshot: AtlasSnapshot,
      revision: number,
      updatedAt: string,
    ) => {
      baseSnapshotRef.current = snapshot;
      lastCloudRevisionRef.current = revision;
      rememberSync(snapshotSignature(snapshot), updatedAt);
      await saveLocalSyncState(user.id, snapshot, revision, updatedAt);
    },
    [rememberSync, user.id],
  );

  const saveSnapshotToCloud = useCallback(
    async (snapshot: AtlasSnapshot, force = false) => {
      const localSignature = snapshotSignature(snapshot);
      if (!force && localSignature === lastSignatureRef.current) {
        return snapshot;
      }

      setStatus("syncing");
      setStatusMessage("Değişiklikler doğrudan buluta kaydediliyor");

      for (let attempt = 0; attempt < MAX_SAVE_ATTEMPTS; attempt += 1) {
        const row = await fetchCloudRow(user.id);
        const now = new Date().toISOString();

        if (!row) {
          const upload = { ...snapshot, capturedAt: now };
          const { data, error } = await getSupabase()
            .from("user_atlas_data")
            .insert({
              user_id: user.id,
              data: upload,
              updated_at: now,
              revision: 1,
            })
            .select("updated_at, revision")
            .maybeSingle();

          if (error?.code === "23505") continue;
          if (error) throw error;
          if (!data) continue;

          const saved = data as SavedCloudRevision;
          await recordSyncedSnapshot(
            upload,
            saved.revision,
            saved.updated_at,
          );
          setStatus("synced");
          setStatusMessage("Haritalar bulutta ve tüm cihazlarda güncel");
          return upload;
        }

        const parsed = parseAtlasSnapshot(row.data);
        if (!parsed.success) throw new Error("INVALID_CLOUD_SNAPSHOT");

        const next = baseSnapshotRef.current
          ? mergeAtlasSnapshotsThreeWay(
              baseSnapshotRef.current,
              parsed.data,
              snapshot,
            )
          : mergeAtlasSnapshots(parsed.data, snapshot);

        if (snapshotSignature(next) === snapshotSignature(parsed.data)) {
          await recordSyncedSnapshot(
            parsed.data,
            row.revision,
            row.updated_at,
          );
          setStatus("synced");
          setStatusMessage("Haritalar bulutta ve tüm cihazlarda güncel");
          return parsed.data;
        }

        const upload = { ...next, capturedAt: now };
        const { data, error } = await getSupabase()
          .from("user_atlas_data")
          .update({
            data: upload,
            updated_at: now,
            revision: row.revision + 1,
          })
          .eq("user_id", user.id)
          .eq("revision", row.revision)
          .select("updated_at, revision")
          .maybeSingle();
        if (error) throw error;
        if (!data) continue;

        const saved = data as SavedCloudRevision;
        await recordSyncedSnapshot(
          upload,
          saved.revision,
          saved.updated_at,
        );
        setStatus("synced");
        setStatusMessage("Haritalar bulutta ve tüm cihazlarda güncel");
        return upload;
      }

      throw new Error("CLOUD_SAVE_CONFLICT");
    },
    [recordSyncedSnapshot, user.id],
  );

  const enqueueUpload = useCallback(
    (snapshot: AtlasSnapshot, force = false) => {
      const job = uploadQueueRef.current
        .catch(() => snapshot)
        .then(() => saveSnapshotToCloud(snapshot, force));
      uploadQueueRef.current = job;
      return job;
    },
    [saveSnapshotToCloud],
  );

  const reportSyncError = useCallback((error: unknown) => {
    setStatus("error");
    setStatusMessage(friendlySyncError(error));
  }, []);

  const applySavedSnapshotIfCurrent = useCallback(
    async (submitted: AtlasSnapshot, saved: AtlasSnapshot) => {
      if (snapshotSignature(submitted) === snapshotSignature(saved)) return;
      const current = await collectLocalSnapshot();
      if (
        snapshotSignature(current) === snapshotSignature(submitted)
      ) {
        await replaceLocalSnapshot(saved);
      }
    },
    [],
  );

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      setStatus("loading");
      setStatusMessage("Bulut verisi hazırlanıyor");
      try {
        const previousOwner = window.localStorage.getItem(
          LOCAL_WORKSPACE_OWNER_KEY,
        );
        if (previousOwner && previousOwner !== user.id) {
          await clearLocalWorkspace();
          lastSignatureRef.current = "";
          lastCloudUpdatedAtRef.current = "";
          lastCloudRevisionRef.current = 0;
          baseSnapshotRef.current = null;
        }

        const local = await collectLocalSnapshot();
        const localSignature = snapshotSignature(local);
        const storedSignature =
          window.localStorage.getItem(LAST_SYNC_SIGNATURE_KEY) ?? "";
        const storedState =
          previousOwner === user.id
            ? await loadLocalSyncState(user.id)
            : undefined;
        const parsedBase = storedState
          ? parseAtlasSnapshot(storedState.snapshot)
          : null;
        if (parsedBase?.success) {
          baseSnapshotRef.current = parsedBase.data;
          lastCloudRevisionRef.current = storedState?.revision ?? 0;
        }

        const row = await fetchCloudRow(user.id);
        if (!active) return;

        if (!row) {
          const saved = await saveSnapshotToCloud(local, true);
          await applySavedSnapshotIfCurrent(local, saved);
        } else {
          const parsedCloud = parseAtlasSnapshot(row.data);
          if (!parsedCloud.success) throw new Error("INVALID_CLOUD_SNAPSHOT");

          const legacyLocalData = !previousOwner && hasAtlasContent(local);
          const pendingLocalData =
            previousOwner === user.id &&
            localSignature !== storedSignature;
          const next = parsedBase?.success
            ? mergeAtlasSnapshotsThreeWay(
                parsedBase.data,
                parsedCloud.data,
                local,
              )
            : legacyLocalData || pendingLocalData
              ? mergeAtlasSnapshots(parsedCloud.data, local)
              : parsedCloud.data;

          await replaceLocalSnapshot(next);
          await recordSyncedSnapshot(
            parsedCloud.data,
            row.revision,
            row.updated_at,
          );

          if (
            snapshotSignature(next) !==
            snapshotSignature(parsedCloud.data)
          ) {
            const saved = await saveSnapshotToCloud(next, true);
            await applySavedSnapshotIfCurrent(next, saved);
          } else {
            setStatus("synced");
            setStatusMessage("Haritalar bulutta ve tüm cihazlarda güncel");
          }
        }

        window.localStorage.setItem(LOCAL_WORKSPACE_OWNER_KEY, user.id);
      } catch (error) {
        if (!active) return;
        window.localStorage.setItem(LOCAL_WORKSPACE_OWNER_KEY, user.id);
        reportSyncError(error);
      } finally {
        if (active) setReady(true);
      }
    };

    void bootstrap();
    return () => {
      active = false;
    };
  }, [
    applySavedSnapshotIfCurrent,
    recordSyncedSnapshot,
    reportSyncError,
    saveSnapshotToCloud,
    user.id,
  ]);

  const syncLocalChanges = useCallback(
    (snapshot: AtlasSnapshot) => {
      void enqueueUpload(snapshot)
        .then((saved) => applySavedSnapshotIfCurrent(snapshot, saved))
        .catch(reportSyncError);
    },
    [applySavedSnapshotIfCurrent, enqueueUpload, reportSyncError],
  );

  useEffect(() => {
    if (!ready) return;
    let pulling = false;

    const pullLatest = async () => {
      if (pulling) return;
      pulling = true;
      try {
        await uploadQueueRef.current.catch(() => undefined);
        const row = await fetchCloudRow(user.id);
        if (!row || row.revision <= lastCloudRevisionRef.current) return;

        const local = await collectLocalSnapshot();
        const saved = await enqueueUpload(local, true);
        await applySavedSnapshotIfCurrent(local, saved);
      } catch (error) {
        reportSyncError(error);
      } finally {
        pulling = false;
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void pullLatest();
    };
    const channel = getSupabase()
      .channel(`atlas-sync-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_atlas_data",
          filter: `user_id=eq.${user.id}`,
        },
        () => void pullLatest(),
      )
      .subscribe();
    const fallbackPoll = window.setInterval(() => {
      if (document.visibilityState === "visible") void pullLatest();
    }, 30_000);

    window.addEventListener("focus", pullLatest);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(fallbackPoll);
      window.removeEventListener("focus", pullLatest);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      void getSupabase().removeChannel(channel);
    };
  }, [
    applySavedSnapshotIfCurrent,
    enqueueUpload,
    ready,
    reportSyncError,
    user.id,
  ]);

  const retrySync = async () => {
    try {
      const local = await collectLocalSnapshot();
      const saved = await enqueueUpload(local, true);
      await applySavedSnapshotIfCurrent(local, saved);
    } catch (error) {
      reportSyncError(error);
    }
  };

  const signOut = async () => {
    setSigningOut(true);
    try {
      await enqueueUpload(await collectLocalSnapshot(), true);
      const { error } = await getSupabase().auth.signOut({ scope: "local" });
      if (error) throw error;
      await clearLocalWorkspace();
    } catch (error) {
      reportSyncError(error);
      setSigningOut(false);
    }
  };

  if (!ready) {
    return (
      <main className="auth-shell">
        <div className="auth-loading">
          <LoaderCircle className="spin" size={26} />
          {statusMessage}
        </div>
      </main>
    );
  }

  return (
    <CloudAccountContext.Provider
      value={{ status, signingOut, retrySync, signOut }}
    >
      <LocalChangeWatcher onSnapshot={syncLocalChanges} />
      {children}
    </CloudAccountContext.Provider>
  );
}
