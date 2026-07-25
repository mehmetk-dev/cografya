import { db } from "../db";
import {
  FLASHCARD_PROGRESS_KEY,
  loadFlashcardProgress,
  type FlashcardProgress,
} from "../flashcards";
import type { AtlasSnapshot } from "./snapshot";

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

export async function collectLocalSnapshot(): Promise<AtlasSnapshot> {
  const [
    studyMaps,
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
    provinceRecords,
    mapMarkers,
    mapDrawings,
    quizStats,
    quizMistakes,
    dailyProgress,
    flashcardProgress: loadFlashcardProgress(),
  };
}

export async function replaceLocalSnapshot(snapshot: AtlasSnapshot) {
  await db.transaction(
    "rw",
    [
      db.studyMaps,
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
        db.provinceRecords.clear(),
        db.mapMarkers.clear(),
        db.mapDrawings.clear(),
        db.quizStats.clear(),
        db.quizMistakes.clear(),
        db.dailyProgress.clear(),
      ]);
      await Promise.all([
        db.studyMaps.bulkPut(snapshot.studyMaps),
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
}

export async function clearLocalWorkspace() {
  await db.transaction(
    "rw",
    [
      db.studyMaps,
      db.provinceRecords,
      db.mapMarkers,
      db.mapDrawings,
      db.quizStats,
      db.quizMistakes,
      db.dailyProgress,
    ],
    () =>
      Promise.all([
        db.studyMaps.clear(),
        db.provinceRecords.clear(),
        db.mapMarkers.clear(),
        db.mapDrawings.clear(),
        db.quizStats.clear(),
        db.quizMistakes.clear(),
        db.dailyProgress.clear(),
      ]),
  );
  window.localStorage.removeItem(ACTIVE_MAP_KEY);
  window.localStorage.removeItem(FLASHCARD_PROGRESS_KEY);
  window.localStorage.removeItem(LOCAL_WORKSPACE_OWNER_KEY);
  window.localStorage.removeItem(LAST_SYNC_SIGNATURE_KEY);
  window.localStorage.removeItem(LAST_SYNC_AT_KEY);
}

export function hasAtlasContent(snapshot: AtlasSnapshot) {
  return (
    snapshot.studyMaps.length > 0 ||
    snapshot.provinceRecords.length > 0 ||
    snapshot.mapMarkers.length > 0 ||
    snapshot.mapDrawings.length > 0 ||
    snapshot.quizStats.length > 0 ||
    snapshot.quizMistakes.length > 0 ||
    snapshot.dailyProgress.length > 0 ||
    Object.keys(snapshot.flashcardProgress).length > 0
  );
}
