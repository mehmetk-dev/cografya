import { useEffect, useState } from "react";
import { Brain, Check, Trophy, X, XCircle } from "lucide-react";
import { getMarkerVisual } from "../markerKinds";
import type { ReadyQuizQuestion } from "../quizBanks";
import type {
  City,
  MapMarker,
  QuizAnswerResult,
  QuizMode,
} from "../types";
import { TurkeyMap, turkeyCities } from "./TurkeyMap";

type QuizModalProps = {
  open: boolean;
  markers?: MapMarker[];
  factQuestions?: ReadyQuizQuestion[];
  setTitle?: string;
  mode?: QuizMode;
  onClose: () => void;
  onAnswer: (result: QuizAnswerResult) => void;
};

type MapQuestion = {
  type: "map";
  city: City;
  marker?: MapMarker;
};

type ChoiceQuestion = {
  type: "choice";
  fact: ReadyQuizQuestion;
  choices: string[];
};

type QuizQuestion = MapQuestion | ChoiceQuestion;

type QuizAnswer = {
  correct: boolean;
  selectedLabel: string;
  selectedProvinceCode?: number;
};

const EMPTY_MARKERS: MapMarker[] = [];
const EMPTY_FACT_QUESTIONS: ReadyQuizQuestion[] = [];

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function createQuestions(
  markers: MapMarker[] = [],
  factQuestions: ReadyQuizQuestion[] = [],
): QuizQuestion[] {
  const mapQuestions = shuffle(markers).flatMap<MapQuestion>((marker) => {
    const city = turkeyCities.find(
      (candidate) => candidate.plateNumber === marker.provinceCode,
    );
    return city ? [{ type: "map", city, marker }] : [];
  });

  if (factQuestions.length > 0) {
    const selectedMapQuestions = mapQuestions.slice(0, 5);
    const selectedFactQuestions = shuffle(factQuestions)
      .slice(0, Math.max(5, 10 - selectedMapQuestions.length))
      .map<ChoiceQuestion>((fact) => ({
        type: "choice",
        fact,
        choices: shuffle(fact.choices),
      }));

    return shuffle(
      [...selectedMapQuestions, ...selectedFactQuestions].slice(0, 10),
    );
  }

  if (mapQuestions.length > 0) {
    return mapQuestions.slice(0, 10);
  }

  return shuffle(turkeyCities)
    .slice(0, 10)
    .map((city) => ({ type: "map", city }));
}

