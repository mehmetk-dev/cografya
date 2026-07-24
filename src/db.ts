import Dexie, { type EntityTable } from "dexie";
import type {
  MapDrawing,
  MapMarker,
  ProvinceRecord,
  QuizStats,
  StudyMap,
} from "./types";

class GeographyDatabase extends Dexie {
  studyMaps!: EntityTable<StudyMap, "id">;
  provinceRecords!: EntityTable<ProvinceRecord, "id">;
  mapMarkers!: EntityTable<MapMarker, "id">;
  mapDrawings!: EntityTable<MapDrawing, "id">;
  quizStats!: EntityTable<QuizStats, "id">;

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
  }
}

export const db = new GeographyDatabase();

export function createBlankMap(
  name = "Yeni çalışma haritası",
  themeColor = "#e9a23b",
): StudyMap {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    name,
    description: "",
    themeColor,
    showLabels: true,
    hiddenMarkerKinds: [],
    createdAt: now,
    updatedAt: now,
  };
}
