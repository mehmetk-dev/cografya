import { useMemo, useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  BadgeCheck,
  BookOpen,
  Brain,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  Compass,
  Copy,
  Crown,
  Flame,
  GraduationCap,
  KeyRound,
  Landmark,
  Layers,
  Scale,
  ScrollText,
  Search,
  ShieldAlert,
  Sparkles,
  Swords,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  HISTORY_PERIODS,
  ALL_HISTORY_TIMELINE_EVENTS,
  ALL_MASTER_MNEMONICS,
  filterHistoryTimelineEvents,
  loadHistoryProgress,
  saveHistoryProgress,
  type HistoryPeriod,
  type HistoryProgress,
  type HistoryEventKind,
  type Mnemonic,
} from "../historyStudy";

type HistoryStudyPageProps = {
  onBack: () => void;
  onOpenAtaturk?: () => void;
};

function kindBadge(kind: HistoryEventKind) {
  switch (kind) {
    case "sultan":
      return { label: "Padişah & Dönem", icon: Crown, color: "is-sultan" };
    case "war":
      return { label: "Savaş & Sefer", icon: Swords, color: "is-war" };
    case "treaty":
      return { label: "Antlaşma & Diplomasi", icon: ScrollText, color: "is-treaty" };
    case "reform":
      return { label: "Islahat & Yenilik", icon: Zap, color: "is-reform" };
    case "crisis":
      return { label: "Kriz & İsyan", icon: ShieldAlert, color: "is-crisis" };
    case "constitution":
      return { label: "Anayasa & Rejim", icon: Scale, color: "is-constitution" };
    case "diplomacy":
      return { label: "Diplomasi", icon: Compass, color: "is-diplomacy" };
    case "culture":
      return { label: "Kültür & Teşkilat", icon: Landmark, color: "is-culture" };
    case "turning-point":
      return { label: "Dönüm Noktası", icon: Sparkles, color: "is-turning-point" };
    default:
      return { label: "Tarihî Olay", icon: BookOpen, color: "is-default" };
  }
}

