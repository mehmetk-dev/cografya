import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Brain,
  Check,
  Eye,
  Layers3,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import {
  buildFlashcards,
  createFlashcardSession,
  getFlashcardStats,
  loadFlashcardProgress,
  rateFlashcard,
  saveFlashcardProgress,
  type FlashcardProgress,
  type FlashcardRating,
} from "../flashcards";
import type { StudyNoteTopic } from "../studyNotes";

type FlashcardStudyProps = {
  topics: StudyNoteTopic[];
  initialTopicId: string;
  onClose: () => void;
};

type SessionScope = "topic" | "all";

export function FlashcardStudy({
  topics,
  initialTopicId,
  onClose,
}: FlashcardStudyProps) {
  const allCards = useMemo(() => buildFlashcards(topics), [topics]);
  const topicCards = useMemo(
    () => allCards.filter((card) => card.topicId === initialTopicId),
    [allCards, initialTopicId],
  );
  const [scope, setScope] = useState<SessionScope>("topic");
  const [progress, setProgress] = useState<FlashcardProgress>(
    loadFlashcardProgress,
  );
  const cards = scope === "topic" ? topicCards : allCards;
  const [session, setSession] = useState(() =>
    createFlashcardSession(topicCards, progress),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [repeatCount, setRepeatCount] = useState(0);

  const currentCard = session[currentIndex];
  const finished = session.length > 0 && currentIndex >= session.length;
  const stats = getFlashcardStats(cards, progress);
  const completionPercent = session.length
    ? Math.min(100, Math.round((currentIndex / session.length) * 100))
    : 0;

  const startSession = (
    nextScope: SessionScope = scope,
    nextProgress: FlashcardProgress = progress,
  ) => {
    const nextCards = nextScope === "topic" ? topicCards : allCards;
    setScope(nextScope);
    setSession(createFlashcardSession(nextCards, nextProgress));
    setCurrentIndex(0);
    setRevealed(false);
    setKnownCount(0);
    setRepeatCount(0);
  };

  const rateCurrentCard = (rating: FlashcardRating) => {
    if (!currentCard || !revealed) return;

    const nextProgress = {
      ...progress,
      [currentCard.id]: rateFlashcard(progress[currentCard.id], rating),
    };
    setProgress(nextProgress);
    saveFlashcardProgress(nextProgress);
    setKnownCount((count) => count + (rating === "known" ? 1 : 0));
    setRepeatCount((count) => count + (rating === "again" ? 1 : 0));
    setCurrentIndex((index) => index + 1);
    setRevealed(false);
  };

  return (
    <section className="flashcard-study" aria-label="Akıllı tekrar kartları">
      <header className="flashcard-study__header">
        <button type="button" onClick={onClose}>
          <ArrowLeft size={17} />
          <span>Notlara dön</span>
        </button>
        <div>
          <span><Brain size={23} /></span>
          <div>
            <small>AKILLI TEKRAR</small>
            <h2>KPSS Bilgi Kartları</h2>
          </div>
        </div>
        <p>
          Zorlandığın kartlar sonraki turlarda daha sık gelir. İlerlemen bu
          cihazda otomatik saklanır.
        </p>
      </header>

      <div className="flashcard-study__toolbar">
        <div className="flashcard-study__scope" aria-label="Kart kapsamı">
          <button
            className={scope === "topic" ? "is-active" : ""}
            type="button"
            onClick={() => startSession("topic")}
          >
            Bu konu
            <span>{topicCards.length}</span>
          </button>
          <button
            className={scope === "all" ? "is-active" : ""}
            type="button"
            onClick={() => startSession("all")}
          >
            Tüm konular
            <span>{allCards.length}</span>
          </button>
        </div>

        <div className="flashcard-study__stats">
          <span><i /> {stats.unseen} yeni</span>
          <span><i /> {stats.learning} çalışılıyor</span>
          <span><i /> {stats.mastered} öğrenildi</span>
        </div>
      </div>

      {session.length === 0 ? (
        <div className="flashcard-study__empty">
          <Layers3 size={28} />
          <h3>Bu konu için henüz kart yok</h3>
          <p>Başka bir konu seçebilir veya tüm konularla çalışabilirsin.</p>
          <button type="button" onClick={() => startSession("all")}>
            Tüm kartları aç
          </button>
        </div>
      ) : finished ? (
        <div className="flashcard-study__summary">
          <span><Trophy size={34} /></span>
          <small>TUR TAMAMLANDI</small>
          <h3>Güzel tekrar!</h3>
          <p>
            Bu turda {session.length} kart gördün. Tekrar dediğin kartlar bir
            sonraki turda daha sık karşına çıkacak.
          </p>
          <div>
            <article>
              <strong>{knownCount}</strong>
              <span><Check size={15} /> Bildim</span>
            </article>
            <article>
              <strong>{repeatCount}</strong>
              <span><RotateCcw size={15} /> Tekrar</span>
            </article>
          </div>
          <button type="button" onClick={() => startSession()}>
            <RotateCcw size={16} />
            Yeni tur başlat
          </button>
        </div>
      ) : (
        <>
          <div className="flashcard-study__progress">
            <div>
              <span>Kart {currentIndex + 1} / {session.length}</span>
              <strong>%{completionPercent}</strong>
            </div>
            <span>
              <i style={{ width: `${completionPercent}%` }} />
            </span>
          </div>

          <article
            className={`flashcard-study__card ${revealed ? "is-revealed" : ""}`}
          >
            <div className="flashcard-study__card-meta">
              <span>
                {currentCard.kind === "exam" ? "KPSS AYIRICI" : "HIZLI TEKRAR"}
              </span>
              <small>{currentCard.topicTitle}</small>
            </div>

            <div className="flashcard-study__question">
              {currentCard.kind === "exam" ? (
                <Sparkles size={25} />
              ) : (
                <Brain size={25} />
              )}
              <small>{currentCard.subject}</small>
              <h3>{currentCard.prompt}</h3>
              {!revealed && (
                <p>Cevabı zihninden geçir, sonra kartı aç.</p>
              )}
            </div>

            {revealed && (
              <div className="flashcard-study__answer">
                <small>CEVAP</small>
                <p>{currentCard.answer}</p>
              </div>
            )}
          </article>

          <div className="flashcard-study__actions">
            {!revealed ? (
              <button
                className="flashcard-study__reveal"
                type="button"
                onClick={() => setRevealed(true)}
              >
                <Eye size={18} />
                Cevabı göster
              </button>
            ) : (
              <>
                <button
                  className="flashcard-study__again"
                  type="button"
                  onClick={() => rateCurrentCard("again")}
                >
                  <RotateCcw size={18} />
                  <span>
                    <strong>Tekrar et</strong>
                    <small>Bu kart daha sık gelsin</small>
                  </span>
                </button>
                <button
                  className="flashcard-study__known"
                  type="button"
                  onClick={() => rateCurrentCard("known")}
                >
                  <Check size={19} />
                  <span>
                    <strong>Bildim</strong>
                    <small>Öğrenme puanını artır</small>
                  </span>
                </button>
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}
