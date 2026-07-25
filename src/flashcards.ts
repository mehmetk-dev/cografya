import type { StudyNoteTopic } from "./studyNotes";

export const FLASHCARD_PROGRESS_KEY = "cografya-atlasim-flashcard-progress-v1";

export type FlashcardKind = "quick" | "exam";
export type FlashcardRating = "known" | "again";

export type Flashcard = {
  id: string;
  topicId: string;
  topicTitle: string;
  subject: string;
  kind: FlashcardKind;
  prompt: string;
  answer: string;
};

export type FlashcardReview = {
  reviewCount: number;
  knownCount: number;
  repeatCount: number;
  mastery: number;
  lastRating: FlashcardRating;
  lastReviewedAt: string;
};

export type FlashcardProgress = Record<string, FlashcardReview>;

export function buildFlashcards(topics: StudyNoteTopic[]): Flashcard[] {
  return topics
    .filter((topic) => topic.status === "ready")
    .flatMap((topic) => [
      ...topic.quickFacts.map((fact, index) => ({
        id: `${topic.id}:quick:${index}`,
        topicId: topic.id,
        topicTitle: topic.title,
        subject: topic.subject,
        kind: "quick" as const,
        prompt: `${topic.title} için temel bilgiyi hatırla`,
        answer: fact,
      })),
      ...topic.sections
        .filter(
          (section): section is typeof section & { examNote: string } =>
            Boolean(section.examNote?.trim()),
        )
        .map((section) => ({
          id: `${topic.id}:exam:${section.id}`,
          topicId: topic.id,
          topicTitle: topic.title,
          subject: topic.subject,
          kind: "exam" as const,
          prompt: section.title,
          answer: section.examNote,
        })),
    ]);
}

export function rateFlashcard(
  previous: FlashcardReview | undefined,
  rating: FlashcardRating,
  timestamp = new Date().toISOString(),
): FlashcardReview {
  const current = previous ?? {
    reviewCount: 0,
    knownCount: 0,
    repeatCount: 0,
    mastery: 0,
    lastRating: rating,
    lastReviewedAt: timestamp,
  };

  return {
    reviewCount: current.reviewCount + 1,
    knownCount: current.knownCount + (rating === "known" ? 1 : 0),
    repeatCount: current.repeatCount + (rating === "again" ? 1 : 0),
    mastery:
      rating === "known"
        ? Math.min(5, current.mastery + 1)
        : Math.max(0, current.mastery - 2),
    lastRating: rating,
    lastReviewedAt: timestamp,
  };
}

export function getFlashcardWeight(review: FlashcardReview | undefined) {
  if (!review) return 2;
  if (review.lastRating === "again") {
    return Math.min(6, 4 + Math.max(0, review.repeatCount - review.knownCount));
  }
  return 1;
}

export function buildWeightedFlashcardPool(
  cards: Flashcard[],
  progress: FlashcardProgress,
) {
  return cards.flatMap((card) =>
    Array.from(
      { length: getFlashcardWeight(progress[card.id]) },
      () => card,
    ),
  );
}

export function createFlashcardSession(
  cards: Flashcard[],
  progress: FlashcardProgress,
  limit = 20,
  random = Math.random,
) {
  const pool = buildWeightedFlashcardPool(cards, progress);

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }

  return pool.slice(0, Math.min(limit, pool.length));
}

export function getFlashcardStats(
  cards: Flashcard[],
  progress: FlashcardProgress,
) {
  return cards.reduce(
    (stats, card) => {
      const review = progress[card.id];
      if (!review) stats.unseen += 1;
      else if (review.mastery >= 3) stats.mastered += 1;
      else stats.learning += 1;
      return stats;
    },
    {
      total: cards.length,
      unseen: 0,
      learning: 0,
      mastered: 0,
    },
  );
}

function isValidReview(value: unknown): value is FlashcardReview {
  if (!value || typeof value !== "object") return false;
  const review = value as Partial<FlashcardReview>;

  return (
    Number.isInteger(review.reviewCount) &&
    Number.isInteger(review.knownCount) &&
    Number.isInteger(review.repeatCount) &&
    Number.isInteger(review.mastery) &&
    review.reviewCount! >= 0 &&
    review.knownCount! >= 0 &&
    review.repeatCount! >= 0 &&
    review.mastery! >= 0 &&
    review.mastery! <= 5 &&
    (review.lastRating === "known" || review.lastRating === "again") &&
    typeof review.lastReviewedAt === "string"
  );
}

export function parseFlashcardProgress(value: string | null): FlashcardProgress {
  if (!value) return {};

  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.values(parsed).every(isValidReview)
      ? (parsed as FlashcardProgress)
      : {};
  } catch {
    return {};
  }
}

export function loadFlashcardProgress(): FlashcardProgress {
  try {
    return parseFlashcardProgress(
      window.localStorage.getItem(FLASHCARD_PROGRESS_KEY),
    );
  } catch {
    return {};
  }
}

export function saveFlashcardProgress(progress: FlashcardProgress) {
  try {
    window.localStorage.setItem(
      FLASHCARD_PROGRESS_KEY,
      JSON.stringify(progress),
    );
  } catch {
    // Kart çalışması depolama kapalıyken de kesintisiz devam eder.
  }
}
