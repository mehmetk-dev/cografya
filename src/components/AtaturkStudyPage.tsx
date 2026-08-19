import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Copy,
  FileText,
  Flame,
  HelpCircle,
  Key,
  Layers,
  Quote,
  Search,
  Shield,
  Sparkles,
  Sword,
  X,
  Zap,
} from "lucide-react";
import {
  ATATURK_PERIODS,
  ATATURK_MASTER_MNEMONICS,
  ATATURK_EXAM_TRAPS,
  ATATURK_TREATIES_LIST,
  ATATURK_QUIZ_QUESTIONS,
  type AtaturkPeriod,
  type AtaturkEvent,
  type AtaturkMnemonic,
  type AtaturkTreaty,
  type AtaturkExamTrap,
} from "../ataturkStudy";

type AtaturkStudyPageProps = {
  onBack: () => void;
  onOpenOttomanHistory?: () => void;
};

type ActiveViewTab = "stream" | "treaties" | "mnemonics" | "traps";

export function AtaturkStudyPage({
  onBack,
  onOpenOttomanHistory,
}: AtaturkStudyPageProps) {
  const [activeViewTab, setActiveViewTab] = useState<ActiveViewTab>("stream");
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("hayati");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [quizOpen, setQuizOpen] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, wrong: 0 });
  const [mnemonicModalOpen, setMnemonicModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedEventIds, setExpandedEventIds] = useState<Set<string>>(new Set());

  // Copy handler for mnemonics
  const handleCopyMnemonic = (mnemonic: AtaturkMnemonic) => {
    const textToCopy = `${mnemonic.title} (${mnemonic.code}):\n${mnemonic.items
      .map((item) => `${item.letter} -> ${item.word} (${item.note || ""})`)
      .join("\n")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCode(mnemonic.code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Toggle event detail expansion
  const toggleExpandEvent = (id: string) => {
    setExpandedEventIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter events
  const filteredPeriods = useMemo(() => {
    if (!searchQuery.trim() && categoryFilter === "all") {
      return ATATURK_PERIODS;
    }

    const q = searchQuery.toLowerCase().trim();
    return ATATURK_PERIODS.map((period) => {
      const matchingEvents = period.events.filter((event) => {
        const matchesCategory =
          categoryFilter === "all" || event.category === categoryFilter;
        const matchesQuery =
          !q ||
          event.title.toLowerCase().includes(q) ||
          event.summary.toLowerCase().includes(q) ||
          event.details.some((d) => d.toLowerCase().includes(q)) ||
          event.kpssKeyPoints.some((k) => k.toLowerCase().includes(q));
        return matchesCategory && matchesQuery;
      });

      return {
        ...period,
        events: matchingEvents,
      };
    }).filter((period) => period.events.length > 0);
  }, [searchQuery, categoryFilter]);

  // Quiz helper handlers
  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    const isCorrect =
      selectedOption === ATATURK_QUIZ_QUESTIONS[currentQuizIndex].correctIndex;
    setQuizScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < ATATURK_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished
      alert(
        `Test tamamlandı!\nDoğru: ${quizScore.correct}\nYanlış: ${quizScore.wrong}\nBaşarı: %${Math.round(
          (quizScore.correct / ATATURK_QUIZ_QUESTIONS.length) * 100
        )}`
      );
      setQuizOpen(false);
      setCurrentQuizIndex(0);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setQuizScore({ correct: 0, wrong: 0 });
    }
  };

  return (
    <div className="ataturk-atlas-root">
      {/* 1. TOPBAR */}
      <header className="ataturk-topbar">
        <div className="ataturk-topbar__inner">
          <div className="ataturk-topbar__left">
            <button
              type="button"
              className="ataturk-back-btn"
              onClick={onBack}
              title="Ana Sayfaya Dön"
            >
              <ArrowLeft size={18} />
              <span>Geri Dön</span>
            </button>

            <div className="ataturk-title-block">
              <div className="ataturk-brand">
                <div className="ataturk-star-icon">
                  <Flame size={18} />
                </div>
                <strong>Atatürk & İnkılap Tarihi</strong>
                <span className="ataturk-kpss-tag">MEB / KPSS / YKS</span>
              </div>
            </div>
          </div>

          <div className="ataturk-topbar__right">
            <button
              type="button"
              className="ataturk-action-btn ataturk-action-btn--mnemonic"
              onClick={() => setMnemonicModalOpen(true)}
            >
              <Key size={16} />
              <span>Şifreler Bankası</span>
              <span className="badge-count">{ATATURK_MASTER_MNEMONICS.length}</span>
            </button>

            <button
              type="button"
              className="ataturk-action-btn ataturk-action-btn--quiz"
              onClick={() => setQuizOpen(true)}
            >
              <HelpCircle size={16} />
              <span>ÖSYM Testi Çöz</span>
            </button>
          </div>
        </div>

        {/* PERIOD JUMPER BAR */}
        <nav className="ataturk-period-nav" aria-label="Dönemler">
          {ATATURK_PERIODS.map((period) => (
            <button
              key={period.id}
              type="button"
              className={`ataturk-period-pill ${
                selectedPeriodId === period.id ? "is-active" : ""
              }`}
              onClick={() => {
                setSelectedPeriodId(period.id);
                setActiveViewTab("stream");
                const el = document.getElementById(`period-${period.id}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <span>{period.title.split(". ")[1] || period.title}</span>
              <small>{period.years}</small>
            </button>
          ))}
        </nav>
      </header>

      {/* 2. HERO GRAND */}
      <section className="ataturk-hero-grand">
        <div className="ataturk-hero-grand__content">
          <div className="ataturk-hero-badge">
            <Sparkles size={15} />
            <span>Türkiye Cumhuriyeti Kurucu Tarih Atlası</span>
          </div>

          <h1>
            Gazi Mustafa Kemal Atatürk <br />
            <span>Millî Mücadele ve İnkılap Tarihi</span>
          </h1>

          <p>
            1881 Selanik'ten Çanakkale Zaferi'ne, Samsun'dan Lozan Barış Antlaşması'na,
            büyük inkılaplardan Montrö ve Hatay davasına kadar KPSS, YKS ve MEB
            sınavlarında en çok soru getiren tüm konular, şifreler ve sınav tuzakları.
          </p>

          <div className="ataturk-hero-stats-row">
            <div className="ataturk-stat-card">
              <strong>7</strong>
              <span>Temel Dönem</span>
            </div>
            <div className="ataturk-stat-card">
              <strong>{ATATURK_TREATIES_LIST.length}</strong>
              <span>Kilit Antlaşma</span>
            </div>
            <div className="ataturk-stat-card is-highlight">
              <strong>{ATATURK_MASTER_MNEMONICS.length}</strong>
              <span>KPSS Şifresi / Kodlama</span>
            </div>
            <div className="ataturk-stat-card">
              <strong>{ATATURK_EXAM_TRAPS.length}</strong>
              <span>ÖSYM Sınav Tuzağı</span>
            </div>
          </div>
        </div>

        {/* VIEW SELECTOR TABS */}
        <div className="ataturk-view-tabs">
          <button
            type="button"
            className={`ataturk-view-tab ${
              activeViewTab === "stream" ? "is-active" : ""
            }`}
            onClick={() => setActiveViewTab("stream")}
          >
            <Layers size={17} />
            <span>Kronolojik Konu Akışı</span>
          </button>

          <button
            type="button"
            className={`ataturk-view-tab ${
              activeViewTab === "treaties" ? "is-active" : ""
            }`}
            onClick={() => setActiveViewTab("treaties")}
          >
            <Shield size={17} />
            <span>Antlaşmalar Matrisi</span>
          </button>

          <button
            type="button"
            className={`ataturk-view-tab ${
              activeViewTab === "mnemonics" ? "is-active" : ""
            }`}
            onClick={() => setActiveViewTab("mnemonics")}
          >
            <Key size={17} />
            <span>Şifreler & Kodlamalar</span>
          </button>

          <button
            type="button"
            className={`ataturk-view-tab ${
              activeViewTab === "traps" ? "is-active" : ""
            }`}
            onClick={() => setActiveViewTab("traps")}
          >
            <Zap size={17} />
            <span>ÖSYM Sınav Tuzakları</span>
          </button>
        </div>
      </section>

      {/* 3. MAIN CONTENT BASED ON ACTIVE TAB */}
      <main className="ataturk-main-container">
        {/* TAB 1: STREAM VIEW */}
        {activeViewTab === "stream" && (
          <div className="ataturk-stream-view">
            {/* Search & Filter Strip */}
            <div className="ataturk-search-strip">
              <div className="ataturk-search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Atatürk konusu, antlaşma, savaş, inkılap veya kavram ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")}>
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="ataturk-category-pills">
                {[
                  { id: "all", label: "Tümü" },
                  { id: "hayati", label: "Hayatı & Eserleri" },
                  { id: "hazirlik", label: "Hazırlık Dönemi" },
                  { id: "cephe", label: "Cepheler & Savaşlar" },
                  { id: "antlasma", label: "Antlaşmalar" },
                  { id: "inkilap", label: "İnkılaplar" },
                  { id: "ilke", label: "İlkeler" },
                  { id: "dis_politika", label: "Dış Politika" },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    className={`ataturk-cat-pill ${
                      categoryFilter === pill.id ? "is-active" : ""
                    }`}
                    onClick={() => setCategoryFilter(pill.id)}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Periods & Events Stream */}
            <div className="ataturk-periods-list">
              {filteredPeriods.map((period) => (
                <section
                  key={period.id}
                  id={`period-${period.id}`}
                  className="ataturk-period-block"
                >
                  <div className="ataturk-period-header">
                    <div className="ataturk-period-badge">{period.badge}</div>
                    <h2>{period.title}</h2>
                    <span className="ataturk-period-years">{period.years}</span>
                    <p className="ataturk-period-desc">{period.description}</p>
                    {period.id === "hayati" && (
                      <div className="ataturk-period-banner">
                        <img
                          src="/images/tarih/canakkale_zaferi.jpg"
                          alt="Çanakkale ve Anafartalar Kahramanı Mustafa Kemal"
                          loading="lazy"
                        />
                        <div className="banner-caption">
                          <span>Anafartalar Grubu Komutanı Kurmay Albay Mustafa Kemal — Çanakkale Siperleri (1915)</span>
                        </div>
                      </div>
                    )}
                    {period.id === "cepheler" && (
                      <div className="ataturk-period-banner">
                        <img
                          src="/images/tarih/ataturk_kocatepe.jpg"
                          alt="Büyük Taarruz ve Kocatepe"
                          loading="lazy"
                        />
                        <div className="banner-caption">
                          <span>Gazi Mustafa Kemal Paşa Kocatepe'de — 26 Ağustos 1922 Büyük Taarruz Şafağı</span>
                        </div>
                      </div>
                    )}
                    {period.id === "inkilaplar" && (
                      <div className="ataturk-period-banner">
                        <img
                          src="/images/tarih/ataturk_cumhuriyet.jpg"
                          alt="Cumhuriyetin İlanı ve TBMM"
                          loading="lazy"
                        />
                        <div className="banner-caption">
                          <span>Türkiye Büyük Millet Meclisi — 29 Ekim 1923 Cumhuriyetin İlanı ve Büyük Devrimler</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ataturk-events-stream">
                    {period.events.map((event) => {
                      const isExpanded = expandedEventIds.has(event.id);
                      return (
                        <article
                          key={event.id}
                          className={`ataturk-event-card ataturk-event-card--${event.importance}`}
                        >
                          <div className="ataturk-event-card__header">
                            <div className="ataturk-event-title-meta">
                              <span className="ataturk-event-date">{event.date}</span>
                              <h3>{event.title}</h3>
                            </div>
                            <button
                              type="button"
                              className="ataturk-expand-toggle"
                              onClick={() => toggleExpandEvent(event.id)}
                              aria-expanded={isExpanded}
                            >
                              {isExpanded ? (
                                <>
                                  <span>Özetle</span>
                                  <ChevronUp size={16} />
                                </>
                              ) : (
                                <>
                                  <span>Detaylar</span>
                                  <ChevronDown size={16} />
                                </>
                              )}
                            </button>
                          </div>

                          <p className="ataturk-event-summary">{event.summary}</p>

                          {/* QUOTE BLOCK */}
                          {event.quote && (
                            <div className="ataturk-quote-box">
                              <Quote size={20} className="quote-icon" />
                              <blockquote>"{event.quote.text}"</blockquote>
                              <cite>— {event.quote.context}</cite>
                            </div>
                          )}

                          {/* CAUSAL CHAIN */}
                          {event.causalChain && (
                            <div className="ataturk-causal-box">
                              <div className="causal-step">
                                <small>Neden</small>
                                <span>{event.causalChain.cause}</span>
                              </div>
                              <div className="causal-arrow">➔</div>
                              <div className="causal-step is-event">
                                <small>Gelişme</small>
                                <span>{event.causalChain.event}</span>
                              </div>
                              <div className="causal-arrow">➔</div>
                              <div className="causal-step is-result">
                                <small>Sonuç</small>
                                <span>{event.causalChain.result}</span>
                              </div>
                            </div>
                          )}

                          {/* EXPANDABLE DETAILS */}
                          {isExpanded && (
                            <div className="ataturk-event-details-section">
                              <h4>Kapsamlı Tarih Analizi & Maddeler:</h4>
                              <ul className="ataturk-details-list">
                                {event.details.map((detail, idx) => (
                                  <li key={idx}>{detail}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* KPSS GOLDEN CALLOUTS */}
                          {event.kpssKeyPoints && event.kpssKeyPoints.length > 0 && (
                            <div className="ataturk-kpss-callout">
                              <div className="kpss-callout-header">
                                <Award size={16} />
                                <strong>KPSS & ÖSYM Soru Noktaları:</strong>
                              </div>
                              <ul>
                                {event.kpssKeyPoints.map((point, idx) => (
                                  <li key={idx}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TREATIES MATRIX */}
        {activeViewTab === "treaties" && (
          <div className="ataturk-treaties-view">
            <div className="ataturk-view-header">
              <h2>Millî Mücadele ve Cumhuriyet Dönemi Kilit Antlaşmaları</h2>
              <p>
                Sınavlarda sınır belirleyen, kapitülasyonları kaldıran ve tam bağımsızlığı
                sağlayan antlaşmaların karşılaştırmalı analizi.
              </p>
            </div>

            <div className="ataturk-treaties-grid">
              {ATATURK_TREATIES_LIST.map((treaty) => (
                <div key={treaty.id} className="ataturk-treaty-card">
                  <div className="treaty-card-top">
                    <span className="treaty-date">{treaty.date}</span>
                    <h3>{treaty.name}</h3>
                    <div className="treaty-parties">{treaty.parties}</div>
                  </div>

                  <div className="treaty-significance">
                    <strong>Önemi:</strong>
                    <span>{treaty.significance}</span>
                  </div>

                  <div className="treaty-points">
                    <strong>Kritik Maddeler:</strong>
                    <ul>
                      {treaty.keyPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="treaty-kpss-note">
                    <Award size={15} />
                    <span>{treaty.kpssNote}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MNEMONICS VAULT */}
        {activeViewTab === "mnemonics" && (
          <div className="ataturk-mnemonics-view">
            <div className="ataturk-view-header">
              <h2>Atatürk ve İnkılap Tarihi KPSS Kodlamalar Bankası</h2>
              <p>
                Sınavda unutmamanız gereken kritik sıralamalar, antlaşma sonuçları ve
                pakt kurucuları için özel üretilmiş akılda kalıcı şifreler.
              </p>
            </div>

            <div className="ataturk-mnemonics-grid">
              {ATATURK_MASTER_MNEMONICS.map((mnemonic, idx) => (
                <div key={idx} className="ataturk-mnemonic-card">
                  <div className="mnemonic-header">
                    <div className="mnemonic-code-badge">{mnemonic.code}</div>
                    <h3>{mnemonic.title}</h3>
                  </div>

                  <p className="mnemonic-context">{mnemonic.context}</p>

                  <div className="mnemonic-items-list">
                    {mnemonic.items.map((it, i) => (
                      <div key={i} className="mnemonic-item-row">
                        <span className="item-letter">{it.letter}</span>
                        <div className="item-content">
                          <strong>{it.word}</strong>
                          {it.note && <small>{it.note}</small>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="mnemonic-copy-btn"
                    onClick={() => handleCopyMnemonic(mnemonic)}
                  >
                    {copiedCode === mnemonic.code ? (
                      <>
                        <CheckCircle2 size={15} color="#2b9348" />
                        <span>Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={15} />
                        <span>Şifreyi Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: EXAM TRAPS */}
        {activeViewTab === "traps" && (
          <div className="ataturk-traps-view">
            <div className="ataturk-view-header">
              <h2>ÖSYM & KPSS Sınav Tuzakları ve Çeldiriciler</h2>
              <p>
                Sınavlarda adayların en çok düştüğü yanılgılar, tarihsel tuzaklar ve
                ayırt edici altın kurallar.
              </p>
            </div>

            <div className="ataturk-traps-grid">
              {ATATURK_EXAM_TRAPS.map((trap) => (
                <div key={trap.id} className="ataturk-trap-card">
                  <div className="trap-topic-badge">
                    <Zap size={15} />
                    <span>{trap.topic}</span>
                  </div>

                  <div className="trap-box trap-box--warning">
                    <strong>⚠️ Klasik Sınav Çeldiricisi:</strong>
                    <p>{trap.warning}</p>
                  </div>

                  <div className="trap-box trap-box--fact">
                    <strong>✅ Tarihsel Doğru Gerçek:</strong>
                    <p>{trap.correctFact}</p>
                  </div>

                  <div className="trap-box trap-box--pointer">
                    <strong>🎯 ÖSYM Soru Taktigi:</strong>
                    <p>{trap.examPointers}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 4. FOOTER BRIDGE */}
      <footer className="ataturk-footer-bridge">
        <div className="footer-bridge-content">
          <div>
            <h3>Osmanlı Tarihi Modülü ile Birlikte Çalışın</h3>
            <p>Kuruluş, Yükselme, Duraklama, Gerileme, Dağılma ve Kültür Medeniyet.</p>
          </div>
          {onOpenOttomanHistory && (
            <button
              type="button"
              className="footer-bridge-btn"
              onClick={onOpenOttomanHistory}
            >
              <Compass size={17} />
              <span>Osmanlı Tarihi Modülüne Git</span>
            </button>
          )}
        </div>
      </footer>

      {/* 5. MNEMONIC MODAL */}
      {mnemonicModalOpen && (
        <div className="ataturk-modal-overlay" onClick={() => setMnemonicModalOpen(false)}>
          <div
            className="ataturk-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="ataturk-modal-header">
              <div className="modal-title-wrap">
                <Key size={20} />
                <h2>Atatürk & İnkılap Tarihi Şifreler Bankası</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setMnemonicModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="ataturk-modal-body">
              <div className="modal-mnemonics-list">
                {ATATURK_MASTER_MNEMONICS.map((mnemonic, idx) => (
                  <div key={idx} className="modal-mnemonic-item">
                    <div className="modal-mnemonic-top">
                      <span className="code-pill">{mnemonic.code}</span>
                      <strong>{mnemonic.title}</strong>
                    </div>
                    <p className="modal-mnemonic-desc">{mnemonic.context}</p>
                    <div className="modal-mnemonic-subgrid">
                      {mnemonic.items.map((it, i) => (
                        <div key={i} className="subgrid-row">
                          <span className="subgrid-letter">{it.letter}</span>
                          <span>{it.word}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="modal-copy-btn"
                      onClick={() => handleCopyMnemonic(mnemonic)}
                    >
                      {copiedCode === mnemonic.code ? (
                        <>
                          <CheckCircle2 size={15} color="#2b9348" />
                          <span>Kopyalandı!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={15} />
                          <span>Kopyala</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. QUIZ MODAL */}
      {quizOpen && (
        <div className="ataturk-modal-overlay" onClick={() => setQuizOpen(false)}>
          <div
            className="ataturk-modal-card ataturk-quiz-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="ataturk-modal-header">
              <div className="modal-title-wrap">
                <HelpCircle size={20} />
                <h2>ÖSYM & KPSS Deneme Testi</h2>
                <span className="quiz-progress-badge">
                  Soru {currentQuizIndex + 1} / {ATATURK_QUIZ_QUESTIONS.length}
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setQuizOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="ataturk-modal-body">
              {/* Question Text */}
              <div className="quiz-question-box">
                <span className="exam-type-pill">
                  {ATATURK_QUIZ_QUESTIONS[currentQuizIndex].examType} Çıkmış Soru Tarzı
                </span>
                <p className="question-text">
                  {ATATURK_QUIZ_QUESTIONS[currentQuizIndex].question}
                </p>
              </div>

              {/* Options */}
              <div className="quiz-options-list">
                {ATATURK_QUIZ_QUESTIONS[currentQuizIndex].options.map(
                  (option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect =
                      idx ===
                      ATATURK_QUIZ_QUESTIONS[currentQuizIndex].correctIndex;
                    let optionClass = "quiz-option-btn";
                    if (isAnswerSubmitted) {
                      if (isCorrect) optionClass += " is-correct";
                      else if (isSelected) optionClass += " is-wrong";
                    } else if (isSelected) {
                      optionClass += " is-selected";
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        className={optionClass}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                      >
                        <span className="option-bullet">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="option-label">{option}</span>
                      </button>
                    );
                  }
                )}
              </div>

              {/* Explanation (when submitted) */}
              {isAnswerSubmitted && (
                <div
                  className={`quiz-explanation-box ${
                    selectedOption ===
                    ATATURK_QUIZ_QUESTIONS[currentQuizIndex].correctIndex
                      ? "is-correct"
                      : "is-wrong"
                  }`}
                >
                  <strong>
                    {selectedOption ===
                    ATATURK_QUIZ_QUESTIONS[currentQuizIndex].correctIndex
                      ? "✅ Tebrikler, Doğru Cevap!"
                      : "❌ Yanlış Cevap!"}
                  </strong>
                  <p>
                    {ATATURK_QUIZ_QUESTIONS[currentQuizIndex].explanation}
                  </p>
                </div>
              )}
            </div>

            <div className="ataturk-modal-footer">
              <div className="quiz-score-indicator">
                <span>Doğru: {quizScore.correct}</span>
                <span>Yanlış: {quizScore.wrong}</span>
              </div>

              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  className="quiz-submit-btn"
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                >
                  Cevabı Onayla
                </button>
              ) : (
                <button
                  type="button"
                  className="quiz-next-btn"
                  onClick={handleNextQuestion}
                >
                  {currentQuizIndex < ATATURK_QUIZ_QUESTIONS.length - 1
                    ? "Sonraki Soru ➔"
                    : "Testi Bitir 🏁"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
