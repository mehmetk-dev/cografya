import { useMemo, useState, useEffect } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Compass,
  FileQuestion,
  Filter,
  Grid,
  HelpCircle,
  Layers,
  Lightbulb,
  List,
  MapPin,
  RotateCcw,
  Search,
  Sparkles,
  Square,
  Star,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import {
  ALL_QUESTIONS_DATA,
  loadQuestionUserStore,
  saveQuestionUserStore,
  type QuestionItem,
  type QuestionSubject,
  type QuestionUserStore,
} from "../questionsData";

type QuestionsPageProps = {
  onBack: () => void;
};

// Status Tabs: Çözülecekler, Çözülenler, Yanlışlarım, Kaydedilenler, Tümü
type StatusTab = "unanswered" | "solved" | "wrong" | "bookmarked" | "all";
type ViewMode = "focus" | "list";

export function QuestionsPage({ onBack }: QuestionsPageProps) {
  const [userStore, setUserStore] = useState<QuestionUserStore>(loadQuestionUserStore);
  const [stagedAnswers, setStagedAnswers] = useState<Record<string, string>>({});
  const [selectedSubject, setSelectedSubject] = useState<QuestionSubject | "Tümü">("Coğrafya");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusTab, setStatusTab] = useState<StatusTab>("unanswered");
  const [viewMode, setViewMode] = useState<ViewMode>("focus");
  const [focusIndex, setFocusIndex] = useState(0);
  const [gridOpen, setGridOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyMapFilter, setOnlyMapFilter] = useState(false);
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  
  // For List mode pagination (10 questions per page)
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    saveQuestionUserStore(userStore);
  }, [userStore]);

  // Handle selecting an option (staged before submit)
  const handleSelectOption = (questionId: string, optionKey: string) => {
    if (userStore.answers[questionId]) return; // already submitted
    setStagedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  // Submit and confirm answer (CEVAPLA)
  const handleConfirmAnswer = (question: QuestionItem) => {
    const stagedOpt = stagedAnswers[question.id];
    if (!stagedOpt) return;

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

    // Auto reveal solution
    setExpandedSolutions((prev) => ({
      ...prev,
      [question.id]: true,
    }));
  };

  // Toggle "Yanıtı Aç & Çözümü Gör"
  const toggleSolution = (questionId: string) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Toggle bookmark / star
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

  // Reset answer for a single question
  const resetQuestion = (questionId: string) => {
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

  // Reset all progress
  const handleResetAll = () => {
    if (window.confirm("Tüm soru çözüm geçmişini ve puanlarını sıfırlamak istediğine emin misin?")) {
      const emptyStore: QuestionUserStore = { answers: {}, bookmarkedIds: [] };
      setUserStore(emptyStore);
      saveQuestionUserStore(emptyStore);
      setStagedAnswers({});
      setExpandedSolutions({});
      setFocusIndex(0);
    }
  };

  // Base scope questions (by subject only)
  const scopeQuestions = useMemo(() => {
    return selectedSubject === "Tümü"
      ? ALL_QUESTIONS_DATA
      : ALL_QUESTIONS_DATA.filter((q) => q.subject === selectedSubject);
  }, [selectedSubject]);

  // Available categories for selected subject
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    for (const q of scopeQuestions) {
      if (q.category) set.add(q.category);
    }
    return Array.from(set);
  }, [scopeQuestions]);

  // Filtered questions based on status tab, category, map filter, and search query
  const filteredQuestions = useMemo(() => {
    return scopeQuestions.filter((q) => {
      // Category filter
      if (selectedCategory !== "all" && q.category !== selectedCategory) {
        return false;
      }
      // Map filter
      if (onlyMapFilter && !q.isMapQuestion) {
        return false;
      }
      // Status Tab filter
      const ans = userStore.answers[q.id];
      if (statusTab === "unanswered" && ans !== undefined) return false;
      if (statusTab === "solved" && ans === undefined) return false;
      if (statusTab === "wrong" && (!ans || ans.isCorrect)) return false;
      if (statusTab === "bookmarked" && !userStore.bookmarkedIds.includes(q.id)) return false;

      // Search query
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
  }, [scopeQuestions, selectedCategory, onlyMapFilter, statusTab, searchQuery, userStore]);

  // Keep focus index within bounds
  useEffect(() => {
    if (focusIndex >= filteredQuestions.length) {
      setFocusIndex(Math.max(0, filteredQuestions.length - 1));
    }
  }, [filteredQuestions.length, focusIndex]);

  // Overall statistics for current subject scope
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

  // Current question in Focus Mode
  const currentFocusQuestion = filteredQuestions[focusIndex] || null;

  // Pagination for List Mode
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / PAGE_SIZE));
  const paginatedListQuestions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredQuestions.slice(start, start + PAGE_SIZE);
  }, [filteredQuestions, currentPage]);

  return (
    <div className="questions-page">
      {/* Top Navigation Bar */}
      <header className="questions-page__topbar">
        <div className="questions-page__topbar-left">
          <button
            type="button"
            className="questions-page__back-btn"
            onClick={onBack}
            aria-label="Atlasa geri dön"
          >
            <ArrowLeft size={17} />
            <span>Atlasa Dön</span>
          </button>
          <div className="questions-page__title-box">
            <h1>Soru Havuzu</h1>
            <span>KPSS Hazırlık</span>
          </div>
        </div>

        {/* View Mode Switcher (Odak vs Liste) & Reset */}
        <div className="questions-page__topbar-actions">
          <div className="view-mode-toggle" aria-label="Görünüm Modu">
            <button
              type="button"
              className={`mode-btn ${viewMode === "focus" ? "is-active" : ""}`}
              onClick={() => setViewMode("focus")}
              title="Tek Soru (Odak) Modu - Telefondan rahatça çöz"
            >
              <Square size={14} />
              <span>Tek Soru</span>
            </button>
            <button
              type="button"
              className={`mode-btn ${viewMode === "list" ? "is-active" : ""}`}
              onClick={() => setViewMode("list")}
              title="Sayfalı Liste Modu (10 soru/sayfa)"
            >
              <List size={14} />
              <span>Liste</span>
            </button>
          </div>

          {stats.answered > 0 && (
            <button
              type="button"
              className="questions-page__reset-btn"
              onClick={handleResetAll}
              title="Tüm çözüm geçmişini sıfırla"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="questions-page__content">
        {/* Subject Switcher Bar (Coğrafya, Tarih, Vatandaşlık, vb.) */}
        <section className="questions-subject-pills" aria-label="Ders Seç">
          <button
            type="button"
            className={`subject-pill ${selectedSubject === "Coğrafya" ? "is-active" : ""}`}
            onClick={() => {
              setSelectedSubject("Coğrafya");
              setSelectedCategory("all");
              setFocusIndex(0);
              setCurrentPage(1);
            }}
          >
            <Compass size={16} />
            <span>Coğrafya</span>
            <strong>91</strong>
          </button>

          <button
            type="button"
            className={`subject-pill ${selectedSubject === "Tarih" ? "is-active" : ""}`}
            onClick={() => {
              setSelectedSubject("Tarih");
              setSelectedCategory("all");
              setFocusIndex(0);
              setCurrentPage(1);
            }}
          >
            <Layers size={16} />
            <span>Tarih</span>
            <strong>176</strong>
          </button>

          <button
            type="button"
            className={`subject-pill ${selectedSubject === "Vatandaşlık" ? "is-active" : ""}`}
            onClick={() => {
              setSelectedSubject("Vatandaşlık");
              setSelectedCategory("all");
              setFocusIndex(0);
              setCurrentPage(1);
            }}
          >
            <FileQuestion size={16} />
            <span>Vatandaşlık</span>
            <strong>15</strong>
          </button>

          <button
            type="button"
            className={`subject-pill ${selectedSubject === "Güncel Bilgiler & Türkçe" ? "is-active" : ""}`}
            onClick={() => {
              setSelectedSubject("Güncel Bilgiler & Türkçe");
              setSelectedCategory("all");
              setFocusIndex(0);
              setCurrentPage(1);
            }}
          >
            <Sparkles size={16} />
            <span>Güncel & Türkçe</span>
            <strong>6</strong>
          </button>

          <button
            type="button"
            className={`subject-pill ${selectedSubject === "Tümü" ? "is-active" : ""}`}
            onClick={() => {
              setSelectedSubject("Tümü");
              setSelectedCategory("all");
              setFocusIndex(0);
              setCurrentPage(1);
            }}
          >
            <HelpCircle size={16} />
            <span>Tümü</span>
            <strong>288</strong>
          </button>
        </section>

        {/* STATUS SEPARATION TABS: Çözülecekler vs Çözülenler vs Yanlışlarım */}
        <section className="questions-status-tabs" aria-label="Durum Filtresi">
          <button
            type="button"
            className={`status-tab ${statusTab === "unanswered" ? "is-active" : ""}`}
            onClick={() => {
              setStatusTab("unanswered");
              setFocusIndex(0);
              setCurrentPage(1);
            }}
          >
            <span className="status-tab__title">🎯 Çözülecekler</span>
            <span className="status-tab__badge">{stats.unanswered}</span>
          </button>

          <button
            type="button"
            className={`status-tab ${statusTab === "solved" ? "is-active" : ""}`}
            onClick={() => {
              setStatusTab("solved");
              setFocusIndex(0);
              setCurrentPage(1);
            }}
          >
            <span className="status-tab__title">✅ Çözülenler</span>
            <span className="status-tab__badge is-green">{stats.answered}</span>
          </button>

          <button
            type="button"
            className={`status-tab ${statusTab === "wrong" ? "is-active" : ""}`}
            onClick={() => {
              setStatusTab("wrong");
              setFocusIndex(0);
              setCurrentPage(1);
            }}
          >
            <span className="status-tab__title">❌ Yanlışlarım</span>
            <span className="status-tab__badge is-red">{stats.wrong}</span>
          </button>

          <button
            type="button"
            className={`status-tab ${statusTab === "bookmarked" ? "is-active" : ""}`}
            onClick={() => {
              setStatusTab("bookmarked");
              setFocusIndex(0);
              setCurrentPage(1);
            }}
          >
            <span className="status-tab__title">⭐ Kaydedilenler</span>
            <span className="status-tab__badge is-amber">{stats.bookmarked}</span>
          </button>

          <button
            type="button"
            className={`status-tab ${statusTab === "all" ? "is-active" : ""}`}
            onClick={() => {
              setStatusTab("all");
              setFocusIndex(0);
              setCurrentPage(1);
            }}
          >
            <span className="status-tab__title">📚 Tümü</span>
            <span className="status-tab__badge">{stats.total}</span>
          </button>
        </section>

        {/* Compact Filter Bar */}
        <section className="questions-subfilter-bar">
          <div className="subfilter-category">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setFocusIndex(0);
                setCurrentPage(1);
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

          <button
            type="button"
            className={`subfilter-btn ${onlyMapFilter ? "is-active" : ""}`}
            onClick={() => {
              setOnlyMapFilter(!onlyMapFilter);
              setFocusIndex(0);
              setCurrentPage(1);
            }}
          >
            <MapPin size={14} />
            <span>Haritalı ({stats.mapCount})</span>
          </button>

          <div className="subfilter-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Ara..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setFocusIndex(0);
                setCurrentPage(1);
              }}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* VIEW 1: FOCUS MODE (TEK SORU KART MODU - TELEFON DOSTU)                  */}
        {/* ========================================================================= */}
        {viewMode === "focus" ? (
          <section className="questions-focus-container">
            {filteredQuestions.length === 0 ? (
              <div className="questions-empty-card">
                <CheckCircle2 size={44} className="text-green" />
                <h3>Harika! Bu kategoride soru kalmadı</h3>
                <p>
                  {statusTab === "unanswered"
                    ? "Tüm soruları tamamladın! Çözülenler sekmesinden cevaplarını inceleyebilirsin."
                    : "Filtrelerini sıfırlayarak diğer soruları görüntüleyebilirsin."}
                </p>
                <button
                  type="button"
                  className="questions-empty-reset"
                  onClick={() => {
                    setStatusTab("all");
                    setSelectedCategory("all");
                    setOnlyMapFilter(false);
                    setSearchQuery("");
                  }}
                >
                  Tüm Soruları Göster
                </button>
              </div>
            ) : currentFocusQuestion ? (
              (() => {
                const q = currentFocusQuestion;
                const submittedAns = userStore.answers[q.id];
                const isAnswered = submittedAns !== undefined;
                const staged = stagedAnswers[q.id];
                const isSolutionOpen = expandedSolutions[q.id] ?? false;
                const isBookmarked = userStore.bookmarkedIds.includes(q.id);

                return (
                  <div className="focus-card-wrapper">
                    {/* Stepper & Progress Header */}
                    <div className="focus-header">
                      <div className="focus-progress-info">
                        <span className="focus-counter">
                          <strong>{focusIndex + 1}</strong> / {filteredQuestions.length}
                        </span>
                        <div className="focus-progress-track">
                          <div
                            className="focus-progress-fill"
                            style={{
                              width: `${((focusIndex + 1) / filteredQuestions.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        className="focus-grid-trigger"
                        onClick={() => setGridOpen(true)}
                        title="Tüm soru numaralarını gör ve atla"
                      >
                        <Grid size={15} />
                        <span>Soru Seçici</span>
                      </button>
                    </div>

                    {/* The Question Card */}
                    <article
                      className={`question-card question-card--focus ${
                        isAnswered
                          ? submittedAns.isCorrect
                            ? "is-solved-correct"
                            : "is-solved-wrong"
                          : staged
                            ? "is-staged"
                            : ""
                      }`}
                    >
                      {/* Meta / Badges */}
                      <header className="question-card__header">
                        <div className="question-card__meta">
                          <span className="question-num-badge">
                            📌 Soru {q.subjectNumber}
                          </span>
                          <span className="question-category-tag">{q.category}</span>
                          {q.isMapQuestion && (
                            <span className="question-map-tag">
                              <MapPin size={12} />
                              Harita Sorusu
                            </span>
                          )}
                        </div>

                        <div className="question-card__actions">
                          <button
                            type="button"
                            className={`question-bookmark-btn ${isBookmarked ? "is-bookmarked" : ""}`}
                            onClick={() => toggleBookmark(q.id)}
                            title={isBookmarked ? "Kaydedilenlerden Çıkar" : "Soruyu Kaydet"}
                          >
                            <Star size={17} fill={isBookmarked ? "#e9a23b" : "none"} />
                          </button>
                          {isAnswered && (
                            <button
                              type="button"
                              className="question-card-reset"
                              onClick={() => resetQuestion(q.id)}
                              title="Cevabı temizle ve baştan çöz"
                            >
                              <RotateCcw size={14} />
                              <span>Tekrar Çöz</span>
                            </button>
                          )}
                        </div>
                      </header>

                      {/* Topic note */}
                      {q.topic && q.topic !== q.category && (
                        <div className="question-card__subtopic">
                          <small>Konu:</small> <span>{q.topic}</span>
                        </div>
                      )}

                      {/* Question Text */}
                      <div className="question-card__text">
                        {q.questionText.split("\n").map((line, lIdx) => (
                          <p key={lIdx}>{line}</p>
                        ))}
                      </div>

                      {/* Options */}
                      <div className="question-card__options">
                        {Object.entries(q.options).map(([optKey, optText]) => {
                          const isStaged = staged === optKey;
                          const isChosen = submittedAns?.selectedOption === optKey;
                          const isTheCorrectOne = optKey.toUpperCase() === q.correctAnswer.toUpperCase();

                          let optClass = "option-btn";
                          if (isAnswered) {
                            if (isChosen) {
                              optClass += submittedAns.isCorrect
                                ? " is-correct-picked"
                                : " is-wrong-picked";
                            } else if (isTheCorrectOne) {
                              optClass += " is-the-correct";
                            }
                          } else if (isStaged) {
                            optClass += " is-staged-selected";
                          } else if (isSolutionOpen && isTheCorrectOne) {
                            optClass += " is-the-correct";
                          }

                          return (
                            <button
                              key={optKey}
                              type="button"
                              className={optClass}
                              onClick={() => handleSelectOption(q.id, optKey)}
                              disabled={isAnswered}
                            >
                              <span className="option-letter">{optKey}</span>
                              <span className="option-content">{optText}</span>
                              <span className="option-status-icon">
                                {isAnswered ? (
                                  isChosen ? (
                                    submittedAns.isCorrect ? (
                                      <Check size={17} className="text-green" />
                                    ) : (
                                      <X size={17} className="text-red" />
                                    )
                                  ) : isTheCorrectOne ? (
                                    <Check size={17} className="text-green" />
                                  ) : null
                                ) : (
                                  <span
                                    className={`option-radio-indicator ${
                                      isStaged ? "is-checked" : ""
                                    }`}
                                  />
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Action Bar (CEVAPLA & YANITI AÇ) */}
                      <div className="question-card__action-bar">
                        {!isAnswered ? (
                          <button
                            type="button"
                            className={`action-btn action-btn--submit ${
                              staged ? "is-ready" : "is-disabled"
                            }`}
                            onClick={() => handleConfirmAnswer(q)}
                            disabled={!staged}
                          >
                            <Zap size={16} />
                            <span>{staged ? `${staged} Şıkkı ile Cevapla` : "Bir Şık Seçip Cevapla"}</span>
                          </button>
                        ) : (
                          <div className="action-feedback-badge">
                            {submittedAns.isCorrect ? (
                              <div className="feedback-correct">
                                <CheckCircle2 size={16} />
                                <span>Tebrikler, Doğru Yanıt!</span>
                              </div>
                            ) : (
                              <div className="feedback-wrong">
                                <XCircle size={16} />
                                <span>Yanlış Yanıt! (Doğrusu: {q.correctAnswer})</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Obsidian Callout Toggle Button */}
                        <button
                          type="button"
                          className={`action-btn action-btn--toggle-solution ${
                            isSolutionOpen ? "is-open" : ""
                          }`}
                          onClick={() => toggleSolution(q.id)}
                        >
                          <Lightbulb size={16} />
                          <span>{isSolutionOpen ? "Yanıtı Gizle" : "💡 Yanıtı Aç & Çözüm"}</span>
                          {isSolutionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>

                      {/* Obsidian Callout Solution Drawer */}
                      {isSolutionOpen && (
                        <div className="obsidian-callout-solution">
                          <div className="obsidian-callout__header">
                            <div className="obsidian-callout__title">
                              <CheckCircle2 size={18} className="text-emerald" />
                              <span>Doğru Cevap:</span>
                              <strong className="correct-pill">{q.correctAnswer} Şıkkı</strong>
                            </div>
                          </div>

                          <div className="obsidian-callout__content">
                            <div className="solution-explanation-text">
                              {q.explanation.split("\n").map((expLine, eIdx) => (
                                <p key={eIdx}>{expLine}</p>
                              ))}
                            </div>

                            {q.isMapQuestion && (
                              <div className="obsidian-callout__map-box">
                                <div className="map-box-title">
                                  <MapPin size={15} />
                                  <strong>Harita & Konum İpucu</strong>
                                </div>
                                <p>
                                  Bu soru Türkiye haritasındaki numaralı bölgeleri sorgular.
                                  İlgili noktaların coğrafi konumunu yukarıdaki çözüm anlatımına
                                  göre değerlendirebilirsin.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </article>

                    {/* Bottom Navigation Stepper (Önceki / Sonraki) */}
                    <footer className="focus-footer-nav">
                      <button
                        type="button"
                        className="focus-nav-btn focus-nav-btn--prev"
                        disabled={focusIndex === 0}
                        onClick={() => setFocusIndex((prev) => Math.max(0, prev - 1))}
                      >
                        <ChevronLeft size={18} />
                        <span>Önceki Soru</span>
                      </button>

                      <button
                        type="button"
                        className="focus-nav-btn focus-nav-btn--next"
                        disabled={focusIndex >= filteredQuestions.length - 1}
                        onClick={() =>
                          setFocusIndex((prev) =>
                            Math.min(filteredQuestions.length - 1, prev + 1),
                          )
                        }
                      >
                        <span>Sonraki Soru</span>
                        <ChevronRight size={18} />
                      </button>
                    </footer>
                  </div>
                );
              })()
            ) : null}
          </section>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: PAGINATED LIST MODE (10 Soru / Sayfa - Yığılmayı Önler)            */
          /* ========================================================================= */
          <section className="questions-list-container">
            {paginatedListQuestions.length === 0 ? (
              <div className="questions-empty-card">
                <HelpCircle size={40} />
                <h3>Bu kriterlere uygun soru bulunamadı</h3>
                <p>Filtrelerini veya arama kelimeni değiştirmeyi deneyebilirsin.</p>
              </div>
            ) : (
              paginatedListQuestions.map((q) => {
                const submittedAns = userStore.answers[q.id];
                const isAnswered = submittedAns !== undefined;
                const staged = stagedAnswers[q.id];
                const isSolutionOpen = expandedSolutions[q.id] ?? false;
                const isBookmarked = userStore.bookmarkedIds.includes(q.id);

                return (
                  <article
                    key={q.id}
                    className={`question-card ${
                      isAnswered
                        ? submittedAns.isCorrect
                          ? "is-solved-correct"
                          : "is-solved-wrong"
                        : staged
                          ? "is-staged"
                          : ""
                    }`}
                    id={q.id}
                  >
                    <header className="question-card__header">
                      <div className="question-card__meta">
                        <span className="question-num-badge">
                          📌 Soru {q.subjectNumber}
                        </span>
                        <span className="question-category-tag">{q.category}</span>
                        {q.isMapQuestion && (
                          <span className="question-map-tag">
                            <MapPin size={12} />
                            Harita
                          </span>
                        )}
                      </div>

                      <div className="question-card__actions">
                        <button
                          type="button"
                          className={`question-bookmark-btn ${isBookmarked ? "is-bookmarked" : ""}`}
                          onClick={() => toggleBookmark(q.id)}
                          title="Kaydet"
                        >
                          <Star size={16} fill={isBookmarked ? "#e9a23b" : "none"} />
                        </button>
                        {isAnswered && (
                          <button
                            type="button"
                            className="question-card-reset"
                            onClick={() => resetQuestion(q.id)}
                            title="Sıfırla"
                          >
                            <RotateCcw size={13} />
                          </button>
                        )}
                      </div>
                    </header>

                    <div className="question-card__text">
                      {q.questionText.split("\n").map((line, lIdx) => (
                        <p key={lIdx}>{line}</p>
                      ))}
                    </div>

                    <div className="question-card__options">
                      {Object.entries(q.options).map(([optKey, optText]) => {
                        const isStaged = staged === optKey;
                        const isChosen = submittedAns?.selectedOption === optKey;
                        const isTheCorrectOne = optKey.toUpperCase() === q.correctAnswer.toUpperCase();

                        let optClass = "option-btn";
                        if (isAnswered) {
                          if (isChosen) {
                            optClass += submittedAns.isCorrect
                              ? " is-correct-picked"
                              : " is-wrong-picked";
                          } else if (isTheCorrectOne) {
                            optClass += " is-the-correct";
                          }
                        } else if (isStaged) {
                          optClass += " is-staged-selected";
                        } else if (isSolutionOpen && isTheCorrectOne) {
                          optClass += " is-the-correct";
                        }

                        return (
                          <button
                            key={optKey}
                            type="button"
                            className={optClass}
                            onClick={() => handleSelectOption(q.id, optKey)}
                            disabled={isAnswered}
                          >
                            <span className="option-letter">{optKey}</span>
                            <span className="option-content">{optText}</span>
                            <span className="option-status-icon">
                              {isAnswered ? (
                                isChosen ? (
                                  submittedAns.isCorrect ? (
                                    <Check size={16} className="text-green" />
                                  ) : (
                                    <X size={16} className="text-red" />
                                  )
                                ) : isTheCorrectOne ? (
                                  <Check size={16} className="text-green" />
                                ) : null
                              ) : (
                                <span
                                  className={`option-radio-indicator ${
                                    isStaged ? "is-checked" : ""
                                  }`}
                                />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="question-card__action-bar">
                      {!isAnswered ? (
                        <button
                          type="button"
                          className={`action-btn action-btn--submit ${
                            staged ? "is-ready" : "is-disabled"
                          }`}
                          onClick={() => handleConfirmAnswer(q)}
                          disabled={!staged}
                        >
                          <Zap size={15} />
                          <span>{staged ? `${staged} ile Cevapla` : "Cevapla"}</span>
                        </button>
                      ) : (
                        <div className="action-feedback-badge">
                          {submittedAns.isCorrect ? (
                            <div className="feedback-correct">
                              <CheckCircle2 size={15} />
                              <span>Doğru!</span>
                            </div>
                          ) : (
                            <div className="feedback-wrong">
                              <XCircle size={15} />
                              <span>Yanlış ({q.correctAnswer})</span>
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        className={`action-btn action-btn--toggle-solution ${
                          isSolutionOpen ? "is-open" : ""
                        }`}
                        onClick={() => toggleSolution(q.id)}
                      >
                        <Lightbulb size={15} />
                        <span>{isSolutionOpen ? "Gizle" : "💡 Yanıtı Aç"}</span>
                      </button>
                    </div>

                    {isSolutionOpen && (
                      <div className="obsidian-callout-solution">
                        <div className="obsidian-callout__header">
                          <div className="obsidian-callout__title">
                            <CheckCircle2 size={16} className="text-emerald" />
                            <span>Doğru Cevap:</span>
                            <strong className="correct-pill">{q.correctAnswer}</strong>
                          </div>
                        </div>
                        <div className="obsidian-callout__content">
                          <div className="solution-explanation-text">
                            {q.explanation.split("\n").map((expLine, eIdx) => (
                              <p key={eIdx}>{expLine}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-bar">
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} />
                  <span>Önceki Sayfa</span>
                </button>

                <div className="page-numbers">
                  Sayfa <strong>{currentPage}</strong> / {totalPages}
                </div>

                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <span>Sonraki Sayfa</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* ========================================================================= */}
      {/* QUICK JUMP MODAL / QUESTION MATRIX (SORU SEÇİCİ IZGARASI)                   */}
      {/* ========================================================================= */}
      {gridOpen && (
        <div className="matrix-modal-backdrop" onClick={() => setGridOpen(false)}>
          <div className="matrix-modal-card" onClick={(e) => e.stopPropagation()}>
            <header className="matrix-modal-header">
              <div>
                <h3>Soru Seçici ({filteredQuestions.length} Soru)</h3>
                <small>İstediğin soruya tek dokunuşla geç</small>
              </div>
              <button
                type="button"
                className="matrix-close-btn"
                onClick={() => setGridOpen(false)}
              >
                <X size={18} />
              </button>
            </header>

            <div className="matrix-legend">
              <span><i className="legend-dot is-correct" /> Doğru</span>
              <span><i className="legend-dot is-wrong" /> Yanlış</span>
              <span><i className="legend-dot is-unanswered" /> Çözülmemiş</span>
              <span><i className="legend-dot is-active" /> Seçili</span>
            </div>

            <div className="matrix-grid">
              {filteredQuestions.map((q, idx) => {
                const ans = userStore.answers[q.id];
                const isCur = idx === focusIndex;
                let statusClass = "is-unanswered";
                if (ans) {
                  statusClass = ans.isCorrect ? "is-correct" : "is-wrong";
                }
                if (isCur) statusClass += " is-current";

                return (
                  <button
                    key={q.id}
                    type="button"
                    className={`matrix-grid-cell ${statusClass}`}
                    onClick={() => {
                      setFocusIndex(idx);
                      setGridOpen(false);
                    }}
                  >
                    <span>{q.subjectNumber}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
