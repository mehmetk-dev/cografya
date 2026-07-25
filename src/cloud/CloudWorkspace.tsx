import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { useLiveQuery } from "dexie-react-hooks";
import {
  CheckCircle2,
  Cloud,
  CloudAlert,
  LoaderCircle,
  LogOut,
  RefreshCw,
} from "lucide-react";
import {
  FLASHCARD_PROGRESS_CHANGED_EVENT,
} from "../flashcards";
import {
  clearLocalWorkspace,
  collectLocalSnapshot,
  hasAtlasContent,
  LAST_SYNC_AT_KEY,
  LAST_SYNC_SIGNATURE_KEY,
  LOCAL_WORKSPACE_OWNER_KEY,
  replaceLocalSnapshot,
} from "./localWorkspace";
import {
  mergeAtlasSnapshots,
  parseAtlasSnapshot,
  snapshotSignature,
  type AtlasSnapshot,
} from "./snapshot";
import { supabase } from "./supabaseClient";

type CloudWorkspaceProps = {
  user: User;
  children: ReactNode;
};

type SyncStatus = "loading" | "syncing" | "synced" | "error";

type CloudRow = {
  data: unknown;
  updated_at: string;
};

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
  if (code === "42501") return "Bulut veri tablosunun erişim izni eksik.";
  if (error instanceof Error && error.message === "INVALID_CLOUD_SNAPSHOT") {
    return "Buluttaki veri biçimi doğrulanamadı; yerel kayıtların korunuyor.";
  }
  return "Bulut bağlantısı kurulamadı. Yerel kayıtların korunuyor.";
}

async function fetchCloudRow(userId: string): Promise<CloudRow | null> {
  const { data, error } = await getSupabase()
    .from("user_atlas_data")
    .select("data, updated_at")
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
  const [flashcardRevision, setFlashcardRevision] = useState(0);

  useEffect(() => {
    const refresh = () => setFlashcardRevision((value) => value + 1);
    window.addEventListener(FLASHCARD_PROGRESS_CHANGED_EVENT, refresh);
    return () =>
      window.removeEventListener(FLASHCARD_PROGRESS_CHANGED_EVENT, refresh);
  }, []);

  useEffect(() => {
    if (!observedSnapshot) return;
    const timer = window.setTimeout(() => {
      void collectLocalSnapshot().then(onSnapshot);
    }, 850);
    return () => window.clearTimeout(timer);
  }, [observedSnapshot, flashcardRevision, onSnapshot]);

  return null;
}

