import Dexie, { type EntityTable } from "dexie";
import type {
  DailyProgress,
  MapDrawing,
  MapFolder,
  MapMarker,
  ProvinceRecord,
  QuizMistake,
  QuizStats,
  StudyMap,
} from "./types";
import { createId } from "./id";

export type CloudSyncState = {
  userId: string;
  snapshot: unknown;
  revision: number;
  updatedAt: string;
};

class GeographyDatabase extends Dexie {
  studyMaps!: EntityTable<StudyMap, "id">;
  mapFolders!: EntityTable<MapFolder, "id">;
  provinceRecords!: EntityTable<ProvinceRecord, "id">;
  mapMarkers!: EntityTable<MapMarker, "id">;
  mapDrawings!: EntityTable<MapDrawing, "id">;
  quizStats!: EntityTable<QuizStats, "id">;
  quizMistakes!: EntityTable<QuizMistake, "id">;
  dailyProgress!: EntityTable<DailyProgress, "date">;
  cloudSyncState!: EntityTable<CloudSyncState, "userId">;

  constructor() {
    super("cografya-atlasim");

    this.version(1).stores({
      studyMaps: "id, updatedAt",
      provinceRecords: "id, mapId, [mapId+provinceCode], updatedAt",
    });

    this.version(2).stores({
      studyMaps: "id, updatedAt",
      provinceRecords: "id, mapId, [mapId+provinceCode], updatedAt",
      mapMarkers: "id, mapId, provinceCode, [mapId+provinceCode], createdAt",
    });

    this.version(3).stores({
      studyMaps: "id, updatedAt",
      provinceRecords: "id, mapId, [mapId+provinceCode], updatedAt",
      mapMarkers: "id, mapId, provinceCode, [mapId+provinceCode], createdAt",
      mapDrawings: "id, mapId, tool, createdAt",
      quizStats: "id, mapId, updatedAt",
    });

    this.version(4).stores({
      studyMaps: "id, updatedAt",
      provinceRecords: "id, mapId, [mapId+provinceCode], updatedAt",
      mapMarkers: "id, mapId, provinceCode, [mapId+provinceCode], createdAt",
      mapDrawings: "id, mapId, tool, createdAt",
      quizStats: "id, mapId, updatedAt",
      quizMistakes: "id, questionId, mapId, lastAnsweredAt",
      dailyProgress: "date, completed, updatedAt",
    });

    this.version(5).stores({
      studyMaps: "id, folderId, updatedAt",
      mapFolders: "id, createdAt, updatedAt",
      provinceRecords: "id, mapId, [mapId+provinceCode], updatedAt",
      mapMarkers: "id, mapId, provinceCode, [mapId+provinceCode], createdAt",
      mapDrawings: "id, mapId, tool, createdAt",
      quizStats: "id, mapId, updatedAt",
      quizMistakes: "id, questionId, mapId, lastAnsweredAt",
      dailyProgress: "date, completed, updatedAt",
    });

    this.version(6).stores({
      studyMaps: "id, folderId, updatedAt",
      mapFolders: "id, createdAt, updatedAt",
      provinceRecords: "id, mapId, [mapId+provinceCode], updatedAt",
      mapMarkers: "id, mapId, provinceCode, [mapId+provinceCode], createdAt",
      mapDrawings: "id, mapId, tool, createdAt",
      quizStats: "id, mapId, updatedAt",
      quizMistakes: "id, questionId, mapId, lastAnsweredAt",
      dailyProgress: "date, completed, updatedAt",
      cloudSyncState: "userId, revision, updatedAt",
    });
  }
}

export const db = new GeographyDatabase();

export function createBlankMap(
  name = "Yeni çalışma haritası",
  themeColor = "#e9a23b",
): StudyMap {
  const now = new Date().toISOString();

  return {
    id: createId(),
    name,
    description: "",
    themeColor,
    showLabels: true,
    hiddenMarkerKinds: [],
    createdAt: now,
    updatedAt: now,
  };
}
