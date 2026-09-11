import { useMemo, useState, useEffect } from "react";
import { StudyNavigation } from "./StudyNavigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  Flame,
  HelpCircle,
  KeyRound,
  Layers,
  Lightbulb,
  Search,
  Shield,
  Sparkles,
  Swords,
  Table,
  Target,
  X,
  Scroll,
  History,
} from "lucide-react";
import {
  TREATY_PERIODS,
  ALL_TREATY_MNEMONICS,
  ALL_TREATIES_AND_WARS,
  QUICK_CHEATSHEETS,
  type TreatyPeriodId,
  type TreatyMnemonic,
  type TreatyOrWarItem,
} from "../treatiesStudy";

type TreatiesStudyPageProps = {
  onBack: () => void;
  onOpenQuestions?: () => void;
  onOpenOttomanHistory?: () => void;
  onOpenAtaturk?: () => void;
};

type ViewMode = "mnemonics" | "events" | "tables";
type KindFilter = "all" | "treaty" | "war";

export function TreatiesStudyPage({
  onBack,
  onOpenQuestions,
  onOpenOttomanHistory,
  onOpenAtaturk,
}: TreatiesStudyPageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TreatyPeriodId>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("mnemonics");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [learnedIds, setLearnedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("kpss_learned_treaties");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [highlightedMnemonicId, setHighlightedMnemonicId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("kpss_learned_treaties", JSON.stringify(learnedIds));
    } catch {
      // ignore
    }
  }, [learnedIds]);

  const toggleLearned = (id: string) => {
    setLearnedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered mnemonics
  const filteredMnemonics = useMemo(() => {
    return ALL_TREATY_MNEMONICS.filter((m) => {
      if (selectedPeriod !== "all" && m.periodId !== selectedPeriod) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        m.slogan.toLowerCase().includes(q) ||
        m.items.some((it) => it.name.toLowerCase().includes(q) || it.detail.toLowerCase().includes(q)) ||
        m.kpssTip.toLowerCase().includes(q)
      );
    });
  }, [selectedPeriod, searchQuery]);

  // Filtered treaties and wars
  const filteredEvents = useMemo(() => {
    return ALL_TREATIES_AND_WARS.filter((item) => {
      if (selectedPeriod !== "all" && item.periodId !== selectedPeriod) return false;
      if (kindFilter !== "all" && item.kind !== kindFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.parties.toLowerCase().includes(q) ||
        item.leader.toLowerCase().includes(q) ||
        item.importance.toLowerCase().includes(q) ||
        item.keyNotes.some((n) => n.toLowerCase().includes(q))
      );
    });
  }, [selectedPeriod, kindFilter, searchQuery]);

  const totalEvents = ALL_TREATIES_AND_WARS.length;
  const totalMnemonics = ALL_TREATY_MNEMONICS.length;
  const totalLearned = learnedIds.length;

  return (
    <div className="study-page treaties-study-page">
      <StudyNavigation active="treaties" />

      {/* Top action bar */}
      <header className="study-page__topbar">
        <div className="study-page__topbar-inner">
          <div className="study-page__topbar-left">
            <button
              type="button"
              className="study-page__back-btn"
              onClick={onBack}
              aria-label="Ana haritaya dön"
            >
              <ArrowLeft size={17} />
              <span>Haritaya Dön</span>
            </button>
            <div className="study-page__title-block">
              <span className="study-page__badge">
                <Swords size={13} />
                KPSS Savaş & Antlaşma Atlası
              </span>
              <h1 className="study-page__title">Dönemler, Antlaşmalar ve Kodlamalar</h1>
            </div>
          </div>

          <div className="study-page__topbar-actions">
            {onOpenQuestions && (
              <button
                type="button"
                className="study-action-btn study-action-btn--primary"
                onClick={onOpenQuestions}
              >
                <HelpCircle size={16} />
                <span>Soru Atölyesi</span>
              </button>
            )}
            {onOpenOttomanHistory && (
              <button
                type="button"
                className="study-action-btn study-action-btn--secondary"
                onClick={onOpenOttomanHistory}
              >
                <History size={16} />
                <span>Osmanlı Tarihi</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="treaties-main-container">
        {/* Hero Banner */}
        <section className="treaties-hero">
          <div className="treaties-hero__badge-row">
            <span className="treaties-hero__pill">
              <Sparkles size={14} />
              1 Soru 5 Bilgi Uyumlu
            </span>
            <span className="treaties-hero__pill treaties-hero__pill--amber">
              <KeyRound size={14} />
              Akılda Kalıcı Baş Harf Kodlamaları
            </span>
          </div>

          <h2 className="treaties-hero__title">
            Osmanlı'dan Cumhuriyet'e <span>Savaş ve Antlaşmalar</span>
          </h2>
          <p className="treaties-hero__desc">
            Artık antlaşmaları ve sıralamalarını karıştırmaya son! Kuruluş'tan Cumhuriyet'e tüm
            savaşlar, barış antlaşmaları, sınır değişimleri ve ÖSYM'nin en çok sorduğu baş harfli
            kodlamalar tek ekranda.
          </p>

          <div className="treaties-stats-grid">
            <div className="treaties-stat-card">
              <div className="treaties-stat-card__icon treaties-stat-card__icon--green">
                <Scroll size={20} />
              </div>
              <div className="treaties-stat-card__info">
                <strong>{totalEvents}</strong>
                <span>Savaş ve Antlaşma</span>
              </div>
            </div>

            <div className="treaties-stat-card">
              <div className="treaties-stat-card__icon treaties-stat-card__icon--amber">
                <KeyRound size={20} />
              </div>
              <div className="treaties-stat-card__info">
                <strong>{totalMnemonics}</strong>
                <span>Baş Harfli Kodlama</span>
              </div>
            </div>

            <div className="treaties-stat-card">
              <div className="treaties-stat-card__icon treaties-stat-card__icon--blue">
                <Table size={20} />
              </div>
              <div className="treaties-stat-card__info">
                <strong>3</strong>
                <span>Karşılaştırma Tablosu</span>
              </div>
            </div>

            <div className="treaties-stat-card">
              <div className="treaties-stat-card__icon treaties-stat-card__icon--purple">
                <CheckCircle2 size={20} />
              </div>
              <div className="treaties-stat-card__info">
                <strong>{totalLearned}</strong>
                <span>Öğrenildi İşaretlendi</span>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Controls Section */}
        <div className="treaties-controls-card">
          <div className="treaties-search-bar">
            <Search size={18} className="treaties-search-icon" />
            <input
              type="text"
              placeholder="Antlaşma adı, savaş, devlet, lider veya kodlama ara... (örn: Kasr-ı Şirin, MİLÂT, Prut, GMK)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="treaties-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Aramayı temizle"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* View Switcher Tabs */}
          <div className="treaties-view-tabs">
            <button
              type="button"
              className={`treaties-view-tab ${viewMode === "mnemonics" ? "is-active" : ""}`}
              onClick={() => setViewMode("mnemonics")}
            >
              <KeyRound size={16} />
              <span>Kodlamalar & Şifreler</span>
              <span className="treaties-tab-count">{filteredMnemonics.length}</span>
            </button>

            <button
              type="button"
              className={`treaties-view-tab ${viewMode === "events" ? "is-active" : ""}`}
              onClick={() => setViewMode("events")}
            >
              <Scroll size={16} />
              <span>Kronolojik Savaş & Antlaşmalar</span>
              <span className="treaties-tab-count">{filteredEvents.length}</span>
            </button>

            <button
              type="button"
              className={`treaties-view-tab ${viewMode === "tables" ? "is-active" : ""}`}
              onClick={() => setViewMode("tables")}
            >
              <Table size={16} />
              <span>Özet Karşılaştırma Tabloları</span>
            </button>
          </div>

          {/* Period Selector Pills */}
          <div className="treaties-period-pills-wrap">
            <button
              type="button"
              className={`treaties-period-pill ${selectedPeriod === "all" ? "is-active" : ""}`}
              onClick={() => setSelectedPeriod("all")}
            >
              <span>Tüm Dönemler</span>
            </button>
            {TREATY_PERIODS.map((p) => (
              <button
                type="button"
                key={p.id}
                className={`treaties-period-pill ${selectedPeriod === p.id ? "is-active" : ""}`}
                onClick={() => setSelectedPeriod(p.id)}
              >
                <span>{p.name}</span>
                <small>{p.century}</small>
              </button>
            ))}
          </div>

          {/* Secondary filter for events view */}
          {viewMode === "events" && (
            <div className="treaties-subfilters">
              <span className="treaties-subfilter-label">Tür:</span>
              <button
                type="button"
                className={`treaties-subfilter-btn ${kindFilter === "all" ? "is-active" : ""}`}
                onClick={() => setKindFilter("all")}
              >
                Tümü
              </button>
              <button
                type="button"
                className={`treaties-subfilter-btn ${kindFilter === "treaty" ? "is-active" : ""}`}
                onClick={() => setKindFilter("treaty")}
              >
                Sadece Antlaşmalar
              </button>
              <button
                type="button"
                className={`treaties-subfilter-btn ${kindFilter === "war" ? "is-active" : ""}`}
                onClick={() => setKindFilter("war")}
              >
                Sadece Savaşlar
              </button>
            </div>
          )}
        </div>

        {/* VIEW 1: MNEMONICS VAULT */}
        {viewMode === "mnemonics" && (
          <section className="treaties-grid-section">
            <div className="treaties-section-header">
              <div>
                <h3>
                  <KeyRound size={20} />
                  KPSS Hafıza Şifreleri ve Akrostişler
                </h3>
                <p>
                  Sınavda en çok karıştırılan antlaşma sıralamaları, savaşlar ve ittifakların akılda
                  kalıcı baş harf kodlamaları.
                </p>
              </div>
            </div>

            {filteredMnemonics.length === 0 ? (
              <div className="treaties-empty-state">
                <p>Aradığınız kriterlere uygun kodlama bulunamadı.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedPeriod("all");
                  }}
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className="mnemonics-cards-grid">
                {filteredMnemonics.map((m) => {
                  const isCopied = copiedId === m.id;
                  const isLearned = learnedIds.includes(m.id);
                  const isHighlighted = highlightedMnemonicId === m.id;

                  const fullText = `${m.title} (${m.code})\n${m.slogan}\n` +
                    m.items.map((it) => `• [${it.letter}] ${it.name}: ${it.detail}`).join("\n") +
                    `\n💡 Püf Noktası: ${m.kpssTip}`;

                  return (
                    <article
                      key={m.id}
                      className={`mnemonic-card ${isLearned ? "is-learned" : ""} ${
                        isHighlighted ? "is-highlighted" : ""
                      }`}
                    >
                      <div className="mnemonic-card__top">
                        <div className="mnemonic-card__code-badge">
                          <span>{m.code}</span>
                        </div>
                        <div className="mnemonic-card__actions">
                          <button
                            type="button"
                            className="mnemonic-action-btn"
                            title="Kopyala"
                            onClick={() => handleCopy(m.id, fullText)}
                          >
                            {isCopied ? <Check size={15} color="#059669" /> : <Copy size={15} />}
                          </button>
                          <button
                            type="button"
                            className={`mnemonic-action-btn ${isLearned ? "is-active" : ""}`}
                            title={isLearned ? "Öğrenildi olarak işaretlendi" : "Öğrenildi işaretle"}
                            onClick={() => toggleLearned(m.id)}
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        </div>
                      </div>

                      <h4 className="mnemonic-card__title">{m.title}</h4>
                      <p className="mnemonic-card__slogan">"{m.slogan}"</p>
                      <p className="mnemonic-card__desc">{m.description}</p>

                      <div className="mnemonic-card__items">
                        {m.items.map((it, idx) => (
                          <div key={idx} className="mnemonic-item-row">
                            <span className="mnemonic-letter-chip">{it.letter}</span>
                            <div className="mnemonic-item-content">
                              <strong>{it.name}</strong>
                              <p>{it.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mnemonic-card__tip">
                        <div className="mnemonic-card__tip-header">
                          <Lightbulb size={16} />
                          <span>KPSS ÖSYM TUZAĞI & PÜF NOKTASI</span>
                        </div>
                        <p>{m.kpssTip}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* VIEW 2: CHRONOLOGICAL TREATIES & WARS */}
        {viewMode === "events" && (
          <section className="treaties-grid-section">
            <div className="treaties-section-header">
              <div>
                <h3>
                  <Scroll size={20} />
                  Dönem Dönem Savaşlar ve Antlaşmalar Kronolojisi
                </h3>
                <p>
                  Kuruluş'tan Cumhuriyet'e kadar her olayın tarafları, padişahı/lideri ve KPSS'de
                  çıkan kritik önemi.
                </p>
              </div>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="treaties-empty-state">
                <p>Aradığınız kriterlere uygun savaş veya antlaşma bulunamadı.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedPeriod("all");
                    setKindFilter("all");
                  }}
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className="events-cards-grid">
                {filteredEvents.map((ev) => {
                  const isLearned = learnedIds.includes(ev.id);
                  const isWar = ev.kind === "war";

                  return (
                    <article
                      key={ev.id}
                      className={`event-card ${isWar ? "is-war" : "is-treaty"} ${
                        isLearned ? "is-learned" : ""
                      }`}
                    >
                      <div className="event-card__header">
                        <div className="event-card__badge-cluster">
                          <span className={`event-kind-badge ${isWar ? "is-war" : "is-treaty"}`}>
                            {isWar ? <Swords size={12} /> : <Scroll size={12} />}
                            {isWar ? "Meydan Savaşı" : ev.kind === "pact" ? "Pakt / İttifak" : "Barış Antlaşması"}
                          </span>
                          <span className="event-year-badge">{ev.year}</span>
                        </div>

                        <button
                          type="button"
                          className={`mnemonic-action-btn ${isLearned ? "is-active" : ""}`}
                          title={isLearned ? "Öğrenildi olarak işaretlendi" : "Öğrenildi işaretle"}
                          onClick={() => toggleLearned(ev.id)}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      </div>

                      <h4 className="event-card__title">{ev.title}</h4>

                      <div className="event-card__meta">
                        <div className="event-meta-item">
                          <span className="meta-label">Taraflar:</span>
                          <span className="meta-val">{ev.parties}</span>
                        </div>
                        <div className="event-meta-item">
                          <span className="meta-label">Padişah / Lider:</span>
                          <span className="meta-val">{ev.leader}</span>
                        </div>
                      </div>

                      <div className="event-card__importance">
                        <strong>Önemi:</strong>
                        <p>{ev.importance}</p>
                      </div>

                      <div className="event-card__notes">
                        <span className="notes-header">
                          <Target size={14} />
                          KPSS Soru Noktaları:
                        </span>
                        <ul>
                          {ev.keyNotes.map((note, idx) => (
                            <li key={idx}>{note}</li>
                          ))}
                        </ul>
                      </div>

                      {ev.mnemonicId && (
                        <div className="event-card__mnemonic-link">
                          <button
                            type="button"
                            onClick={() => {
                              setViewMode("mnemonics");
                              setHighlightedMnemonicId(ev.mnemonicId || null);
                              window.scrollTo({ top: 350, behavior: "smooth" });
                            }}
                          >
                            <KeyRound size={13} />
                            <span>Bu konunun akılda kalıcı kodlamasını gör</span>
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* VIEW 3: QUICK COMPARISON TABLES */}
        {viewMode === "tables" && (
          <section className="treaties-grid-section">
            <div className="treaties-section-header">
              <div>
                <h3>
                  <Table size={20} />
                  KPSS Hızlı Karşılaştırma ve Özet Tabloları
                </h3>
                <p>
                  Sınav sabahı veya soru çözmeden hemen önce göz gezdirilecek altın değerinde özet
                  çizelgeleri.
                </p>
              </div>
            </div>

            <div className="cheatsheets-wrapper">
              {QUICK_CHEATSHEETS.map((cs) => (
                <div key={cs.id} className="cheatsheet-card">
                  <div className="cheatsheet-header">
                    <span className="cheatsheet-badge">{cs.badge}</span>
                    <h4>{cs.title}</h4>
                    <p>{cs.subtitle}</p>
                  </div>

                  <div className="cheatsheet-table-wrap">
                    <table className="cheatsheet-table">
                      <thead>
                        <tr>
                          <th>Olay / Antlaşma</th>
                          <th>Yıl</th>
                          <th>Önemli Özelliği & Sınır Durumu</th>
                          <th>ÖSYM Çeldiricisi & Püf Noktası</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cs.rows.map((r, idx) => (
                          <tr key={idx}>
                            <td className="table-event-col">
                              <strong>{r.event}</strong>
                            </td>
                            <td className="table-year-col">{r.year}</td>
                            <td className="table-feature-col">{r.feature}</td>
                            <td className="table-trap-col">
                              <span className="trap-pill">{r.kpssTrap}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
