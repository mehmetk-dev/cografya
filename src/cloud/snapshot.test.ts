import { describe, expect, it } from "vitest";
import {
  mergeAtlasSnapshots,
  parseAtlasSnapshot,
  snapshotSignature,
  type AtlasSnapshot,
} from "./snapshot";

function snapshot(
  overrides: Partial<AtlasSnapshot> = {},
): AtlasSnapshot {
  return {
    version: 1,
    capturedAt: "2026-07-26T10:00:00.000Z",
    activeMapId: "map-a",
    studyMaps: [
      {
        id: "map-a",
        name: "Türkiye",
        description: "",
        themeColor: "#e9a23b",
        showLabels: true,
        createdAt: "2026-07-25T10:00:00.000Z",
        updatedAt: "2026-07-26T10:00:00.000Z",
      },
    ],
    mapFolders: [],
    provinceRecords: [],
    mapMarkers: [],
    mapDrawings: [],
    quizStats: [],
    quizMistakes: [],
    dailyProgress: [],
    flashcardProgress: {},
    ...overrides,
  };
}

describe("parseAtlasSnapshot", () => {
  it("accepts a complete snapshot", () => {
    expect(parseAtlasSnapshot(snapshot()).success).toBe(true);
  });

  it("rejects malformed cloud data before it reaches IndexedDB", () => {
    expect(
      parseAtlasSnapshot({
        version: 1,
        studyMaps: [{ id: 12 }],
      }).success,
    ).toBe(false);
  });

  it("özel dağ atlası sunumunu cihazlar arasında korur", () => {
    const parsed = parseAtlasSnapshot(
      snapshot({
        studyMaps: [
          {
            ...snapshot().studyMaps[0],
            presentation: "mountain-atlas",
          },
        ],
      }),
    );

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.studyMaps[0].presentation).toBe("mountain-atlas");
  });
});

describe("mergeAtlasSnapshots", () => {
  it("keeps the newest item per id and preserves maps from both devices", () => {
    const cloud = snapshot({
      capturedAt: "2026-07-26T09:00:00.000Z",
      studyMaps: [
        {
          ...snapshot().studyMaps[0],
          name: "Eski bulut adı",
          updatedAt: "2026-07-26T09:00:00.000Z",
        },
        {
          ...snapshot().studyMaps[0],
          id: "map-b",
          name: "Telefondaki harita",
          updatedAt: "2026-07-26T09:30:00.000Z",
        },
      ],
    });
    const local = snapshot({
      studyMaps: [
        {
          ...snapshot().studyMaps[0],
          name: "Bilgisayardaki yeni ad",
          updatedAt: "2026-07-26T10:00:00.000Z",
        },
      ],
    });

    const merged = mergeAtlasSnapshots(cloud, local);

    expect(merged.studyMaps).toHaveLength(2);
    expect(
      merged.studyMaps.find((entry) => entry.id === "map-a")?.name,
    ).toBe("Bilgisayardaki yeni ad");
    expect(merged.studyMaps.some((entry) => entry.id === "map-b")).toBe(true);
  });

  it("keeps the latest flashcard review per card", () => {
    const cloud = snapshot({
      flashcardProgress: {
        "card-1": {
          reviewCount: 1,
          knownCount: 1,
          repeatCount: 0,
          mastery: 1,
          lastRating: "known",
          lastReviewedAt: "2026-07-26T09:00:00.000Z",
        },
      },
    });
    const local = snapshot({
      flashcardProgress: {
        "card-1": {
          reviewCount: 2,
          knownCount: 1,
          repeatCount: 1,
          mastery: 0,
          lastRating: "again",
          lastReviewedAt: "2026-07-26T10:00:00.000Z",
        },
      },
    });

    expect(
      mergeAtlasSnapshots(cloud, local).flashcardProgress["card-1"]
        .lastRating,
    ).toBe("again");
  });
});

describe("snapshotSignature", () => {
  it("does not schedule another upload only because capture time changed", () => {
    const first = snapshot();
    const second = snapshot({
      capturedAt: "2026-07-26T11:00:00.000Z",
    });

    expect(snapshotSignature(first)).toBe(snapshotSignature(second));
  });

  it("treats collection order differences as the same atlas content", () => {
    const mapA = snapshot().studyMaps[0];
    const mapB = {
      ...mapA,
      id: "map-b",
      name: "İkinci harita",
    };
    const cloud = snapshot({ studyMaps: [mapB, mapA] });
    const indexedDb = snapshot({ studyMaps: [mapA, mapB] });

    expect(snapshotSignature(cloud)).toBe(snapshotSignature(indexedDb));
  });
});