export function CloudWorkspace({ user, children }: CloudWorkspaceProps) {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<SyncStatus>("loading");
  const [statusMessage, setStatusMessage] = useState("Bulut verisi hazırlanıyor");
  const [signingOut, setSigningOut] = useState(false);
  const lastSignatureRef = useRef(
    window.localStorage.getItem(LAST_SYNC_SIGNATURE_KEY) ?? "",
  );
  const lastCloudUpdatedAtRef = useRef(
    window.localStorage.getItem(LAST_SYNC_AT_KEY) ?? "",
  );
  const uploadQueueRef = useRef<Promise<void>>(Promise.resolve());

  const rememberSync = useCallback((signature: string, updatedAt: string) => {
    lastSignatureRef.current = signature;
    lastCloudUpdatedAtRef.current = updatedAt;
    window.localStorage.setItem(LAST_SYNC_SIGNATURE_KEY, signature);
    window.localStorage.setItem(LAST_SYNC_AT_KEY, updatedAt);
  }, []);

  const uploadSnapshot = useCallback(
    async (snapshot: AtlasSnapshot, force = false) => {
      const signature = snapshotSignature(snapshot);
      if (!force && signature === lastSignatureRef.current) return;

      setStatus("syncing");
      setStatusMessage("Değişiklikler buluta kaydediliyor");
      const updatedAt = new Date().toISOString();
      const upload = {
        ...snapshot,
        capturedAt: updatedAt,
      };
      const { error } = await getSupabase()
        .from("user_atlas_data")
        .upsert(
          {
            user_id: user.id,
            data: upload,
            updated_at: updatedAt,
          },
          { onConflict: "user_id" },
        );
      if (error) throw error;

      rememberSync(snapshotSignature(upload), updatedAt);
      setStatus("synced");
      setStatusMessage("Tüm cihazlarda güncel");
    },
    [rememberSync, user.id],
  );

  const enqueueUpload = useCallback(
    (snapshot: AtlasSnapshot, force = false) => {
      const job = uploadQueueRef.current.then(() =>
        uploadSnapshot(snapshot, force),
      );
      uploadQueueRef.current = job.catch(() => undefined);
      return job;
    },
    [uploadSnapshot],
  );

  const reportSyncError = useCallback((error: unknown) => {
    setStatus("error");
    setStatusMessage(friendlySyncError(error));
  }, []);

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
        }

        const local = await collectLocalSnapshot();
        const localSignature = snapshotSignature(local);
        const storedSignature =
          window.localStorage.getItem(LAST_SYNC_SIGNATURE_KEY) ?? "";
        const row = await fetchCloudRow(user.id);

        if (!active) return;
        if (!row) {
          await uploadSnapshot(local, true);
        } else {
          const parsed = parseAtlasSnapshot(row.data);
          if (!parsed.success) throw new Error("INVALID_CLOUD_SNAPSHOT");

          const legacyLocalData =
            !previousOwner && hasAtlasContent(local);
          const pendingLocalData =
            previousOwner === user.id &&
            localSignature !== storedSignature;
          const next =
            legacyLocalData
              ? mergeAtlasSnapshots(parsed.data, local)
              : pendingLocalData
                ? local
                : parsed.data;

          await replaceLocalSnapshot(next);
          rememberSync(snapshotSignature(next), row.updated_at);
          if (legacyLocalData || pendingLocalData) {
            await uploadSnapshot(next, true);
          } else {
            setStatus("synced");
            setStatusMessage("Tüm cihazlarda güncel");
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
  }, [rememberSync, reportSyncError, uploadSnapshot, user.id]);

  const syncLocalChanges = useCallback(
    (snapshot: AtlasSnapshot) => {
      void enqueueUpload(snapshot).catch(reportSyncError);
    },
    [enqueueUpload, reportSyncError],
  );

  useEffect(() => {
    if (!ready) return;
    let pulling = false;

    const pullLatest = async () => {
      if (pulling) return;
      pulling = true;
      try {
        const row = await fetchCloudRow(user.id);
        if (!row || row.updated_at <= lastCloudUpdatedAtRef.current) return;
        const parsed = parseAtlasSnapshot(row.data);
        if (!parsed.success) throw new Error("INVALID_CLOUD_SNAPSHOT");

        const local = await collectLocalSnapshot();
        const localChanged =
          snapshotSignature(local) !== lastSignatureRef.current;
        const next = localChanged ? local : parsed.data;
        await replaceLocalSnapshot(next);
        rememberSync(snapshotSignature(next), row.updated_at);
        if (localChanged) {
          await enqueueUpload(next, true);
        } else {
          setStatus("synced");
          setStatusMessage("Tüm cihazlarda güncel");
        }
      } catch (error) {
        reportSyncError(error);
      } finally {
        pulling = false;
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void pullLatest();
    };
    window.addEventListener("focus", pullLatest);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("focus", pullLatest);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [
    enqueueUpload,
    ready,
    rememberSync,
    reportSyncError,
    user.id,
  ]);

  const retrySync = async () => {
    try {
      await enqueueUpload(await collectLocalSnapshot(), true);
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

  const StatusIcon =
    status === "error"
      ? CloudAlert
      : status === "syncing"
        ? LoaderCircle
        : status === "synced"
          ? CheckCircle2
          : Cloud;

  return (
    <>
      <LocalChangeWatcher onSnapshot={syncLocalChanges} />
      {children}
      <aside className={`cloud-account cloud-account--${status}`}>
        <div className="cloud-account__identity">
          <StatusIcon
            className={status === "syncing" ? "spin" : ""}
            size={16}
          />
          <span>
            <strong>{user.email ?? "Coğrafya hesabı"}</strong>
            <small>{statusMessage}</small>
          </span>
        </div>
        {status === "error" && (
          <button type="button" title="Senkronizasyonu yeniden dene" onClick={retrySync}>
            <RefreshCw size={15} />
          </button>
        )}
        <button
          type="button"
          title="Çıkış yap"
          disabled={signingOut}
          onClick={signOut}
        >
          {signingOut ? <LoaderCircle className="spin" size={15} /> : <LogOut size={15} />}
        </button>
      </aside>
    </>
  );
}
