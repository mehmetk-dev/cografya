import { db } from "../db";
import {
  FLASHCARD_PROGRESS_KEY,
  loadFlashcardProgress,
  type FlashcardProgress,
} from "../flashcards";
import type { AtlasSnapshot } from "./snapshot";
import {
  HISTORY_PROGRESS_KEY,
  loadHistoryProgress,
  type HistoryProgress,
} from "../historyStudy";

const ACTIVE_MAP_KEY = "cografya-atlasim-active-map";
export const LOCAL_WORKSPACE_OWNER_KEY =
  "cografya-atlasim-cloud-workspace-owner";
export const LAST_SYNC_SIGNATURE_KEY =
  "cografya-atlasim-cloud-last-signature";
export const LAST_SYNC_AT_KEY = "cografya-atlasim-cloud-last-updated-at";

function writeFlashcardProgress(progress: FlashcardProgress) {
  if (Object.keys(progress).length === 0) {
    window.localStorage.removeItem(FLASHCARD_PROGRESS_KEY);
    return;
  }
  window.localStorage.setItem(
    FLASHCARD_PROGRESS_KEY,
    JSON.stringify(progress),
  );
}

function writeHistoryProgress(progress?: HistoryProgress) {
  if (!progress) {
    window.localStorage.removeItem(HISTORY_PROGRESS_KEY);
    return;
  }
  window.localStorage.setItem(
    HISTORY_PROGRESS_KEY,
    JSON.stringify(progress),
  );
}

export async function collectLocalSnapshot(): Promise<AtlasSnapshot> {
  const [
    studyMaps,
    mapFolders,
    provinceRecords,
    mapMarkers,
    mapDrawings,
    quizStats,
    quizMistakes,
    dailyProgress,
  ] = await db.transaction(
    "r",
    [
      db.studyMaps,
      db.mapFolders,
      db.provinceRecords,
      db.mapMarkers,
      db.mapDrawings,
      db.quizStats,
      db.quizMistakes,
      db.dailyProgress,
    ],
    () =>
      Promise.all([
        db.studyMaps.toArray(),
        db.mapFolders.toArray(),
        db.provinceRecords.toArray(),
        db.mapMarkers.toArray(),
        db.mapDrawings.toArray(),
        db.quizStats.toArray(),
        db.quizMistakes.toArray(),
        db.dailyProgress.toArray(),
      ]),
  );

  return {
    version: 1,
    capturedAt: new Date().toISOString(),
    activeMapId: window.localStorage.getItem(ACTIVE_MAP_KEY),
    studyMaps,
    mapFolders,
    provinceRecords,
    mapMarkers,
    mapDrawings,
    quizStats,
    quizMistakes,
    dailyProgress,
    flashcardProgress: loadFlashcardProgress(),
    historyProgress: loadHistoryProgress(),
  };
}

export async function replaceLocalSnapshot(snapshot: AtlasSnapshot) {
  await db.transaction(
    "rw",
    [
      db.studyMaps,
      db.mapFolders,
      db.provinceRecords,
      db.mapMarkers,
      db.mapDrawings,
      db.quizStats,
      db.quizMistakes,
      db.dailyProgress,
    ],
    async () => {
      await Promise.all([
        db.studyMaps.clear(),
        db.mapFolders.clear(),
        db.provinceRecords.clear(),
        db.mapMarkers.clear(),
        db.mapDrawings.clear(),
        db.quizStats.clear(),
        db.quizMistakes.clear(),
        db.dailyProgress.clear(),
      ]);
      await Promise.all([
        db.studyMaps.bulkPut(snapshot.studyMaps),
        db.mapFolders.bulkPut(snapshot.mapFolders),
        db.provinceRecords.bulkPut(snapshot.provinceRecords),
        db.mapMarkers.bulkPut(snapshot.mapMarkers),
        db.mapDrawings.bulkPut(snapshot.mapDrawings),
        db.quizStats.bulkPut(snapshot.quizStats),
        db.quizMistakes.bulkPut(snapshot.quizMistakes),
        db.dailyProgress.bulkPut(snapshot.dailyProgress),
      ]);
    },
  );

  if (
    snapshot.activeMapId &&
    snapshot.studyMaps.some((map) => map.id === snapshot.activeMapId)
  ) {
    window.localStorage.setItem(ACTIVE_MAP_KEY, snapshot.activeMapId);
  } else {
    window.localStorage.removeItem(ACTIVE_MAP_KEY);
  }
  writeFlashcardProgress(snapshot.flashcardProgress);
  writeHistoryProgress(snapshot.historyProgress);
}

export async function loadLocalSyncState(userId: string) {
  return db.cloudSyncState.get(userId);
}

export async function saveLocalSyncState(
  userId: string,
  snapshot: AtlasSnapshot,
  revision: number,
  updatedAt: string,
) {
  await db.cloudSyncState.put({
    userId,
    snapshot,
    revision,
    updatedAt,
  });
}

export async function clearLocalWorkspace() {
  await db.transaction(
    "rw",
    [
      db.studyMaps,
      db.mapFolders,
      db.provinceRecords,
      db.mapMarkers,
      db.mapDrawings,
      db.quizStats,
      db.quizMistakes,
      db.dailyProgress,
      db.cloudSyncState,
    ],
    () =>
      Promise.all([
        db.studyMaps.clear(),
        db.mapFolders.clear(),
        db.provinceRecords.clear(),
        db.mapMarkers.clear(),
        db.mapDrawings.clear(),
        db.quizStats.clear(),
        db.quizMistakes.clear(),
        db.dailyProgress.clear(),
        db.cloudSyncState.clear(),
      ]),
  );
  window.localStorage.removeItem(ACTIVE_MAP_KEY);
  window.localStorage.removeItem(FLASHCARD_PROGRESS_KEY);
  window.localStorage.removeItem(HISTORY_PROGRESS_KEY);
  window.localStorage.removeItem(LOCAL_WORKSPACE_OWNER_KEY);
  window.localStorage.removeItem(LAST_SYNC_SIGNATURE_KEY);
  window.localStorage.removeItem(LAST_SYNC_AT_KEY);
}

export function hasAtlasContent(snapshot: AtlasSnapshot) {
  return (
    snapshot.studyMaps.length > 0 ||
    snapshot.mapFolders.length > 0 ||
    snapshot.provinceRecords.length > 0 ||
    snapshot.mapMarkers.length > 0 ||
    snapshot.mapDrawings.length > 0 ||
    snapshot.quizStats.length > 0 ||
    snapshot.quizMistakes.length > 0 ||
    snapshot.dailyProgress.length > 0 ||
    Object.keys(snapshot.flashcardProgress).length > 0 ||
    Boolean(snapshot.historyProgress?.visitedEventIds.length) ||
    Boolean(snapshot.historyProgress?.chronologyAttempts) ||
    Boolean(snapshot.historyProgress?.outcomeAttempts)
  );
}
