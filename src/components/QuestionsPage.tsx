import { useMemo, useState, useEffect } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  FileQuestion,
  HelpCircle,
  Layers,
  Lightbulb,
  MapPin,
  PenTool,
  RotateCcw,
  Search,
  Sparkles,
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

type FilterStatus = "all" | "map" | "wrong" | "correct" | "unanswered" | "bookmarked";

export function QuestionsPage({ onBack }: QuestionsPageProps) {
  const [userStore, setUserStore] = useState<QuestionUserStore>(loadQuestionUserStore);
  const [stagedAnswers, setStagedAnswers] = useState<Record<string, string>>({});
  const [selectedSubject, setSelectedSubject] = useState<QuestionSubject | "Tümü">("Coğrafya");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const [visibleCount, setVisibleCount] = useState(25);

  useEffect(() => {
    saveQuestionUserStore(userStore);
  }, [userStore]);

  // Stage an option (user clicks an option without submitting yet)
  const handleSelectOption = (questionId: string, optionKey: string) => {
    // If already answered, don't change staged unless reset
    if (userStore.answers[questionId]) return;
    setStagedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  // Confirm and submit the answer (CEVAPLA button)
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

    // Automatically expand the solution so user sees the answer and explanation
    setExpandedSolutions((prev) => ({
      ...prev,
      [question.id]: true,
    }));
  };

  // Toggle "Yanıtı Aç / Çözümü Gizle"
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
    }
  };

  // Categories available for currently selected subject
  const availableCategories = useMemo(() => {
    const list =
      selectedSubject === "Tümü"
        ? ALL_QUESTIONS_DATA
        : ALL_QUESTIONS_DATA.filter((q) => q.subject === selectedSubject);
    const set = new Set<string>();
    for (const q of list) {
      if (q.category) set.add(q.category);
    }
    return Array.from(set);
  }, [selectedSubject]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return ALL_QUESTIONS_DATA.filter((q) => {
      // Subject filter
      if (selectedSubject !== "Tümü" && q.subject !== selectedSubject) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "all" && q.category !== selectedCategory) {
        return false;
      }
      // Status filter
      const answer = userStore.answers[q.id];
      if (statusFilter === "map" && !q.isMapQuestion) return false;
      if (statusFilter === "correct" && (!answer || !answer.isCorrect)) return false;
      if (statusFilter === "wrong" && (!answer || answer.isCorrect)) return false;
      if (statusFilter === "unanswered" && answer !== undefined) return false;
      if (statusFilter === "bookmarked" && !userStore.bookmarkedIds.includes(q.id)) return false;

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
  }, [selectedSubject, selectedCategory, statusFilter, searchQuery, userStore]);

  // Statistics for current scope
  const stats = useMemo(() => {
    const scopeQuestions =
      selectedSubject === "Tümü"
        ? ALL_QUESTIONS_DATA
        : ALL_QUESTIONS_DATA.filter((q) => q.subject === selectedSubject);

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

    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

    return {
      total: scopeQuestions.length,
      answered,
      correct,
      wrong,
      accuracy,
      mapCount,
      bookmarked: userStore.bookmarkedIds.length,
    };
  }, [selectedSubject, userStore]);

  // Visible questions slice
  const visibleQuestions = useMemo(() => {
    return filteredQuestions.slice(0, visibleCount);
  }, [filteredQuestions, visibleCount]);

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
            <ArrowLeft size={18} />
            <span>Atlasa Dön</span>
          </button>
          <div className="questions-page__title-box">
            <div className="title-eyebrow">
              <Sparkles size={13} />
              <span>KPSS SORU HAVUZU</span>
            </div>
            <h1>Çözümlü Soru Bankası</h1>
          </div>
        </div>

        <div className="questions-page__topbar-actions">
          {stats.answered > 0 && (
            <button
              type="button"
              className="questions-page__reset-btn"
              onClick={handleResetAll}
              title="Tüm cevap geçmişini sıfırla"
            >
              <RotateCcw size={15} />
              <span>İlerlemeyi Sıfırla</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="questions-page__content">
        {/* Subject Switcher Pills */}
        <section className="questions-subject-pills" aria-label="Ders Seçimi">
          <button
            type="button"
            className={`subject-pill ${selectedSubject === "Coğrafya" ? "is-active" : ""}`}
            onClick={() => {
              setSelectedSubject("Coğrafya");
              setSelectedCategory("all");
              setVisibleCount(25);
            }}
          >
            <Compass size={17} />
            <span>Coğrafya</span>
            <strong>91</strong>
          </button>

          <button
            type="button"
            className={`subject-pill ${selectedSubject === "Tarih" ? "is-active" : ""}`}
            onClick={() => {
              setSelectedSubject("Tarih");
              setSelectedCategory("all");
              setVisibleCount(25);
            }}
          >
            <Layers size={17} />
            <span>Tarih</span>
            <strong>176</strong>
          </button>

          <button
            type="button"
            className={`subject-pill ${selectedSubject === "Vatandaşlık" ? "is-active" : ""}`}
            onClick={() => {
              setSelectedSubject("Vatandaşlık");
              setSelectedCategory("all");
              setVisibleCount(25);
            }}
          >
            <FileQuestion size={17} />
            <span>Vatandaşlık</span>
            <strong>15</strong>
          </button>

          <button
            type="button"
            className={`subject-pill ${selectedSubject === "Güncel Bilgiler & Türkçe" ? "is-active" : ""}`}
            onClick={() => {
              setSelectedSubject("Güncel Bilgiler & Türkçe");
              setSelectedCategory("all");
              setVisibleCount(25);
            }}
          >
            <Sparkles size={17} />
            <span>Güncel & Türkçe</span>
            <strong>6</strong>
          </button>

          <button
            type="button"
            className={`subject-pill ${selectedSubject === "Tümü" ? "is-active" : ""}`}
            onClick={() => {
              setSelectedSubject("Tümü");
              setSelectedCategory("all");
              setVisibleCount(25);
            }}
          >
            <HelpCircle size={17} />
            <span>Tüm Havuz</span>
            <strong>288</strong>
          </button>
        </section>

        {/* Live Statistics Banner */}
        <section className="questions-stats-banner">
          <div className="stat-card">
            <span className="stat-label">Toplam Soru</span>
            <strong className="stat-val">{stats.total}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Çözülen</span>
            <strong className="stat-val">
              {stats.answered} <small>/ {stats.total}</small>
            </strong>
          </div>
          <div className="stat-card is-correct">
            <span className="stat-label">Doğru</span>
            <strong className="stat-val">{stats.correct}</strong>
          </div>
          <div className="stat-card is-wrong">
            <span className="stat-label">Yanlış</span>
            <strong className="stat-val">{stats.wrong}</strong>
          </div>
          <div className="stat-card is-accuracy">
            <span className="stat-label">Başarı Oranı</span>
            <strong className="stat-val">
              {stats.answered > 0 ? `%${stats.accuracy}` : "-"}
            </strong>
          </div>
          {stats.mapCount > 0 && (
            <div
              className={`stat-card is-clickable ${statusFilter === "map" ? "is-active-filter" : ""}`}
              onClick={() => setStatusFilter(statusFilter === "map" ? "all" : "map")}
              title="Sadece haritalı soruları göster"
            >
              <span className="stat-label">🗺️ Haritalı</span>
              <strong className="stat-val">{stats.mapCount}</strong>
            </div>
          )}
        </section>

        {/* Filter Controls Bar */}
        <section className="questions-filter-bar">
          {/* Category Dropdown */}
          <div className="filter-select-wrapper">
            <select
              className="filter-category-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setVisibleCount(25);
              }}
            >
              <option value="all">Tüm Konu Başlıkları ({availableCategories.length})</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="questions-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Soru metninde, kavramlarda veya şıklarda ara..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(25);
              }}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Aramayı temizle"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Quick Filters */}
          <div className="questions-status-filters">
            <button
              type="button"
              className={`filter-btn ${statusFilter === "all" ? "is-active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              Tümü
            </button>
            <button
              type="button"
              className={`filter-btn ${statusFilter === "map" ? "is-active" : ""}`}
              onClick={() => setStatusFilter(statusFilter === "map" ? "all" : "map")}
            >
              🗺️ Haritalı
            </button>
            <button
              type="button"
              className={`filter-btn ${statusFilter === "wrong" ? "is-active" : ""}`}
              onClick={() => setStatusFilter(statusFilter === "wrong" ? "all" : "wrong")}
            >
              ❌ Yanlışlarım
            </button>
            <button
              type="button"
              className={`filter-btn ${statusFilter === "bookmarked" ? "is-active" : ""}`}
              onClick={() => setStatusFilter(statusFilter === "bookmarked" ? "all" : "bookmarked")}
            >
              ⭐ Kaydedilenler
            </button>
          </div>
        </section>

        {/* Results Counter */}
        <div className="questions-results-info">
          <span>
            Toplam <strong>{filteredQuestions.length}</strong> soru listeleniyor
          </span>
          {visibleQuestions.length < filteredQuestions.length && (
            <small>
              (İlk {visibleQuestions.length} soru gösteriliyor)
            </small>
          )}
        </div>

        {/* Questions List */}
        <section className="questions-list">
          {visibleQuestions.length === 0 ? (
            <div className="questions-empty">
              <HelpCircle size={44} />
              <h3>Bu kriterlere uygun soru bulunamadı</h3>
              <p>Arama kelimesini veya seçtiğin filtreleri değiştirmeyi deneyebilirsin.</p>
              <button
                type="button"
                className="questions-empty-reset"
                onClick={() => {
                  setSelectedCategory("all");
                  setStatusFilter("all");
                  setSearchQuery("");
                }}
              >
                Filtreleri Sıfırla
              </button>
            </div>
          ) : (
            visibleQuestions.map((q) => {
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
                  {/* Card Header */}
                  <header className="question-card__header">
                    <div className="question-card__meta">
                      <span className="question-num-badge">
                        📌 Soru {q.subjectNumber}
                      </span>
                      <span className="question-category-tag">{q.category}</span>
                      {q.isMapQuestion && (
                        <span className="question-map-tag" title="Harita / Konum sorusu">
                          <MapPin size={13} />
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
                        <Star size={16} fill={isBookmarked ? "#e9a23b" : "none"} />
                      </button>
                      {isAnswered && (
                        <button
                          type="button"
                          className="question-card-reset"
                          onClick={() => resetQuestion(q.id)}
                          title="Cevabı temizle ve baştan çöz"
                        >
                          <RotateCcw size={14} />
                          <span>Yeniden Çöz</span>
                        </button>
                      )}
                    </div>
                  </header>

                  {/* Question Topic sub-headline if distinct */}
                  {q.topic && q.topic !== q.category && (
                    <div className="question-card__subtopic">
                      <small>Kazanım / Konu:</small> <span>{q.topic}</span>
                    </div>
                  )}

                  {/* Question Stem / Text */}
                  <div className="question-card__text">
                    {q.questionText.split("\n").map((line, lIdx) => (
                      <p key={lIdx}>{line}</p>
                    ))}
                  </div>

                  {/* Options List */}
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
                          {/* Radio indicator or status icon */}
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

                  {/* Student Paper Mark Hint */}
                  {q.markedAnswer && (
                    <div className="question-card__paper-hint">
                      <PenTool size={13} />
                      <small>Orijinal Test Kağıdındaki İşaret:</small>
                      <span className="paper-hint-tag">{q.markedAnswer} Şıkkı</span>
                      {!isAnswered && staged !== q.markedAnswer && (
                        <button
                          type="button"
                          className="paper-hint-apply-btn"
                          onClick={() => handleSelectOption(q.id, q.markedAnswer!)}
                        >
                          Kağıttaki Cevabımı Seç
                        </button>
                      )}
                    </div>
                  )}

                  {/* ACTION BAR: CEVAPLA & YANIT AÇ BUTTONS */}
                  <div className="question-card__action-bar">
                    {/* Cevapla Button */}
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
                        <span>{staged ? `${staged} Şıkkı ile Cevapla` : "Bir Şık Seç ve Cevapla"}</span>
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

                    {/* Yanıtı Aç / Çözümü Göster Button (Obsidian Callout Style) */}
                    <button
                      type="button"
                      className={`action-btn action-btn--toggle-solution ${
                        isSolutionOpen ? "is-open" : ""
                      }`}
                      onClick={() => toggleSolution(q.id)}
                    >
                      <Lightbulb size={16} />
                      <span>{isSolutionOpen ? "Yanıtı Gizle" : "💡 Yanıtı Aç & Çözümü Gör"}</span>
                      {isSolutionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {/* OBSIDIAN-STYLE COLLAPSIBLE CALLOUT SOLUTION DRAWER */}
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
                              <strong>Harita / Konumsal Analiz</strong>
                            </div>
                            <p>
                              Bu soru Türkiye fiziki/beşeri haritasındaki işaretli noktaların coğrafi
                              dağılışını sorgular. İlgili noktaların konumlarını ve çözüm gerekçesini
                              yukarıdaki açıklama doğrultusunda harita üzerinde gözünde canlandırabilirsin.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>

        {/* Load More Button */}
        {visibleQuestions.length < filteredQuestions.length && (
          <div className="questions-load-more">
            <button
              type="button"
              className="load-more-btn"
              onClick={() => setVisibleCount((prev) => prev + 25)}
            >
              <span>Daha Fazla Soru Göster ({filteredQuestions.length - visibleQuestions.length} soru kaldı)</span>
              <ChevronDown size={16} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
