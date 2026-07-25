import { describe, expect, it } from "vitest";
import {
  buildFlashcards,
  buildWeightedFlashcardPool,
  getFlashcardStats,
  getFlashcardWeight,
  parseFlashcardProgress,
  rateFlashcard,
} from "./flashcards";
import type { StudyNoteTopic } from "./studyNotes";

const topic: StudyNoteTopic = {
  id: "sample-topic",
  subject: "Doğal sistemler",
  title: "Örnek Konu",
  description: "Örnek açıklama",
  status: "ready",
  quickFacts: ["Birinci kısa bilgi", "İkinci kısa bilgi"],
  sections: [
    {
      id: "section-one",
      eyebrow: "TEMEL",
      title: "Birinci Bölüm",
      summary: "Bölüm özeti",
      examNote: "Sınavda ayıran bilgi",
    },
    {
      id: "section-two",
      eyebrow: "EK BİLGİ",
      title: "İkinci Bölüm",
      summary: "İkinci özet",
    },
  ],
  sources: [],
};

describe("flashcard deck generation", () => {
  it("creates cards from quick facts and KPSS exam notes", () => {
    const cards = buildFlashcards([topic]);

    expect(cards).toHaveLength(3);
    expect(cards.map((card) => card.id)).toEqual([
      "sample-topic:quick:0",
      "sample-topic:quick:1",
      "sample-topic:exam:section-one",
    ]);
    expect(cards[2]).toMatchObject({
      topicId: "sample-topic",
      topicTitle: "Örnek Konu",
      kind: "exam",
      prompt: "Birinci Bölüm",
      answer: "Sınavda ayıran bilgi",
    });
  });

  it("ignores planned topics", () => {
    const cards = buildFlashcards([{ ...topic, status: "planned" }]);

    expect(cards).toEqual([]);
  });
});

describe("flashcard review progress", () => {
  it("records repeat and known ratings with mastery changes", () => {
    const repeated = rateFlashcard(undefined, "again", "2026-07-25T10:00:00.000Z");
    const known = rateFlashcard(repeated, "known", "2026-07-25T10:01:00.000Z");

    expect(repeated).toMatchObject({
      reviewCount: 1,
      repeatCount: 1,
      knownCount: 0,
      mastery: 0,
      lastRating: "again",
    });
    expect(known).toMatchObject({
      reviewCount: 2,
      repeatCount: 1,
      knownCount: 1,
      mastery: 1,
      lastRating: "known",
    });
  });

  it("gives difficult cards more slots than unseen and known cards", () => {
    const difficult = rateFlashcard(undefined, "again", "2026-07-25T10:00:00.000Z");
    const known = rateFlashcard(undefined, "known", "2026-07-25T10:00:00.000Z");

    expect(getFlashcardWeight(difficult)).toBeGreaterThan(
      getFlashcardWeight(undefined),
    );
    expect(getFlashcardWeight(undefined)).toBeGreaterThan(
      getFlashcardWeight(known),
    );
  });

  it("duplicates difficult cards in the weighted session pool", () => {
    const cards = buildFlashcards([topic]).slice(0, 2);
    const progress = {
      [cards[0].id]: rateFlashcard(
        undefined,
        "again",
        "2026-07-25T10:00:00.000Z",
      ),
      [cards[1].id]: rateFlashcard(
        undefined,
        "known",
        "2026-07-25T10:00:00.000Z",
      ),
    };
    const pool = buildWeightedFlashcardPool(cards, progress);

    expect(pool.filter((card) => card.id === cards[0].id).length).toBeGreaterThan(
      pool.filter((card) => card.id === cards[1].id).length,
    );
  });

  it("summarizes unseen, learning and mastered cards", () => {
    const cards = buildFlashcards([topic]);
    const progress = {
      [cards[0].id]: {
        ...rateFlashcard(undefined, "known", "2026-07-25T10:00:00.000Z"),
        mastery: 3,
      },
      [cards[1].id]: rateFlashcard(
        undefined,
        "again",
        "2026-07-25T10:00:00.000Z",
      ),
    };

    expect(getFlashcardStats(cards, progress)).toEqual({
      total: 3,
      unseen: 1,
      learning: 1,
      mastered: 1,
    });
  });

  it("falls back safely when stored progress is invalid", () => {
    expect(parseFlashcardProgress("not-json")).toEqual({});
    expect(parseFlashcardProgress('{"card":{"mastery":"wrong"}}')).toEqual({});
    expect(parseFlashcardProgress(null)).toEqual({});
  });
});
