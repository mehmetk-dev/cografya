import { z } from "zod";
import type {
  DailyProgress,
  MapDrawing,
  MapFolder,
  MapMarker,
  ProvinceRecord,
  QuizMistake,
  QuizStats,
  StudyMap,
} from "../types";
import type { FlashcardProgress } from "../flashcards";
import type { HistoryProgress } from "../historyStudy";

const markerKindSchema = z.enum([
  "mountain",
  "plain",
  "agriculture",
  "river",
  "lake",
  "mine",
  "energy",
  "tourism",
  "city",
  "custom",
]);
const isoDateSchema = z.string().datetime({ offset: true });
const mapPointSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
});
const studyMapSchema = z.object({
  id: z.string().min(1),
  sourceSetId: z.string().optional(),
  presentation: z.enum(["default", "mountain-atlas"]).optional(),
  folderId: z.string().optional(),
  name: z.string(),
  description: z.string(),
  themeColor: z.string(),
  showLabels: z.boolean(),
  showProvinceNames: z.boolean().optional(),
  regionFills: z.record(z.string(), z.string()).optional(),
  hiddenMarkerKinds: z.array(markerKindSchema).optional(),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});
const mapFolderSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});
const provinceRecordSchema = z.object({
  id: z.string().min(1),
  mapId: z.string().min(1),
  provinceCode: z.number().int().min(1).max(81),
  provinceName: z.string(),
  title: z.string(),
  note: z.string(),
  color: z.string(),
  items: z.array(
    z.object({
      id: z.string().min(1),
      text: z.string(),
      category: z.string(),
    }),
  ),
  labelOffset: mapPointSchema.optional(),
  labelScale: z.number().min(0.7).max(1.8).optional(),
  labelRotation: z.number().min(-180).max(180).optional(),
  updatedAt: isoDateSchema,
});
const mapMarkerSchema = z.object({
  id: z.string().min(1),
  mapId: z.string().min(1),
  provinceCode: z.number().int().min(1).max(81),
  provinceName: z.string(),
  x: z.number().finite(),
  y: z.number().finite(),
  label: z.string(),
  description: z.string(),
  kind: markerKindSchema,
  subtype: z.string().optional(),
  color: z.string(),
  anchoredToProvince: z.boolean().optional(),
  image: z.string().optional(),
  topic: z.string().optional(),
  place: z.string().optional(),
  relation: z.string().optional(),
  presetItemId: z.string().optional(),
  sourceLabel: z.string().optional(),
  sourceUrl: z.string().optional(),
  labelOffset: mapPointSchema.optional(),
  labelScale: z.number().min(0.7).max(1.8).optional(),
  labelRotation: z.number().min(-180).max(180).optional(),
  createdAt: isoDateSchema,
});
const mapDrawingSchema = z.object({
  id: z.string().min(1),
  mapId: z.string().min(1),
  tool: z.enum([
    "pen",
    "arrow",
    "circle",
    "text",
    "mountain-fold",
    "mountain-fault-block",
    "mountain-volcanic",
  ]),
  color: z.string(),
  size: z.number().min(0.5).max(3).optional(),
  rotation: z.number().min(-180).max(180).optional(),
  points: z.array(mapPointSchema).min(1),
  text: z.string().optional(),
  createdAt: isoDateSchema,
});
const quizStatsSchema = z.object({
  id: z.string().min(1),
  mapId: z.string().min(1),
  sessions: z.number().int().nonnegative(),
  totalAnswered: z.number().int().nonnegative(),
  correctAnswers: z.number().int().nonnegative(),
  bestStreak: z.number().int().nonnegative(),
  updatedAt: isoDateSchema,
});
const quizMistakeSchema = z.object({
  id: z.string().min(1),
  questionId: z.string().min(1),
  mapId: z.string().min(1),
  prompt: z.string(),
  choices: z.array(z.string()),
  correctAnswer: z.string(),
  selectedAnswer: z.string(),
  explanation: z.string(),
  mistakeCount: z.number().int().positive(),
  lastAnsweredAt: isoDateSchema,
});
const dailyProgressSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  answered: z.number().int().nonnegative(),
  correct: z.number().int().nonnegative(),
  completed: z.boolean(),
  updatedAt: isoDateSchema,
});
const flashcardReviewSchema = z.object({
  reviewCount: z.number().int().nonnegative(),
  knownCount: z.number().int().nonnegative(),
  repeatCount: z.number().int().nonnegative(),
  mastery: z.number().int().min(0).max(5),
  lastRating: z.enum(["known", "again"]),
  lastReviewedAt: isoDateSchema,
});
const historyProgressSchema = z.object({
  visitedEventIds: z.array(z.string()),
  chronologyAttempts: z.number().int().nonnegative(),
  chronologyCorrect: z.number().int().nonnegative(),
  outcomeAttempts: z.number().int().nonnegative(),
  outcomeCorrect: z.number().int().nonnegative(),
  updatedAt: isoDateSchema,
});

