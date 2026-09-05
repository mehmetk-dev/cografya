import { QUESTION_PROGRESS_CHANGED_EVENT } from "../questionsData";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
  archiveLocalWorkspace,
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
import { sqliteClient, type CloudRow, type User } from "./sqliteClient";

type CloudWorkspaceProps = {
  user: User;
  children: ReactNode;
};

const MAX_SAVE_ATTEMPTS = 3;

function friendlySyncError(error: unknown) {
  if (error instanceof Error && error.message === "INVALID_CLOUD_SNAPSHOT") {
    return "Veri biçimi doğrulanamadı; yerel kayıtların korunuyor.";
  }
  if (error instanceof Error && error.message === "CLOUD_SAVE_CONFLICT") {
    return "Eşzamanlı değişiklik algılandı; tekrar deneniyor.";
  }
  return "Sunucuya kaydedilemedi. Değişikliklerin bu tarayıcıda korunuyor; yeniden dene.";
}

async function fetchCloudRow(userId: string): Promise<CloudRow | null> {
  return await sqliteClient.atlas.fetchRow(userId);
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
    window.addEventListener(QUESTION_PROGRESS_CHANGED_EVENT, refresh);
    window.addEventListener(FLASHCARD_PROGRESS_CHANGED_EVENT, refresh);
    window.addEventListener(HISTORY_PROGRESS_CHANGED_EVENT, refresh);
    return () => {
      window.removeEventListener(QUESTION_PROGRESS_CHANGED_EVENT, refresh);
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
  const [statusMessage, setStatusMessage] = useState("Yerel veritabanı hazırlanıyor");
  const [signingOut, setSigningOut] = useState(false);
  const lastSignatureRef = useRef(
    window.localStorage.getItem(LAST_SYNC_SIGNATURE_KEY) ?? "",
  );
  const lastCloudUpdatedAtRef = useRef(
    window.localStorage.getItem(LAST_SYNC_AT_KEY) ?? "",
  );
  const lastCloudRevisionRef = useRef(0);
  const baseSnapshotRef = useRef<AtlasSnapshot | null>(null);
  const uploadQueueRef = useRef<Promise<AtlasSnapshot>>(
    Promise.resolve(null as never),
  );

  const rememberSync = useCallback((signature: string, updatedAt: string) => {
    lastSignatureRef.current = signature;
    lastCloudUpdatedAtRef.current = updatedAt;
    window.localStorage.setItem(LAST_SYNC_SIGNATURE_KEY, signature);
    window.localStorage.setItem(LAST_SYNC_AT_KEY, updatedAt);
  }, []);

  const recordSyncedSnapshot = useCallback(
    async (snapshot: AtlasSnapshot, revision: number, updatedAt: string) => {
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
      setStatusMessage("Değişiklikler SQLite veritabanına kaydediliyor");

      for (let attempt = 0; attempt < MAX_SAVE_ATTEMPTS; attempt += 1) {
        try {
          const row = await fetchCloudRow(user.id);
          const now = new Date().toISOString();

          if (!row) {
            const upload = { ...snapshot, capturedAt: now };
            const saved = await sqliteClient.atlas.syncRow({
              userId: user.id,
              data: upload,
              revision: 0,
            });

            await recordSyncedSnapshot(upload, saved.revision, saved.updated_at);
            setStatus("synced");
            setStatusMessage("Kayıtlar SQLite veritabanında güncel");
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
            setStatusMessage("Kayıtlar SQLite veritabanında güncel");
            return parsed.data;
          }

          const upload = { ...next, capturedAt: now };
          const saved = await sqliteClient.atlas.syncRow({
            userId: user.id,
            data: upload,
            revision: row.revision,
          });

          await recordSyncedSnapshot(upload, saved.revision, saved.updated_at);
          setStatus("synced");
          setStatusMessage("Kayıtlar SQLite veritabanında güncel");
          return upload;
        } catch (err) {
          if (
            err instanceof Error &&
            err.message === "CLOUD_SAVE_CONFLICT" &&
            attempt < MAX_SAVE_ATTEMPTS - 1
          ) {
            continue;
          }
          throw err;
        }
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
      if (snapshotSignature(current) === snapshotSignature(submitted)) {
        await replaceLocalSnapshot(saved);
      }
    },
    [],
  );

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      setStatus("loading");
      setStatusMessage("Yerel veriler hazırlanıyor");
      let isolated = false;
      try {
        const previousOwner = window.localStorage.getItem(
          LOCAL_WORKSPACE_OWNER_KEY,
        );
        if (previousOwner && previousOwner !== user.id) {
          await archiveLocalWorkspace(previousOwner);
          await clearLocalWorkspace();
          lastSignatureRef.current = "";
          lastCloudUpdatedAtRef.current = "";
          lastCloudRevisionRef.current = 0;
          baseSnapshotRef.current = null;
        }

        isolated = true;
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
            previousOwner === user.id && localSignature !== storedSignature;
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

          if (snapshotSignature(next) !== snapshotSignature(parsedCloud.data)) {
            const saved = await saveSnapshotToCloud(next, true);
            await applySavedSnapshotIfCurrent(next, saved);
          } else {
            setStatus("synced");
            setStatusMessage("Kayıtlar SQLite veritabanında güncel");
          }
        }

        window.localStorage.setItem(LOCAL_WORKSPACE_OWNER_KEY, user.id);
      } catch (error) {
        if (!active) return;
        if (isolated) window.localStorage.setItem(LOCAL_WORKSPACE_OWNER_KEY, user.id);
        reportSyncError(error);
      } finally {
        if (active && isolated) setReady(true);
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
        const local = await collectLocalSnapshot();
        if (row && row.revision <= lastCloudRevisionRef.current && snapshotSignature(local) === lastSignatureRef.current) {
          setStatus("synced");
          return;
        }
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

    const poll = window.setInterval(() => {
      if (document.visibilityState === "visible") void pullLatest();
    }, 15_000);

    window.addEventListener("focus", pullLatest);
    window.addEventListener("online", pullLatest);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(poll);
      window.removeEventListener("focus", pullLatest);
      window.removeEventListener("online", pullLatest);
      document.removeEventListener("visibilitychange", onVisibilityChange);
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
      await sqliteClient.auth.signOut();
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
          {status === "error" && <button className="button button--primary" onClick={() => window.location.reload()}>Yeniden dene</button>}
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