export function HistoryStudyPage({ onBack, onOpenAtaturk }: HistoryStudyPageProps) {
  const [query, setQuery] = useState("");
  const [selectedKind, setSelectedKind] = useState<string>("all");
  const [progress, setProgress] = useState<HistoryProgress>(loadHistoryProgress);
  const [activeSection, setActiveSection] = useState<string>("kurulus");
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
  
  // Quiz Modal State
  const [quizOpen, setQuizOpen] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizSelectedChoice, setQuizSelectedChoice] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  // Mnemonic Vault Modal State
  const [mnemonicModalOpen, setMnemonicModalOpen] = useState(false);
  const [mnemonicPeriodFilter, setMnemonicPeriodFilter] = useState<string>("all");
  const [copiedMnemonic, setCopiedMnemonic] = useState<string | null>(null);

  // Toggle visited
  const toggleEventVisited = (eventId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const visited = progress.visitedEventIds.includes(eventId);
    const nextVisited = visited
      ? progress.visitedEventIds.filter((id) => id !== eventId)
      : [...progress.visitedEventIds, eventId];

    const next = { ...progress, visitedEventIds: nextVisited };
    setProgress(saveHistoryProgress(next));
  };

  const markAllInPeriod = (period: HistoryPeriod) => {
    const periodIds = period.events.map((e) => e.id);
    const nextVisited = Array.from(new Set([...progress.visitedEventIds, ...periodIds]));
    const next = { ...progress, visitedEventIds: nextVisited };
    setProgress(saveHistoryProgress(next));
  };

  const toggleExpand = (eventId: string) => {
    setExpandedEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const expandAllInPeriod = (period: HistoryPeriod) => {
    const next = { ...expandedEvents };
    const allExpanded = period.events.every((e) => next[e.id]);
    period.events.forEach((e) => {
      next[e.id] = !allExpanded;
    });
    setExpandedEvents(next);
  };

  // Scroll to section smoothly
  const scrollToPeriod = (periodId: string) => {
    setActiveSection(periodId);
    const element = document.getElementById(periodId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filtered search results
  const searchResults = useMemo(() => {
    return filterHistoryTimelineEvents(query, selectedKind);
  }, [query, selectedKind]);

  // Overall statistics
  const totalTimelineEvents = ALL_HISTORY_TIMELINE_EVENTS.length;
  const completedCount = progress.visitedEventIds.length;
  const overallPercent = Math.min(100, Math.round((completedCount / totalTimelineEvents) * 100));

  // Active section observer on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const period of HISTORY_PERIODS) {
        const el = document.getElementById(period.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(period.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filtered Mnemonics
  const filteredMnemonics = useMemo(() => {
    if (mnemonicPeriodFilter === "all") return ALL_MASTER_MNEMONICS;
    return ALL_MASTER_MNEMONICS.filter((m) => m.periodId === mnemonicPeriodFilter);
  }, [mnemonicPeriodFilter]);

  const copyMnemonicText = (mnemonic: Mnemonic) => {
    const text = `${mnemonic.title} (${mnemonic.code}):\n` +
      mnemonic.items.map((i) => `• [${i.letter}] ${i.name}: ${i.detail}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedMnemonic(mnemonic.code);
    setTimeout(() => setCopiedMnemonic(null), 2000);
  };

  // Simple KPSS Quick Quiz Generator
  const quizQuestions = useMemo(() => {
    return ALL_HISTORY_TIMELINE_EVENTS.filter((e) => e.examNote && e.causalChain).map((event) => {
      const wrongDistractors = ALL_HISTORY_TIMELINE_EVENTS.filter(
        (o) => o.id !== event.id && o.causalChain
      )
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((o) => o.causalChain!.result);

      const choices = [event.causalChain!.result, ...wrongDistractors].sort(
        () => 0.5 - Math.random()
      );

      return {
        event,
        prompt: `"${event.title}" (${event.dateLabel}) gelişmesinin tarihi sonucu aşağıdakilerden hangisidir?`,
        correct: event.causalChain!.result,
        choices,
        explanation: event.examNote!,
      };
    });
  }, []);

  const currentQuiz = quizQuestions[currentQuizIndex] || quizQuestions[0];

  const handleQuizAnswer = (choice: string) => {
    if (quizAnswered) return;
    setQuizSelectedChoice(choice);
    setQuizAnswered(true);
    const isCorrect = choice === currentQuiz.correct;
    const attempts = progress.quizAttempts ?? 0;
    const correct = progress.quizCorrect ?? 0;
    const next = {
      ...progress,
      quizAttempts: attempts + 1,
      quizCorrect: correct + (isCorrect ? 1 : 0),
    };
    setProgress(saveHistoryProgress(next));
  };

  const handleNextQuiz = () => {
    setQuizAnswered(false);
    setQuizSelectedChoice(null);
    setCurrentQuizIndex((prev) => (prev + 1) % quizQuestions.length);
  };

  return (
    <div className="history-atlas-root">
      {/* 1. STICKY TOPBAR */}
      <header className="history-atlas-topbar">
        <div className="history-atlas-topbar__inner">
          <div className="history-atlas-topbar__left">
            <button
              type="button"
              className="history-atlas-back-btn"
              onClick={onBack}
              title="Coğrafya haritasına dön"
            >
              <ArrowLeft size={16} />
              <span>Coğrafyaya Dön</span>
            </button>
            <div className="history-atlas-title-block">
              <div className="history-atlas-brand">
                <Crown size={19} className="history-crown-icon" />
                <strong>Osmanlı Tarihi & Medeniyeti</strong>
              </div>
              <span className="history-atlas-subtitle">KPSS Kapsamlı Kronoloji ve Kültür Atlası</span>
            </div>
          </div>

          {/* Quick Period Navigation Pills */}
          <nav className="history-atlas-period-nav" aria-label="Dönemler arası geçiş">
            {HISTORY_PERIODS.map((period) => {
              const isActive = activeSection === period.id;
              const periodVisited = period.events.filter((e) =>
                progress.visitedEventIds.includes(e.id)
              ).length;
              const periodTotal = period.events.length;

              return (
                <button
                  key={period.id}
                  type="button"
                  className={`history-period-pill ${isActive ? "is-active" : ""}`}
                  style={{ "--pill-accent": period.accentColor } as React.CSSProperties}
                  onClick={() => scrollToPeriod(period.id)}
                >
                  <span>{period.shortTitle}</span>
                  {periodTotal > 0 && (
                    <small>
                      {periodVisited}/{periodTotal}
                    </small>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="history-atlas-topbar__right">
            <button
              type="button"
              className="history-mnemonic-vault-btn"
              onClick={() => setMnemonicModalOpen(true)}
              title="Tüm KPSS Hafıza Kodlamaları & Şifreleri"
            >
              <KeyRound size={15} />
              <span>Şifreler Bankası ({ALL_MASTER_MNEMONICS.length})</span>
            </button>
            <button
              type="button"
              className="history-quiz-launch-btn"
              onClick={() => setQuizOpen(true)}
              title="KPSS Neden-Sonuç Testi"
            >
              <Brain size={15} />
              <span>Soru Çöz</span>
            </button>
            <div className="history-progress-widget" title={`${completedCount} / ${totalTimelineEvents} olay incelendi`}>
              <div className="history-progress-text">
                <Sparkles size={14} />
                <span>%{overallPercent}</span>
              </div>
              <div className="history-progress-track">
                <div className="history-progress-bar" style={{ width: `${overallPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="history-search-strip">
          <div className="history-search-container">
            <div className="history-search-input-wrapper">
              <Search size={16} />
              <input
                type="text"
                value={query}
                placeholder="Padişah, savaş, antlaşma, ıslahat, şifre (örn: SINAV, TOKMAK, Kırım, Mohaç)..."
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Temizle">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="history-filter-pills">
              <button
                type="button"
                className={`filter-pill ${selectedKind === "all" ? "is-active" : ""}`}
                onClick={() => setSelectedKind("all")}
              >
                Tümü
              </button>
              <button
                type="button"
                className={`filter-pill ${selectedKind === "sultan" ? "is-active" : ""}`}
                onClick={() => setSelectedKind("sultan")}
              >
                👑 Padişahlar
              </button>
              <button
                type="button"
                className={`filter-pill ${selectedKind === "war" ? "is-active" : ""}`}
                onClick={() => setSelectedKind("war")}
              >
                ⚔️ Savaşlar
              </button>
              <button
                type="button"
                className={`filter-pill ${selectedKind === "treaty" ? "is-active" : ""}`}
                onClick={() => setSelectedKind("treaty")}
              >
                📜 Antlaşmalar
              </button>
              <button
                type="button"
                className={`filter-pill ${selectedKind === "reform" ? "is-active" : ""}`}
                onClick={() => setSelectedKind("reform")}
              >
                ⚡ Islahatlar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. GRAND HERO BANNER */}
      <section className="history-hero-grand">
        <div className="history-hero-grand__overlay" />
        <div className="history-hero-grand__content">
          <div className="history-hero-badge">
            <GraduationCap size={16} />
            <span>KPSS & MEB MÜFREDATI OSMANLI TARİHİ KÜLLİYATI</span>
          </div>
          <h1>
            623 Yıllık Cihan Tarihini <br />
            <span>Nedenleriyle, Kodlamalarıyla ve Şifreleriyle</span> Keşfet
          </h1>
          <p>
            Kuruluştan Dağılmaya tüm padişahlar, meydan savaşları, tarihi antlaşmalar, Batılılaşma ıslahatları ve
            Osmanlı Kültür-Medeniyeti. Aşağı doğru kaydırarak zevkle oku ve kalıcı kodlamalarla öğren.
          </p>

          <div className="history-hero-stats-row">
            <div className="history-hero-stat-card">
              <strong>623 Yıl</strong>
              <span>1299 – 1922 İhtişamı</span>
            </div>
            <div className="history-hero-stat-card">
              <strong>6 Ana Dönem</strong>
              <span>Kuruluş'tan Kültür'e</span>
            </div>
            <div className="history-hero-stat-card">
              <strong>36 Padişah</strong>
              <span>Mahlasları ve İcraatları</span>
            </div>
            <div
              className="history-hero-stat-card is-highlight"
              style={{ cursor: "pointer" }}
              onClick={() => setMnemonicModalOpen(true)}
              title="Tüm hafıza şifrelerini aç"
            >
              <strong>🔑 {ALL_MASTER_MNEMONICS.length} Hafıza Şifresi</strong>
              <span>SINAV II · TOKMAK · 31313 · SAKAR · BBG</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEARCH RESULTS (IF QUERY ACTIVE) */}
      {query && (
        <section className="history-search-results-section">
          <div className="history-search-results-header">
            <h2>
              Arama Sonuçları: <span>"{query}"</span>
            </h2>
            <span className="results-count-badge">{searchResults.length} sonuç bulundu</span>
          </div>

          {searchResults.length === 0 ? (
            <div className="history-empty-results">
              <CircleAlert size={36} />
              <strong>Aradığınız kriterlere uygun olay veya bilgi bulunamadı.</strong>
              <p>Farklı bir kelime (örn: 'Viyana', 'Tanzimat', 'Süleyman', 'Mecelle', 'TOKMAK') deneyebilirsiniz.</p>
            </div>
          ) : (
            <div className="history-search-cards-grid">
              {searchResults.map((event) => {
                const b = kindBadge(event.kind);
                const isVisited = progress.visitedEventIds.includes(event.id);
                const BadgeIcon = b.icon;

                return (
                  <article key={event.id} className={`history-search-card ${isVisited ? "is-visited" : ""}`}>
                    <header className="history-search-card__header">
                      <span className={`kind-tag ${b.color}`}>
                        <BadgeIcon size={13} />
                        {b.label}
                      </span>
                      <span className="date-tag">{event.dateLabel}</span>
                    </header>
                    <h3>{event.title}</h3>
                    {event.sultan && <span className="sultan-tag">👑 {event.sultan} {event.mahlas ? `(${event.mahlas})` : ""}</span>}
                    <p>{event.summary}</p>
                    {event.mnemonic && (
                      <div className="history-mnemonic-chip-mini">
                        <KeyRound size={13} />
                        <strong>{event.mnemonic.code}:</strong> {event.mnemonic.title}
                      </div>
                    )}
                    {event.examNote && (
                      <div className="history-exam-callout mini">
                        <Target size={14} />
                        <div>
                          <strong>KPSS Ayırıcı:</strong> {event.examNote}
                        </div>
                      </div>
                    )}
                    <footer className="history-search-card__footer">
                      <button
                        type="button"
                        className={`visited-btn ${isVisited ? "is-checked" : ""}`}
                        onClick={(e) => toggleEventVisited(event.id, e)}
                      >
                        <CheckCircle2 size={15} />
                        <span>{isVisited ? "Öğrenildi" : "Öğrenildi İşaretle"}</span>
                      </button>
                      <button
                        type="button"
                        className="jump-to-era-btn"
                        onClick={() => {
                          setQuery("");
                          scrollToPeriod(event.topicId);
                        }}
                      >
                        <span>Döneme Git</span>
                        <ChevronRight size={14} />
                      </button>
                    </footer>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 4. MAIN LINEAR DOWNWARD TIMELINE STREAM */}
      <main className="history-linear-stream">
        {HISTORY_PERIODS.map((period, periodIndex) => {
          const isCulture = period.id === "kultur-uygarlik";
          const periodVisited = period.events.filter((e) =>
            progress.visitedEventIds.includes(e.id)
          ).length;
          const periodTotal = period.events.length;
          const periodPercent = periodTotal > 0 ? Math.round((periodVisited / periodTotal) * 100) : 100;
          const periodMnemonics = ALL_MASTER_MNEMONICS.filter((m) => m.periodId === period.id);

          return (
            <section
              key={period.id}
              id={period.id}
              className="history-period-block"
              style={{ "--period-accent": period.accentColor } as React.CSSProperties}
            >
              {/* PERIOD HEADER BANNER */}
              <div className="history-period-banner">
                <div className="history-period-banner__image-box">
                  <img src={period.image} alt={period.title} className="history-period-banner__img" />
                  <div className="history-period-banner__overlay" />
                </div>

                <div className="history-period-banner__content">
                  <div className="history-period-meta-row">
                    <span className="history-period-number">DÖNEM {String(periodIndex + 1).padStart(2, "0")}</span>
                    <span className="history-period-dates">{period.period}</span>
                    <span className="history-period-badge">{period.badge}</span>
                  </div>

                  <h2 className="history-period-heading">{period.title}</h2>
                  <p className="history-period-slogan">"{period.slogan}"</p>
                  <p className="history-period-description">{period.description}</p>

                  {/* Period Mnemonic Quick Bar */}
                  {periodMnemonics.length > 0 && (
                    <div className="period-mnemonics-strip">
                      <span className="strip-title">
                        <KeyRound size={14} /> Bu Dönemin Şifreleri:
                      </span>
                      <div className="strip-pills">
                        {periodMnemonics.map((mn, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="period-mnemonic-chip"
                            onClick={() => {
                              setMnemonicPeriodFilter(period.id);
                              setMnemonicModalOpen(true);
                            }}
                            title={mn.description}
                          >
                            <span className="chip-code">{mn.code}</span>
                            <span className="chip-name">{mn.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="history-period-actions-row">
                    {!isCulture && (
                      <>
                        <div className="period-progress-indicator">
                          <span>{periodVisited} / {periodTotal} İncilendi (%{periodPercent})</span>
                          <div className="period-progress-track">
                            <div className="period-progress-fill" style={{ width: `${periodPercent}%` }} />
                          </div>
                        </div>

                        <div className="period-batch-buttons">
                          <button
                            type="button"
                            className="period-action-btn"
                            onClick={() => markAllInPeriod(period)}
                          >
                            <CheckCircle2 size={14} /> Tümünü Tamamla
                          </button>
                          <button
                            type="button"
                            className="period-action-btn"
                            onClick={() => expandAllInPeriod(period)}
                          >
                            <Layers size={14} /> Detayları Aç/Kapat
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* TIMELINE EVENTS FOR SİYASİ TARİH DÖNEMLERİ */}
              {!isCulture && (
                <div className="history-timeline-spine">
                  <div className="history-spine-line" />

                  {period.events.map((event, eventIndex) => {
                    const isExpanded = Boolean(expandedEvents[event.id]);
                    const isVisited = progress.visitedEventIds.includes(event.id);
                    const b = kindBadge(event.kind);
                    const BadgeIcon = b.icon;

                    return (
                      <article
                        key={event.id}
                        id={`event-${event.id}`}
                        className={`history-event-card ${isVisited ? "is-visited" : ""} ${isExpanded ? "is-expanded" : ""}`}
                      >
                        {/* Timeline Node Connector */}
                        <div className="history-event-card__node">
                          <button
                            type="button"
                            className={`history-node-dot ${isVisited ? "is-done" : ""}`}
                            onClick={(e) => toggleEventVisited(event.id, e)}
                            title={isVisited ? "Tamamlandı olarak işaretli" : "Tamamla"}
                          >
                            {isVisited ? <Check size={14} /> : <span>{eventIndex + 1}</span>}
                          </button>
                        </div>

                        {/* Event Card Body */}
                        <div className="history-event-card__body">
                          {/* Card Top Strip */}
                          <header className="history-event-card__top">
                            <div className="history-event-card__tags">
                              <span className={`kind-tag ${b.color}`}>
                                <BadgeIcon size={13} />
                                {b.label}
                              </span>
                              <span className="date-tag">
                                <Calendar size={13} />
                                {event.dateLabel}
                              </span>
                              {event.sultan && (
                                <span className="sultan-pill">
                                  <Crown size={13} />
                                  <strong>{event.sultan}</strong>
                                  {event.mahlas && <small>Mahlas: {event.mahlas}</small>}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              className={`check-done-toggle ${isVisited ? "is-checked" : ""}`}
                              onClick={(e) => toggleEventVisited(event.id, e)}
                            >
                              <CheckCircle2 size={16} />
                              <span>{isVisited ? "Öğrenildi" : "Tamamla"}</span>
                            </button>
                          </header>

                          {/* Card Title & Summary */}
                          <div className="history-event-card__title-box">
                            <small className="eyebrow-text">{event.eyebrow}</small>
                            <h3 className="event-title">{event.title}</h3>
                            <p className="event-summary">{event.summary}</p>
                          </div>

                          {/* CAUSAL CHAIN (NEDEN - OLAY - SONUÇ) */}
                          {event.causalChain && (
                            <div className="history-causal-box">
                              <div className="causal-step is-cause">
                                <span className="step-label">
                                  <CircleAlert size={14} /> NEDEN
                                </span>
                                <p>{event.causalChain.cause}</p>
                              </div>
                              <div className="causal-arrow">
                                <ArrowRight size={18} />
                              </div>
                              <div className="causal-step is-event">
                                <span className="step-label">
                                  <Flame size={14} /> OLAY
                                </span>
                                <strong>{event.causalChain.event}</strong>
                              </div>
                              <div className="causal-arrow">
                                <ArrowRight size={18} />
                              </div>
                              <div className="causal-step is-result">
                                <span className="step-label">
                                  <BadgeCheck size={14} /> TARİHİ SONUÇ
                                </span>
                                <p>{event.causalChain.result}</p>
                              </div>
                            </div>
                          )}

                          {/* KPSS AYIRICI ALTIN NOT (CALLOUT) */}
                          {event.examNote && (
                            <div className="history-exam-callout">
                              <div className="callout-icon">
                                <Target size={20} />
                              </div>
                              <div className="callout-content">
                                <strong>🎯 KPSS Ayırıcı Altın Bilgi:</strong>
                                <p>{event.examNote}</p>
                              </div>
                            </div>
                          )}

                          {/* AKILDA TUTMA ŞİFRESİ (MNEMONIC CARD) */}
                          {event.mnemonic && (
                            <div className="history-mnemonic-box">
                              <div className="mnemonic-header">
                                <div className="mnemonic-title-left">
                                  <KeyRound size={18} />
                                  <strong>{event.mnemonic.title}</strong>
                                  <span className="mnemonic-code-badge">{event.mnemonic.code}</span>
                                </div>
                                <button
                                  type="button"
                                  className="mnemonic-copy-btn"
                                  onClick={() => copyMnemonicText(event.mnemonic!)}
                                  title="Şifreyi panoya kopyala"
                                >
                                  {copiedMnemonic === event.mnemonic.code ? (
                                    <>
                                      <Check size={13} /> Kopyalandı
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={13} /> Kopyala
                                    </>
                                  )}
                                </button>
                              </div>
                              <p className="mnemonic-desc">{event.mnemonic.description}</p>
                              <div className="mnemonic-items-grid">
                                {event.mnemonic.items.map((item, idx) => (
                                  <div key={idx} className="mnemonic-item-chip">
                                    <span className="mnemonic-letter">{item.letter}</span>
                                    <div>
                                      <strong>{item.name}</strong>
                                      <small>{item.detail}</small>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* EXPANDABLE DEEP SECTIONS */}
                          {(event.details || event.keySections || event.actors) && (
                            <div className="history-expand-wrapper">
                              <button
                                type="button"
                                className="history-expand-toggle-btn"
                                onClick={() => toggleExpand(event.id)}
                              >
                                <span>{isExpanded ? "Ayrıntılı Maddeleri Gizle" : "Ayrıntılı Maddeleri ve Teşkilat Notlarını Gör"}</span>
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>

                              {isExpanded && (
                                <div className="history-expanded-content">
                                  {event.details && event.details.length > 0 && (
                                    <div className="expanded-bullet-list">
                                      <h4>Önemli Detaylar & Maddeler:</h4>
                                      <ul>
                                        {event.details.map((detail, dIdx) => (
                                          <li key={dIdx}>{detail}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {event.keySections && (
                                    <div className="expanded-key-sections">
                                      {event.keySections.map((sec, sIdx) => (
                                        <div key={sIdx} className="expanded-sub-section">
                                          <h5>{sec.title}</h5>
                                          <ul>
                                            {sec.items.map((item, iIdx) => (
                                              <li key={iIdx}>{item}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {event.actors && event.actors.length > 0 && (
                                    <div className="expanded-actors-row">
                                      <span>
                                        <Users size={14} /> Tarihi Şahsiyetler & Taraflar:
                                      </span>
                                      <div className="actor-pills">
                                        {event.actors.map((actor, aIdx) => (
                                          <span key={aIdx} className="actor-pill">
                                            {actor}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* CULTURE & CIVILIZATION SECTION (DÖNEM 6) */}
              {isCulture && period.cultureSections && (
                <div className="history-culture-container">
                  <div className="history-culture-intro">
                    <h3>🏛️ 623 Yıllık Devlet ve Medeniyet Külliyatı</h3>
                    <p>
                      Osmanlı Devleti'nin idari, hukuki, askeri ve sosyo-ekonomik teşkilatlanması KPSS'de en çok
                      soru getiren bölümdür. Aşağıdaki kartları, tabloları ve özel hafıza şifrelerini inceleyin.
                    </p>
                  </div>

                  <div className="history-culture-grid">
                    {period.cultureSections.map((sec) => (
                      <article key={sec.id} className="history-culture-card">
                        <header className="history-culture-card__header">
                          <span className="culture-badge">{sec.badge}</span>
                          <h3>{sec.title}</h3>
                        </header>

                        <p className="culture-summary">{sec.summary}</p>

                        <div className="culture-details-list">
                          {sec.details.map((d, dIdx) => (
                            <p key={dIdx} className={d.startsWith("-") ? "is-sub-item" : ""}>
                              {d}
                            </p>
                          ))}
                        </div>

                        {sec.subTables && (
                          <div className="culture-tables-wrapper">
                            {sec.subTables.map((tbl, tIdx) => (
                              <div key={tIdx} className="culture-subtable-box">
                                <h4>{tbl.title}</h4>
                                <div className="table-responsive">
                                  <table className="culture-table">
                                    <thead>
                                      <tr>
                                        {tbl.headers.map((h, hIdx) => (
                                          <th key={hIdx}>{h}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {tbl.rows.map((row, rIdx) => (
                                        <tr key={rIdx}>
                                          <td className="font-bold">{row.col1}</td>
                                          <td>{row.col2}</td>
                                          {row.col3 && <td>{row.col3}</td>}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {sec.mnemonic && (
                          <div className="history-mnemonic-box mini">
                            <div className="mnemonic-header">
                              <div className="mnemonic-title-left">
                                <KeyRound size={15} />
                                <strong>{sec.mnemonic.title}</strong>
                                <span className="mnemonic-code-badge">{sec.mnemonic.code}</span>
                              </div>
                            </div>
                            <div className="mnemonic-items-grid">
                              {sec.mnemonic.items.map((item, idx) => (
                                <div key={idx} className="mnemonic-item-chip">
                                  <span className="mnemonic-letter">{item.letter}</span>
                                  <div>
                                    <strong>{item.name}</strong>
                                    <small>{item.detail}</small>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {sec.examNote && (
                          <div className="history-exam-callout mini">
                            <Target size={16} />
                            <div>
                              <strong>KPSS Ayırıcı Bilgi:</strong> {sec.examNote}
                            </div>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}

        {onOpenAtaturk && (
          <div className="ataturk-bridge-card">
            <div className="ataturk-bridge-card__left">
              <div className="ataturk-bridge-badge">
                <Flame size={16} />
                <span>Sıradaki Konu / Yeni Modül</span>
              </div>
              <h3>Gazi Mustafa Kemal Atatürk & İnkılap Tarihi</h3>
              <p>
                Osmanlı'nın dağılmasından sonra Millî Mücadele, Kurtuluş Savaşı cepheleri,
                Lozan Antlaşması, Atatürk İnkılapları ve KPSS kodlamaları ile devam edin.
              </p>
            </div>
            <button
              type="button"
              className="ataturk-bridge-btn"
              onClick={onOpenAtaturk}
            >
              <span>Atatürk Modülüne Geç</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </main>

      {/* 5. FLOATING QUICK JUMP & MNEMONIC PILL */}
      <div className="history-floating-tools">
        <button
          type="button"
          className="floating-tool-btn is-mnemonic"
          onClick={() => setMnemonicModalOpen(true)}
          title="Tüm KPSS Hafıza Kodlamaları"
        >
          <KeyRound size={17} />
          <span>Şifreler Bankası</span>
        </button>
        <button
          type="button"
          className="floating-tool-btn"
          onClick={() => setQuizOpen(true)}
          title="KPSS Neden-Sonuç Testi"
        >
          <Brain size={17} />
          <span>Soru Çöz</span>
        </button>
        <button
          type="button"
          className="floating-tool-btn is-top"
          onClick={scrollToTop}
          title="Başa Dön"
        >
          <ArrowUp size={17} />
          <span>En Başa</span>
        </button>
      </div>

      {/* 6. MASTER MNEMONICS VAULT MODAL */}
      {mnemonicModalOpen && (
        <div className="history-quiz-modal-backdrop" onClick={() => setMnemonicModalOpen(false)}>
          <div className="history-mnemonic-modal" onClick={(e) => e.stopPropagation()}>
            <header className="history-mnemonic-modal__header">
              <div className="mnemonic-modal-title">
                <KeyRound size={24} className="mnemonic-gold-icon" />
                <div>
                  <h3>🔑 KPSS Osmanlı Tarihi Altın Hafıza Şifreleri</h3>
                  <small>Toplam {ALL_MASTER_MNEMONICS.length} adet akılda tutma şifresi ve akrostiş</small>
                </div>
              </div>
              <button
                type="button"
                className="quiz-close-btn"
                onClick={() => setMnemonicModalOpen(false)}
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </header>

            {/* Modal Period Filter Filter */}
            <div className="mnemonic-modal-filter-strip">
              <button
                type="button"
                className={`filter-tab ${mnemonicPeriodFilter === "all" ? "is-active" : ""}`}
                onClick={() => setMnemonicPeriodFilter("all")}
              >
                Tümü ({ALL_MASTER_MNEMONICS.length})
              </button>
              {HISTORY_PERIODS.map((period) => (
                <button
                  key={period.id}
                  type="button"
                  className={`filter-tab ${mnemonicPeriodFilter === period.id ? "is-active" : ""}`}
                  onClick={() => setMnemonicPeriodFilter(period.id)}
                >
                  {period.shortTitle}
                </button>
              ))}
            </div>

            <div className="history-mnemonic-modal__body">
              <div className="mnemonic-cards-waterfall">
                {filteredMnemonics.map((mn, mIdx) => (
                  <article key={mIdx} className="mnemonic-master-card">
                    <header className="mnemonic-master-card__header">
                      <span className="mnemonic-period-tag">{mn.periodName}</span>
                      <button
                        type="button"
                        className="mnemonic-copy-btn"
                        onClick={() => copyMnemonicText(mn)}
                        title="Kopyala"
                      >
                        {copiedMnemonic === mn.code ? (
                          <>
                            <Check size={13} /> Kopyalandı!
                          </>
                        ) : (
                          <>
                            <Copy size={13} /> Kopyala
                          </>
                        )}
                      </button>
                    </header>

                    <div className="mnemonic-master-card__title-row">
                      <span className="mnemonic-grand-badge">{mn.code}</span>
                      <h4>{mn.title}</h4>
                    </div>

                    <p className="mnemonic-master-card__desc">{mn.description}</p>

                    <div className="mnemonic-master-items-list">
                      {mn.items.map((item, iIdx) => (
                        <div key={iIdx} className="mnemonic-master-item">
                          <span className="item-letter">{item.letter}</span>
                          <div className="item-content">
                            <strong>{item.name}</strong>
                            <p>{item.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <footer className="history-mnemonic-modal__footer">
              <span className="mnemonic-footer-hint">
                💡 İpucu: Şifreleri kartların sağ üstündeki 'Kopyala' düğmesiyle notlarınıza yapıştırabilirsiniz.
              </span>
              <button
                type="button"
                className="quiz-next-btn"
                onClick={() => setMnemonicModalOpen(false)}
              >
                Kapat
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* 7. INTERACTIVE QUIZ MODAL */}
      {quizOpen && currentQuiz && (
        <div className="history-quiz-modal-backdrop" onClick={() => setQuizOpen(false)}>
          <div className="history-quiz-modal" onClick={(e) => e.stopPropagation()}>
            <header className="history-quiz-modal__header">
              <div className="history-quiz-title">
                <Brain size={22} className="history-crown-icon" />
                <div>
                  <h3>KPSS Neden-Sonuç & Olay Testi</h3>
                  <small>
                    Soru {currentQuizIndex + 1} / {quizQuestions.length}
                  </small>
                </div>
              </div>
              <button
                type="button"
                className="quiz-close-btn"
                onClick={() => setQuizOpen(false)}
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </header>

            <div className="history-quiz-modal__body">
              <div className="quiz-question-card">
                <span className="quiz-event-tag">
                  {currentQuiz.event.dateLabel} · {currentQuiz.event.title}
                </span>
                <h4>{currentQuiz.prompt}</h4>
              </div>

              <div className="quiz-choices-list">
                {currentQuiz.choices.map((choice, cIdx) => {
                  const isSelected = quizSelectedChoice === choice;
                  const isCorrectChoice = choice === currentQuiz.correct;
                  let choiceClass = "";

                  if (quizAnswered) {
                    if (isCorrectChoice) choiceClass = "is-correct";
                    else if (isSelected) choiceClass = "is-wrong";
                  }

                  return (
                    <button
                      key={cIdx}
                      type="button"
                      className={`quiz-choice-btn ${choiceClass}`}
                      disabled={quizAnswered}
                      onClick={() => handleQuizAnswer(choice)}
                    >
                      <span className="choice-letter">{String.fromCharCode(65 + cIdx)}</span>
                      <span className="choice-text">{choice}</span>
                      {quizAnswered && isCorrectChoice && <Check size={18} className="choice-icon-done" />}
                      {quizAnswered && isSelected && !isCorrectChoice && <X size={18} className="choice-icon-wrong" />}
                    </button>
                  );
                })}
              </div>

              {quizAnswered && (
                <div
                  className={`quiz-feedback-box ${
                    quizSelectedChoice === currentQuiz.correct ? "is-success" : "is-error"
                  }`}
                >
                  <div className="feedback-header">
                    {quizSelectedChoice === currentQuiz.correct ? (
                      <>
                        <BadgeCheck size={20} />
                        <strong>Harika! Doğru sonuç bağlantısını kurdun.</strong>
                      </>
                    ) : (
                      <>
                        <CircleAlert size={20} />
                        <strong>Doğru sonucu ve KPSS notunu incele:</strong>
                      </>
                    )}
                  </div>
                  <p>{currentQuiz.explanation}</p>
                </div>
              )}
            </div>

            <footer className="history-quiz-modal__footer">
              <div className="quiz-score-badge">
                <Award size={15} />
                <span>
                  Başarı: {progress.quizCorrect ?? 0} / {progress.quizAttempts ?? 0} (
                  {(progress.quizAttempts ?? 0) > 0
                    ? Math.round(((progress.quizCorrect ?? 0) / (progress.quizAttempts ?? 1)) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <button
                type="button"
                className="quiz-next-btn"
                onClick={handleNextQuiz}
              >
                <span>Sonraki Soru</span>
                <ArrowRight size={16} />
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