export const atlasSnapshotSchema = z.object({
  version: z.literal(1),
  capturedAt: isoDateSchema,
  activeMapId: z.string().nullable(),
  studyMaps: z.array(studyMapSchema),
  mapFolders: z.array(mapFolderSchema).default([]),
  provinceRecords: z.array(provinceRecordSchema),
  mapMarkers: z.array(mapMarkerSchema),
  mapDrawings: z.array(mapDrawingSchema),
  quizStats: z.array(quizStatsSchema),
  quizMistakes: z.array(quizMistakeSchema),
  dailyProgress: z.array(dailyProgressSchema),
  flashcardProgress: z.record(z.string(), flashcardReviewSchema),
  historyProgress: historyProgressSchema.optional(),
});

export type AtlasSnapshot = {
  version: 1;
  capturedAt: string;
  activeMapId: string | null;
  studyMaps: StudyMap[];
  mapFolders: MapFolder[];
  provinceRecords: ProvinceRecord[];
  mapMarkers: MapMarker[];
  mapDrawings: MapDrawing[];
  quizStats: QuizStats[];
  quizMistakes: QuizMistake[];
  dailyProgress: DailyProgress[];
  flashcardProgress: FlashcardProgress;
  historyProgress?: HistoryProgress;
};

export function parseAtlasSnapshot(value: unknown) {
  return atlasSnapshotSchema.safeParse(value) as z.ZodSafeParseResult<AtlasSnapshot>;
}

function mergeByKey<T>(
  cloudItems: T[],
  localItems: T[],
  keyOf: (item: T) => string,
  timestampOf: (item: T) => string,
) {
  const merged = new Map<string, T>();
  cloudItems.forEach((item) => merged.set(keyOf(item), item));
  localItems.forEach((item) => {
    const key = keyOf(item);
    const current = merged.get(key);
    if (!current || timestampOf(item) >= timestampOf(current)) {
      merged.set(key, item);
    }
  });
  return [...merged.values()];
}