export function QuizModal({
  open,
  markers,
  factQuestions,
  setTitle,
  mode = "standard",
  onClose,
  onAnswer,
}: QuizModalProps) {
  const quizMarkers = markers ?? EMPTY_MARKERS;
  const quizFacts = factQuestions ?? EMPTY_FACT_QUESTIONS;
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answer, setAnswer] = useState<QuizAnswer | null>(null);

  useEffect(() => {
    if (!open) return;
    setQuestions(createQuestions(quizMarkers, quizFacts));
    setIndex(0);
    setScore(0);
    setStreak(0);
    setAnswer(null);
  }, [open, quizMarkers, quizFacts]);

  if (!open || questions.length === 0) return null;

  const finished = index >= questions.length;
  const target = questions[Math.min(index, questions.length - 1)];

  const recordAnswer = (
    correct: boolean,
    selectedLabel: string,
    selectedProvinceCode?: number,
  ) => {
    const nextStreak = correct ? streak + 1 : 0;
    setAnswer({ correct, selectedLabel, selectedProvinceCode });
    setStreak(nextStreak);
    if (correct) setScore((current) => current + 1);

    const mapReviewChoices =
      target.type === "map"
        ? shuffle([
            target.city.name,
            ...shuffle(
              turkeyCities.filter(
                (city) => city.plateNumber !== target.city.plateNumber,
              ),
            )
              .slice(0, 3)
              .map((city) => city.name),
          ])
        : [];

    onAnswer({
      questionId:
        target.type === "choice"
          ? target.fact.sourceQuestionId ?? `fact:${target.fact.id}`
          : `map:${target.marker?.presetItemId ?? target.marker?.id ?? target.city.id}`,
      prompt: questionPrompt,
      choices:
        target.type === "choice" ? target.choices : mapReviewChoices,
      correctAnswer:
        target.type === "choice"
          ? target.fact.correctAnswer
          : target.city.name,
      selectedAnswer: selectedLabel,
      explanation:
        target.type === "choice"
          ? target.fact.explanation
          : target.marker?.description ??
            `${target.city.name}, Türkiye haritasında doğru konumdur.`,
      correct,
      streak: nextStreak,
    });
  };

  const selectMapAnswer = (city: City) => {
    if (answer || finished || target.type !== "map") return;
    recordAnswer(
      city.plateNumber === target.city.plateNumber,
      city.name,
      city.plateNumber,
    );
  };

  const selectChoiceAnswer = (choice: string) => {
    if (answer || finished || target.type !== "choice") return;
    recordAnswer(choice === target.fact.correctAnswer, choice);
  };

  const nextQuestion = () => {
    setIndex((current) => current + 1);
    setAnswer(null);
  };

  const restart = () => {
    setQuestions(createQuestions(quizMarkers, quizFacts));
    setIndex(0);
    setScore(0);
    setStreak(0);
    setAnswer(null);
  };

  const questionPrompt =
    target.type === "choice"
      ? target.fact.prompt
      : target.marker
        ? `${target.marker.label} hangi ilde?`
        : `${target.city.name} ilini haritada bul`;
  const quizTitle =
    mode === "daily"
      ? "Günün 10 sorusu"
      : mode === "mixed"
        ? "Karışık KPSS denemesi"
        : mode === "mistakes"
          ? "Yanlışlar tekrarı"
          : setTitle
            ? `${setTitle} quizi`
            : "İli haritada bul";

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="quiz-modal" role="dialog" aria-modal="true">
        <header className="modal-header">
          <div>
            <span><Brain size={20} /></span>
            <div>
              <small>EZBER MODU</small>
              <h2>{quizTitle}</h2>
            </div>
          </div>
          <button type="button" aria-label="Testi kapat" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        {!finished ? (
          <>
            <div className="quiz-prompt">
              <div className="quiz-progress">
                <span
                  style={{
                    width: `${((index + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
              <span>SORU {index + 1} / {questions.length}</span>
              <h3>{questionPrompt}</h3>
              <div>
                <b>{score} doğru</b>
                <b>{streak} seri</b>
              </div>
            </div>

            {target.type === "map" ? (
              <div className="quiz-map">
                <TurkeyMap
                  selectedCode={answer?.selectedProvinceCode ?? null}
                  records={[]}
                  markers={[]}
                  themeColor={answer?.correct ? "#4f8b67" : "#d05f64"}
                  showLabels={false}
                  onSelect={selectMapAnswer}
                  exportMode
                />
              </div>
            ) : (
              <div className="quiz-choices">
                {target.choices.map((choice, choiceIndex) => {
                  const isCorrect = answer && choice === target.fact.correctAnswer;
                  const isWrong =
                    answer &&
                    !answer.correct &&
                    choice === answer.selectedLabel;
                  return (
                    <button
                      key={choice}
                      type="button"
                      className={[
                        "quiz-choice",
                        isCorrect ? "is-correct" : "",
                        isWrong ? "is-wrong" : "",
                      ].filter(Boolean).join(" ")}
                      disabled={Boolean(answer)}
                      onClick={() => selectChoiceAnswer(choice)}
                    >
                      <span>{String.fromCharCode(65 + choiceIndex)}</span>
                      <b>{choice}</b>
                      {isCorrect && <Check size={18} />}
                      {isWrong && <XCircle size={18} />}
                    </button>
                  );
                })}
              </div>
            )}

            {answer && (
              <div
                className={`quiz-feedback ${answer.correct ? "is-correct" : "is-wrong"}`}
              >
                {answer.correct ? <Check size={20} /> : <XCircle size={20} />}
                <div>
                  <strong>
                    {answer.correct
                      ? "Doğru bildin!"
                      : target.type === "map"
                        ? `Doğru cevap: ${target.city.name}`
                        : `Doğru cevap: ${target.fact.correctAnswer}`}
                  </strong>
                  {!answer.correct && (
                    <span>Senin cevabın: {answer.selectedLabel}</span>
                  )}
                  {target.type === "map" && target.marker && (
                    <span>
                      {getMarkerVisual(target.marker).label} ·{" "}
                      {target.marker.description}
                    </span>
                  )}
                  {target.type === "choice" && (
                    <span>{target.fact.explanation}</span>
                  )}
                </div>
                <button type="button" onClick={nextQuestion}>
                  {index === questions.length - 1
                    ? "Sonucu gör"
                    : "Sonraki soru"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="quiz-result">
            <span><Trophy size={38} /></span>
            <small>TEST TAMAMLANDI</small>
            <h3>{score} / {questions.length}</h3>
            <p>
              {score / questions.length >= 0.8
                ? "Harika! Konu bilgisi ve harita eşleştirmen çok güçlü."
                : score / questions.length >= 0.5
                  ? "İyi gidiyorsun. Açıklamaları inceleyip bir tur daha çöz."
                  : "Haritadaki bilgi kartlarını gözden geçirip yeniden deneyebilirsin."}
            </p>
            <div>
              <button type="button" onClick={restart}>
                Farklı sorularla çöz
              </button>
              <button type="button" onClick={onClose}>Haritaya dön</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
