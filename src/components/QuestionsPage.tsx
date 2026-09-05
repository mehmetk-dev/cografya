import { StudyNavigation } from "./StudyNavigation";
import { useMemo, useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileQuestion,
  HelpCircle,
  Layers,
  Lightbulb,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import {
  ALL_QUESTIONS_DATA,
  QUESTION_PROGRESS_REPLACED_EVENT,
  loadQuestionUserStore,
  saveQuestionUserStore,
  type QuestionItem,
  type QuestionSubject,
  type QuestionUserStore,
} from "../questionsData";

type QuestionsPageProps = {
  onBack: () => void;
};

type StatusTab = "unanswered" | "wrong" | "solved" | "bookmarked" | "all";

export function QuestionsPage({ onBack }: QuestionsPageProps) {
  const [userStore, setUserStore] = useState<QuestionUserStore>(loadQuestionUserStore);
  const [stagedAnswers, setStagedAnswers] = useState<Record<string, string>>({});
  const [selectedSubject, setSelectedSubject] = useState<QuestionSubject | "Tümü">("Coğrafya");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusTab, setStatusTab] = useState<StatusTab>("unanswered");
  const [focusIndex, setFocusIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyMapFilter, setOnlyMapFilter] = useState(false);
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [persistenceError, setPersistenceError] = useState(false);
  const [retainedIds, setRetainedIds] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<Record<string, "sure" | "unsure">>({});
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refresh = () => setUserStore(loadQuestionUserStore());
    window.addEventListener(QUESTION_PROGRESS_REPLACED_EVENT, refresh);
    return () => window.removeEventListener(QUESTION_PROGRESS_REPLACED_EVENT, refresh);
  }, []);

  useEffect(() => {
    setRetainedIds([]);
  }, [selectedSubject, selectedCategory, statusTab, searchQuery, onlyMapFilter]);

  useEffect(() => {
    if (!drawerOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
      if (event.key !== "Tab") return;
      const items = drawerRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input, select, a[href]');
      if (!items?.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [drawerOpen]);

  useEffect(() => {
    try { saveQuestionUserStore(userStore); setPersistenceError(false); }
    catch { setPersistenceError(true); }
  }, [userStore]);

  // Stage an option
  const handleSelectOption = (questionId: string, optionKey: string) => {
    if (userStore.answers[questionId]) return;
    setStagedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  // Confirm and submit answer
  const handleConfirmAnswer = (question: QuestionItem) => {
    const stagedOpt = stagedAnswers[question.id];
    if (!stagedOpt || userStore.answers[question.id]) return;
    setRetainedIds(prev => [...new Set([...prev, question.id])]);

    const isCorrect = stagedOpt.toUpperCase() === question.correctAnswer.toUpperCase();
    setUserStore((prev) => {
      const nextAnswers = {
        ...prev.answers,
        [question.id]: {
          selectedOption: stagedOpt,
          isCorrect,
          answeredAt: new Date().toISOString(),
        },
      };
      return {
        ...prev,
        answers: nextAnswers,
      };
    });

    // Auto open solution
    setExpandedSolutions((prev) => ({
      ...prev,
      [question.id]: true,
    }));
  };

  // Toggle solution
  const toggleSolution = (questionId: string) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Toggle bookmark
  const toggleBookmark = (questionId: string) => {
    setUserStore((prev) => {
      const exists = prev.bookmarkedIds.includes(questionId);
      const nextBookmarks = exists
        ? prev.bookmarkedIds.filter((id) => id !== questionId)
        : [...prev.bookmarkedIds, questionId];
      return {
        ...prev,
        bookmarkedIds: nextBookmarks,
      };
    });
  };

  // Reset single question
  const resetQuestion = (questionId: string) => {
    setRetainedIds(prev => [...new Set([...prev, questionId])]);
    setUserStore((prev) => {
      const nextAnswers = { ...prev.answers };
      delete nextAnswers[questionId];
      return {
        ...prev,
        answers: nextAnswers,
      };
    });
    setStagedAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    setExpandedSolutions((prev) => ({
      ...prev,
      [questionId]: false,
    }));
  };

  // Reset all
  const handleResetAll = () => {
    if (window.confirm(`${selectedSubject} dersindeki cevaplarını sıfırlamak istediğine emin misin? Kaydettiğin sorular korunacak.`)) {
      const ids = new Set(scopeQuestions.map(q => q.id));
      const emptyStore: QuestionUserStore = { ...userStore, answers: Object.fromEntries(Object.entries(userStore.answers).filter(([id]) => !ids.has(id))) };
      setUserStore(emptyStore);
      setStagedAnswers({});
      setExpandedSolutions({});
      setFocusIndex(0);
      setDrawerOpen(false);
      setRetainedIds([]);
    }
  };

  // Scope questions by subject
  const scopeQuestions = useMemo(() => {
    return selectedSubject === "Tümü"
      ? ALL_QUESTIONS_DATA
      : ALL_QUESTIONS_DATA.filter((q) => q.subject === selectedSubject);
  }, [selectedSubject]);

  // Categories available for selected subject
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    for (const q of scopeQuestions) {
      if (q.category) set.add(q.category);
    }
    return Array.from(set);
  }, [scopeQuestions]);

  // Filtered questions based on status tab, category, map filter, and search
  const filteredQuestions = useMemo(() => {
    return scopeQuestions.filter((q) => {
      if (selectedCategory !== "all" && q.category !== selectedCategory) return false;
      if (onlyMapFilter && !q.isMapQuestion) return false;

      const ans = userStore.answers[q.id];
      if (!retainedIds.includes(q.id) && statusTab === "unanswered" && ans !== undefined) return false;
      if (!retainedIds.includes(q.id) && statusTab === "solved" && ans === undefined) return false;
      if (!retainedIds.includes(q.id) && statusTab === "wrong" && (!ans || ans.isCorrect)) return false;
      if (statusTab === "bookmarked" && !userStore.bookmarkedIds.includes(q.id)) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLocaleLowerCase("tr-TR").trim();
        const fullText = (
          q.questionText +
          " " +
          q.category +
          " " +
          q.topic +
          " " +
          Object.values(q.options).join(" ") +
          " " +
          q.explanation
        ).toLocaleLowerCase("tr-TR");
        if (!fullText.includes(query)) return false;
      }

      return true;
    });
  }, [scopeQuestions, selectedCategory, onlyMapFilter, statusTab, searchQuery, userStore, retainedIds]);

  // Ensure focusIndex is in bounds
  useEffect(() => {
    if (focusIndex >= filteredQuestions.length) {
      setFocusIndex(Math.max(0, filteredQuestions.length - 1));
    }
  }, [filteredQuestions.length, focusIndex]);

  // Statistics
  const stats = useMemo(() => {
    let answered = 0;
    let correct = 0;
    let wrong = 0;
    let mapCount = 0;

    for (const q of scopeQuestions) {
      if (q.isMapQuestion) mapCount++;
      const ans = userStore.answers[q.id];
      if (ans) {
        answered++;
        if (ans.isCorrect) correct++;
        else wrong++;
      }
    }

    const unanswered = scopeQuestions.length - answered;
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

    return {
      total: scopeQuestions.length,
      unanswered,
      answered,
      correct,
      wrong,
      accuracy,
      mapCount,
      bookmarked: userStore.bookmarkedIds.filter((id) =>
        scopeQuestions.some((q) => q.id === id),
      ).length,
    };
  }, [scopeQuestions, userStore]);

  // Current active question
  const currentQuestion = filteredQuestions[focusIndex] || null;
  const currentAnsweredAt = currentQuestion ? userStore.answers[currentQuestion.id]?.answeredAt : undefined;
  useEffect(() => {
    if (!currentAnsweredAt) return;
    document.querySelector(".question-feedback")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [currentAnsweredAt]);

  // Move to next question smoothly
  const handleNextQuestion = () => {
    if (focusIndex < filteredQuestions.length - 1) {
      setFocusIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Move to previous question smoothly
  const handlePrevQuestion = () => {
    if (focusIndex > 0) {
      setFocusIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="mobile-quiz-app">
      <StudyNavigation active="questions" />
      {/* 1. TOP HEADER (Super clean single row) */}
      <header className="mobile-quiz-topbar">
        <button
          type="button"
          className="mobile-back-btn"
          onClick={onBack}
          aria-label="Geri"
        >
          <ArrowLeft size={19} />
        </button>

        {/* Subject Selector dropdown pill */}
        <div className="mobile-subject-dropdown-wrap">
          <select
            className="mobile-subject-select"
            aria-label="Ders seç"
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value as QuestionSubject | "Tümü");
              setSelectedCategory("all");
              setFocusIndex(0);
            }}
          >
            {(["Coğrafya", "Tarih", "Vatandaşlık", "Güncel Bilgiler & Türkçe", "Tümü"] as const).map(subject => (
              <option key={subject} value={subject}>{subject} ({subject === "Tümü" ? ALL_QUESTIONS_DATA.length : ALL_QUESTIONS_DATA.filter(q => q.subject === subject).length})</option>
            ))}
          </select>
          <ChevronDown size={14} className="mobile-select-arrow" />
        </div>

        {/* Question Counter & Matrix button */}
        <button
          type="button"
          className="mobile-matrix-trigger-btn"
          onClick={() => setDrawerOpen(true)}
          title="Soru Listesi ve Filtreler"
          aria-label="Soru listesi ve filtreler"
        >
          <span className="matrix-counter-text">
            {filteredQuestions.length > 0 ? `${focusIndex + 1}/${filteredQuestions.length}` : "0"}
          </span>
          <SlidersHorizontal size={14} />
        </button>
      </header>

      <section className="question-workshop-intro">
        <div><span className="eyebrow">BİLGİNİ PEKİŞTİR</span><h1>Soru atölyesi<span>.</span></h1>
          <p>Düşün, cevabını seç, nedenini öğren. Her soru bir adım ileri.</p></div>
        <div className="question-workshop-stats" aria-label="Ders ilerlemesi">
          <div><strong>{stats.answered}<small>/{stats.total}</small></strong><span>Çözülen soru</span></div>
          <div><strong>{stats.answered ? `%${stats.accuracy}` : "—"}</strong><span>Doğruluk</span></div>
          <div><strong>{stats.wrong}</strong><span>Tekrar edilecek</span></div>
        </div>
        <div className="question-completion"><span>Ders ilerlemen</span><b>%{stats.total ? Math.round(stats.answered / stats.total * 100) : 0}</b>
          <progress aria-label="Ders ilerlemen" max={stats.total || 1} value={stats.answered} /></div>
      </section>

      {/* 2. STATUS TABS (Single clean horizontal pill bar) */}
      <nav className="mobile-status-nav" aria-label="Soru Durumu">
        <button
          type="button"
          className={`mobile-status-pill ${statusTab === "unanswered" ? "is-active" : ""}`}
          onClick={() => {
            setStatusTab("unanswered");
            setFocusIndex(0);
          }}
        >
          <span>🎯 Çözülecek</span>
          <b className="pill-badge">{stats.unanswered}</b>
        </button>

        <button
          type="button"
          className={`mobile-status-pill ${statusTab === "wrong" ? "is-active" : ""}`}
          onClick={() => {
            setStatusTab("wrong");
            setFocusIndex(0);
          }}
        >
          <span>❌ Yanlışlar</span>
          <b className="pill-badge pill-badge--red">{stats.wrong}</b>
        </button>

        <button
          type="button"
          className={`mobile-status-pill ${statusTab === "solved" ? "is-active" : ""}`}
          onClick={() => {
            setStatusTab("solved");
            setFocusIndex(0);
          }}
        >
          <span>✅ Çözülen</span>
          <b className="pill-badge pill-badge--green">{stats.answered}</b>
        </button>

        <button
          type="button"
          className={`mobile-status-pill ${statusTab === "bookmarked" ? "is-active" : ""}`}
          onClick={() => {
            setStatusTab("bookmarked");
            setFocusIndex(0);
          }}
        >
          <span>⭐ Kayıtlı</span>
          <b className="pill-badge pill-badge--amber">{stats.bookmarked}</b>
        </button>

        <button
          type="button"
          className={`mobile-status-pill ${statusTab === "all" ? "is-active" : ""}`}
          onClick={() => {
            setStatusTab("all");
            setFocusIndex(0);
          }}
        >
          <span>📚 Tümü</span>
          <b className="pill-badge">{stats.total}</b>
        </button>
      </nav>

      {persistenceError && <p className="question-storage-error" role="alert">Tarayıcıya kayıt yapılamadı. Bu sayfayı kapatmadan depolama alanını kontrol et.</p>}
      {/* 3. MAIN QUESTION CONTAINER */}
      <main className="mobile-question-body">
        {filteredQuestions.length === 0 ? (
          <div className="mobile-empty-state">
            <CheckCircle2 size={48} className="text-emerald" />
            <h2>
              {statusTab === "unanswered" && stats.unanswered === 0
                ? "Tebrikler! Çözülecek soru kalmadı."
                : statusTab === "wrong" && stats.wrong === 0
                  ? "Yanlışlar listen boş."
                  : "Bu filtrede soru bulunamadı."}
            </h2>
            <p>
              {statusTab === "unanswered"
                ? "Çözülenler sekmesinden cevaplarını inceleyebilir veya diğer derslere geçebilirsin."
                : "Filtreni veya ders seçimini değiştirebilirsin."}
            </p>
            <button
              type="button"
              className="mobile-empty-action-btn"
              onClick={() => {
                setStatusTab("all");
                setSelectedCategory("all");
                setOnlyMapFilter(false);
                setSearchQuery("");
                setFocusIndex(0);
              }}
            >
              Tüm Soruları Göster
            </button>
          </div>
        ) : currentQuestion ? (
          (() => {
            const q = currentQuestion;
            const submittedAns = userStore.answers[q.id];
            const isAnswered = submittedAns !== undefined;
            const staged = stagedAnswers[q.id];
            const isSolutionOpen = expandedSolutions[q.id] ?? false;
            const isBookmarked = userStore.bookmarkedIds.includes(q.id);

            return (
              <div className="mobile-question-sheet">
                {/* Meta Bar */}
                <div className="mobile-sheet-meta">
                  <div className="mobile-sheet-tags">
                    <span className="mobile-tag-number">Soru {q.subjectNumber}</span>
                    <span className="mobile-tag-category">{q.category}</span>
                    {q.isMapQuestion && (
                      <span className="mobile-tag-map">
                        <MapPin size={11} />
                        Harita
                      </span>
                    )}
                  </div>

                  <div className="mobile-sheet-actions">
                    <button
                      type="button"
                      className={`mobile-star-btn ${isBookmarked ? "is-active" : ""}`}
                      onClick={() => toggleBookmark(q.id)}
                      aria-label={isBookmarked ? "Soruyu kayıttan çıkar" : "Soruyu kaydet"}
                      aria-pressed={isBookmarked}
                    >
                      <Star size={18} fill={isBookmarked ? "#e9a23b" : "none"} />
                    </button>
                    {isAnswered && (
                      <button
                        type="button"
                        className="mobile-reset-btn"
                        onClick={() => resetQuestion(q.id)}
                        title="Tekrar çöz"
                        aria-label="Tekrar çöz"
                      >
                        <RotateCcw size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Subtopic */}
                {q.topic && q.topic !== q.category && (
                  <div className="mobile-sheet-topic">
                    <small>Konu:</small> {q.topic}
                  </div>
                )}

                {/* Question Stem */}
                <div className="mobile-sheet-stem">
                  {q.questionText.split("\n").map((line, lIdx) => (
                    <p key={lIdx}>{line}</p>
                  ))}
                </div>

                {/* Options List */}
                <div className="mobile-sheet-options" role="group" aria-label="Cevap seçenekleri">
                  {Object.entries(q.options).map(([optKey, optText]) => {
                    const isStaged = staged === optKey;
                    const isChosen = submittedAns?.selectedOption === optKey;
                    const isTheCorrectOne =
                      optKey.toUpperCase() === q.correctAnswer.toUpperCase();

                    let optionState = "is-default";
                    if (isAnswered) {
                      if (isChosen) {
                        optionState = submittedAns.isCorrect
                          ? "is-correct-picked"
                          : "is-wrong-picked";
                      } else if (isTheCorrectOne) {
                        optionState = "is-the-correct";
                      }
                    } else if (isStaged) {
                      optionState = "is-staged";
                    } else if (isSolutionOpen && isTheCorrectOne) {
                      optionState = "is-the-correct";
                    }

                    return (
                      <button
                        key={optKey}
                        type="button"
                        className={`mobile-option-card ${optionState}`}
                        onClick={() => handleSelectOption(q.id, optKey)}
                        disabled={isAnswered}
                        aria-pressed={isAnswered ? isChosen : isStaged}
                      >
                        <span className="mobile-option-letter">{optKey}</span>
                        <span className="mobile-option-text">{optText}</span>
                        <span className="mobile-option-icon">
                          {isAnswered ? (
                            isChosen ? (
                              submittedAns.isCorrect ? (
                                <Check size={18} className="text-emerald" />
                              ) : (
                                <X size={18} className="text-red" />
                              )
                            ) : isTheCorrectOne ? (
                              <Check size={18} className="text-emerald" />
                            ) : null
                          ) : (
                            <span
                              className={`mobile-radio-circle ${
                                isStaged ? "is-selected" : ""
                              }`}
                            />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {!isAnswered && staged && (
                  <div className="question-confidence" role="group" aria-label="Cevabından ne kadar eminsin?">
                    <span>Ne kadar eminsin?</span>
                    <button type="button" aria-pressed={confidence[q.id] === "sure"} onClick={() => setConfidence(prev => ({ ...prev, [q.id]: "sure" }))}>Eminim</button>
                    <button type="button" aria-pressed={confidence[q.id] === "unsure"} onClick={() => setConfidence(prev => ({ ...prev, [q.id]: "unsure" }))}>Kararsızım</button>
                  </div>
                )}
                {isAnswered && (
                  <div className={`question-feedback ${submittedAns.isCorrect ? "is-correct" : "is-wrong"}`} role="status">
                    {submittedAns.isCorrect ? <CheckCircle2 size={23} /> : <Lightbulb size={23} />}
                    <div><strong>{submittedAns.isCorrect ? "Doğru cevap, bir adım daha ileri!" : "Bu ayrımı birlikte netleştirelim."}</strong>
                      <p>{submittedAns.isCorrect
                        ? confidence[q.id] === "unsure" ? "Doğru düşündün. Açıklamayı okuyup bilgini sağlamlaştır." : "Neden doğru olduğunu kendi cümlenle açıklamayı dene."
                        : `Senin yanıtın ${submittedAns.selectedOption}; doğru yanıt ${q.correctAnswer}. Açıklamayı incele, sonra yeniden çöz.`}</p>
                    </div>
                  </div>
                )}

                {/* Obsidian-style Solution Callout */}
                {isSolutionOpen && (
                  <div className="mobile-obsidian-callout" aria-label="Açıklamalı çözüm">
                    <div className="callout-header">
                      <div className="callout-badge">
                        <CheckCircle2 size={16} />
                        <span>Doğru Cevap:</span>
                        <strong>{q.correctAnswer} Şıkkı</strong>
                      </div>
                    </div>

                    <div className="callout-content">
                      {q.explanation.split("\n").map((expLine, eIdx) => (
                        <p key={eIdx}>{expLine}</p>
                      ))}
                    </div>

                    <div className="question-recall-tip"><Lightbulb size={17} /><p><strong>Kendini yokla:</strong> Çözümü gizleyip doğru seçeneğin neden doğru olduğunu hatırlamaya çalış.</p></div>
                    <button className="question-review-button" type="button" onClick={() => toggleBookmark(q.id)}>
                      <Star size={16} />{isBookmarked ? "Tekrar listemden çıkar" : "Daha sonra tekrar etmek için kaydet"}
                    </button>
                  </div>
                )}
              </div>
            );
          })()
        ) : null}
      </main>

      {/* 4. FIXED STICKY THUMB ACTION BAR AT BOTTOM */}
      {currentQuestion && (
        <footer className="mobile-sticky-bottom-bar">
          {/* Previous Button */}
          <button
            type="button"
            className="mobile-bottom-nav-btn"
            disabled={focusIndex === 0}
            onClick={handlePrevQuestion}
            aria-label="Önceki Soru"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Primary Action Button (CEVAPLA / ÇÖZÜMÜ GÖR / SONRAKİ SORU) */}
          <div className="mobile-bottom-primary-action">
            {(() => {
              const q = currentQuestion;
              const submittedAns = userStore.answers[q.id];
              const isAnswered = submittedAns !== undefined;
              const staged = stagedAnswers[q.id];
              const isSolutionOpen = expandedSolutions[q.id] ?? false;

              if (isAnswered) {
                // If answered, make primary button "Next Question" or "Done"
                return (
                  <div className="mobile-answered-actions">
                    <button
                      type="button"
                      className="mobile-solution-toggle-btn"
                      onClick={() => toggleSolution(q.id)}
                    >
                      <Lightbulb size={16} />
                      <span>{isSolutionOpen ? "Çözümü Gizle" : "Çözümü Aç"}</span>
                    </button>
                    {focusIndex < filteredQuestions.length - 1 ? (
                      <button
                        type="button"
                        className="mobile-primary-next-btn"
                        onClick={handleNextQuestion}
                      >
                        <span>Sıradaki Soru</span>
                        <ChevronRight size={17} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="mobile-primary-next-btn"
                        onClick={() => setDrawerOpen(true)}
                      >
                        <span>Tümünü Gör</span>
                      </button>
                    )}
                  </div>
                );
              }

              // If not answered
              if (staged) {
                return (
                  <button
                    type="button"
                    className="mobile-submit-btn is-active"
                    onClick={() => handleConfirmAnswer(q)}
                  >
                    <Zap size={17} />
                    <span>{staged} Şıkkı ile Cevapla</span>
                  </button>
                );
              }

              return (
                <div className="mobile-unselected-actions">
                  <button
                    type="button"
                    className="mobile-peek-solution-btn"
                    onClick={() => toggleSolution(q.id)}
                  >
                    <Lightbulb size={16} />
                    <span>{isSolutionOpen ? "Çözümü Gizle" : "💡 Yanıtı Aç"}</span>
                  </button>
                </div>
              );
            })()}
          </div>

          {/* Next Button */}
          <button
            type="button"
            className="mobile-bottom-nav-btn"
            disabled={focusIndex >= filteredQuestions.length - 1}
            onClick={handleNextQuestion}
            aria-label="Sonraki Soru"
          >
            <ChevronRight size={20} />
          </button>
        </footer>
      )}

      {/* 5. SLIDE-UP DRAWER FOR FILTERS & QUESTION MATRIX */}
      {drawerOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setDrawerOpen(false)}>
          <div className="mobile-drawer-panel" ref={drawerRef} role="dialog" aria-modal="true" aria-label="Soru menüsü ve filtreler" onClick={(e) => e.stopPropagation()}>
            <header className="mobile-drawer-header">
              <div>
                <h3>Soru Menüsü & Filtreler</h3>
                <small>{selectedSubject} ({stats.total} Soru)</small>
              </div>
              <button
                type="button"
                className="mobile-drawer-close"
                aria-label="Filtreleri kapat"
                onClick={() => setDrawerOpen(false)}
              >
                <X size={18} />
              </button>
            </header>

            <div className="mobile-drawer-content">
              {/* Category selector */}
              <div className="drawer-filter-group">
                <label htmlFor="question-category">Konu Başlığı</label>
                <select
                  id="question-category"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setFocusIndex(0);
                  }}
                >
                  <option value="all">Tüm Konular ({availableCategories.length})</option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Map question toggle */}
              <div className="drawer-filter-row">
                <button
                  type="button"
                  className={`drawer-map-toggle ${onlyMapFilter ? "is-active" : ""}`}
                  onClick={() => {
                    setOnlyMapFilter(!onlyMapFilter);
                    setFocusIndex(0);
                  }}
                >
                  <MapPin size={15} />
                  <span>Sadece Haritalı Sorular ({stats.mapCount})</span>
                </button>
              </div>

              {/* Search */}
              <div className="drawer-search-row">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Soru veya kavram ara..."
                  aria-label="Soru veya kavram ara"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setFocusIndex(0);
                  }}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")}>
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Question Matrix (Tap to jump to any question) */}
              <div className="drawer-matrix-section">
                <div className="drawer-matrix-header">
                  <strong>Soruya Git ({filteredQuestions.length})</strong>
                  <div className="matrix-legend-dots">
                    <span><i className="dot is-correct" /> Doğru</span>
                    <span><i className="dot is-wrong" /> Yanlış</span>
                    <span><i className="dot is-empty" /> Boş</span>
                  </div>
                </div>

                <div className="drawer-matrix-grid">
                  {filteredQuestions.map((q, idx) => {
                    const ans = userStore.answers[q.id];
                    const isCur = idx === focusIndex;
                    let dotClass = "is-empty";
                    if (ans) {
                      dotClass = ans.isCorrect ? "is-correct" : "is-wrong";
                    }
                    if (isCur) dotClass += " is-current";

                    return (
                      <button
                        key={q.id}
                        type="button"
                        className={`drawer-grid-cell ${dotClass}`}
                        onClick={() => {
                          setFocusIndex(idx);
                          setDrawerOpen(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        {q.subjectNumber}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reset progress */}
              <div className="drawer-footer-actions">
                <button
                  type="button"
                  className="drawer-reset-progress-btn"
                  onClick={handleResetAll}
                >
                  <RotateCcw size={14} />
                  <span>Bu Dersteki Tüm İlerlememi Sıfırla</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