function valuesMatch(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function mergeByKeyThreeWay<T>(
  baseItems: T[],
  cloudItems: T[],
  localItems: T[],
  keyOf: (item: T) => string,
  timestampOf: (item: T) => string,
) {
  const base = new Map(baseItems.map((item) => [keyOf(item), item]));
  const cloud = new Map(cloudItems.map((item) => [keyOf(item), item]));
  const local = new Map(localItems.map((item) => [keyOf(item), item]));
  const keys = new Set([
    ...cloud.keys(),
    ...local.keys(),
    ...base.keys(),
  ]);
  const merged: T[] = [];

  keys.forEach((key) => {
    const baseItem = base.get(key);
    const cloudItem = cloud.get(key);
    const localItem = local.get(key);
    const localChanged = !valuesMatch(localItem, baseItem);
    const cloudChanged = !valuesMatch(cloudItem, baseItem);

    if (!localChanged) {
      if (cloudItem) merged.push(cloudItem);
      return;
    }
    if (!cloudChanged) {
      if (localItem) merged.push(localItem);
      return;
    }

    if (!localItem && cloudItem) {
      merged.push(cloudItem);
      return;
    }
    if (localItem && !cloudItem) {
      merged.push(localItem);
      return;
    }
    if (
      localItem &&
      cloudItem &&
      timestampOf(localItem) >= timestampOf(cloudItem)
    ) {
      merged.push(localItem);
    } else if (cloudItem) {
      merged.push(cloudItem);
    }
  });

  return merged;
}

export function mergeAtlasSnapshots(
  cloud: AtlasSnapshot,
  local: AtlasSnapshot,
): AtlasSnapshot {
  const flashcardProgress: FlashcardProgress = {
    ...cloud.flashcardProgress,
  };
  Object.entries(local.flashcardProgress).forEach(([cardId, review]) => {
    const current = flashcardProgress[cardId];
    if (!current || review.lastReviewedAt >= current.lastReviewedAt) {
      flashcardProgress[cardId] = review;
    }
  });
  const cloudHistory = cloud.historyProgress;
  const localHistory = local.historyProgress;
  const latestHistory =
    !cloudHistory ||
    (localHistory &&
      localHistory.updatedAt >= cloudHistory.updatedAt)
      ? localHistory
      : cloudHistory;
  const historyProgress = latestHistory
    ? {
        ...latestHistory,
        visitedEventIds: [
          ...new Set([
            ...(cloudHistory?.visitedEventIds ?? []),
            ...(localHistory?.visitedEventIds ?? []),
          ]),
        ],
      }
    : undefined;

  return {
    version: 1,
    capturedAt: new Date().toISOString(),
    activeMapId: local.activeMapId ?? cloud.activeMapId,
    studyMaps: mergeByKey(
      cloud.studyMaps,
      local.studyMaps,
      (item) => item.id,
      (item) => item.updatedAt,
    ),
    mapFolders: mergeByKey(
      cloud.mapFolders,
      local.mapFolders,
      (item) => item.id,
      (item) => item.updatedAt,
    ),
    provinceRecords: mergeByKey(
      cloud.provinceRecords,
      local.provinceRecords,
      (item) => item.id,
      (item) => item.updatedAt,
    ),
    mapMarkers: mergeByKey(
      cloud.mapMarkers,
      local.mapMarkers,
      (item) => item.id,
      (item) => item.createdAt,
    ),
    mapDrawings: mergeByKey(
      cloud.mapDrawings,
      local.mapDrawings,
      (item) => item.id,
      (item) => item.createdAt,
    ),
    quizStats: mergeByKey(
      cloud.quizStats,
      local.quizStats,
      (item) => item.id,
      (item) => item.updatedAt,
    ),
    quizMistakes: mergeByKey(
      cloud.quizMistakes,
      local.quizMistakes,
      (item) => item.id,
      (item) => item.lastAnsweredAt,
    ),
    dailyProgress: mergeByKey(
      cloud.dailyProgress,
      local.dailyProgress,
      (item) => item.date,
      (item) => item.updatedAt,
    ),
    flashcardProgress,
    historyProgress,
  };
}

export function mergeAtlasSnapshotsThreeWay(
  base: AtlasSnapshot,
  cloud: AtlasSnapshot,
  local: AtlasSnapshot,
): AtlasSnapshot {
  const twoWayStudyProgress = mergeAtlasSnapshots(cloud, local);
  const localActiveMapChanged = local.activeMapId !== base.activeMapId;

  return {
    version: 1,
    capturedAt: new Date().toISOString(),
    activeMapId: localActiveMapChanged
      ? local.activeMapId
      : cloud.activeMapId,
    studyMaps: mergeByKeyThreeWay(
      base.studyMaps,
      cloud.studyMaps,
      local.studyMaps,
      (item) => item.id,
      (item) => item.updatedAt,
    ),
    mapFolders: mergeByKeyThreeWay(
      base.mapFolders,
      cloud.mapFolders,
      local.mapFolders,
      (item) => item.id,
      (item) => item.updatedAt,
    ),
    provinceRecords: mergeByKeyThreeWay(
      base.provinceRecords,
      cloud.provinceRecords,
      local.provinceRecords,
      (item) => item.id,
      (item) => item.updatedAt,
    ),
    mapMarkers: mergeByKeyThreeWay(
      base.mapMarkers,
      cloud.mapMarkers,
      local.mapMarkers,
      (item) => item.id,
      (item) => item.createdAt,
    ),
    mapDrawings: mergeByKeyThreeWay(
      base.mapDrawings,
      cloud.mapDrawings,
      local.mapDrawings,
      (item) => item.id,
      (item) => item.createdAt,
    ),
    quizStats: mergeByKeyThreeWay(
      base.quizStats,
      cloud.quizStats,
      local.quizStats,
      (item) => item.id,
      (item) => item.updatedAt,
    ),
    quizMistakes: mergeByKeyThreeWay(
      base.quizMistakes,
      cloud.quizMistakes,
      local.quizMistakes,
      (item) => item.id,
      (item) => item.lastAnsweredAt,
    ),
    dailyProgress: mergeByKeyThreeWay(
      base.dailyProgress,
      cloud.dailyProgress,
      local.dailyProgress,
      (item) => item.date,
      (item) => item.updatedAt,
    ),
    flashcardProgress: twoWayStudyProgress.flashcardProgress,
    historyProgress: twoWayStudyProgress.historyProgress,
  };
}

function sortByStableKey<T>(items: T[], keyOf: (item: T) => string) {
  return [...items].sort((left, right) => {
    const leftKey = keyOf(left);
    const rightKey = keyOf(right);
    if (leftKey === rightKey) return 0;
    return leftKey < rightKey ? -1 : 1;
  });
}

function canonicalizeObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalizeObjectKeys);
  }
  if (!value || typeof value !== "object") return value;

  return Object.keys(value)
    .sort()
    .reduce<Record<string, unknown>>((result, key) => {
      result[key] = canonicalizeObjectKeys(
        (value as Record<string, unknown>)[key],
      );
      return result;
    }, {});
}

export function snapshotSignature(snapshot: AtlasSnapshot) {
  const normalized = {
    ...snapshot,
    capturedAt: "",
    studyMaps: sortByStableKey(snapshot.studyMaps, (item) => item.id),
    mapFolders: sortByStableKey(snapshot.mapFolders, (item) => item.id),
    provinceRecords: sortByStableKey(
      snapshot.provinceRecords,
      (item) => item.id,
    ),
    mapMarkers: sortByStableKey(snapshot.mapMarkers, (item) => item.id),
    mapDrawings: sortByStableKey(snapshot.mapDrawings, (item) => item.id),
    quizStats: sortByStableKey(snapshot.quizStats, (item) => item.id),
    quizMistakes: sortByStableKey(snapshot.quizMistakes, (item) => item.id),
    dailyProgress: sortByStableKey(
      snapshot.dailyProgress,
      (item) => item.date,
    ),
  };

  return JSON.stringify(canonicalizeObjectKeys(normalized));
}
