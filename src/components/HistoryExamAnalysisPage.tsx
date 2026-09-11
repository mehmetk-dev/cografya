import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  BookCheck,
  BookOpenCheck,
  Brain,
  Check,
  ChevronDown,
  ExternalLink,
  Eye,
  Flame,
  HelpCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { StudyNavigation } from "./StudyNavigation";
import {
  ALL_QUESTIONS_DATA,
  loadQuestionUserStore,
  type QuestionItem,
} from "../questionsData";
import {
  EXAM_ANALYSIS_SECTIONS,
  EXAM_FACT_CARDS,
  PDF_ANALYSIS_META,
  type ExamFactCard,
} from "../historyExamAnalysis";

type ViewMode = "must-know" | "priority" | "ambush" | "mistakes" | "sprint" | "all";
type CardProgress = { reviewedIds: string[]; starredIds: string[] };

const PROGRESS_KEY = "kpss-history-exam-analysis-v1";

function loadProgress(): CardProgress {
  try {
    const parsed = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
    return {
      reviewedIds: Array.isArray(parsed.reviewedIds) ? parsed.reviewedIds : [],
      starredIds: Array.isArray(parsed.starredIds) ? parsed.starredIds : [],
    };
  } catch {
    return { reviewedIds: [], starredIds: [] };
  }
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9çğıöşü]+/gi, " ")
    .trim();
}

function questionText(question: QuestionItem) {
  return normalize([
    question.category,
    question.topic,
    question.questionText,
    ...Object.values(question.options),
  ].join(" "));
}

function matchesCard(question: QuestionItem, card: ExamFactCard) {
  const haystack = ` ${questionText(question)} `;
  const matchedKeywords = card.keywords.filter((keyword) => {
    const needle = normalize(keyword);
    return needle.length > 2 && haystack.includes(` ${needle} `);
  });
  const primary = normalize(card.keywords[0] || "");
  return (primary.length > 2 && haystack.includes(` ${primary} `)) || matchedKeywords.length >= 2;
}

function riskTone(score: number) {
  if (score >= 50) return { label: "Bugün çalış", className: "is-critical" };
  if (score >= 34) return { label: "Bu hafta", className: "is-high" };
  if (score >= 22) return { label: "Takip et", className: "is-medium" };
  return { label: "Kontrol", className: "is-low" };
}

function isMustKnow(card: ExamFactCard) {
  return card.years.length >= 4 && (card.directCount >= 4 || card.optionCount >= 9);
}

export function HistoryExamAnalysisPage({
  onBack,
  onOpenQuestions,
}: {
  onBack: () => void;
  onOpenQuestions: () => void;
}) {
  const [mode, setMode] = useState<ViewMode>("priority");
  const [sectionId, setSectionId] = useState("all");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [progress, setProgress] = useState<CardProgress>(loadProgress);
  const questionStore = useMemo(loadQuestionUserStore, []);

  const historyQuestions = useMemo(
    () => ALL_QUESTIONS_DATA.filter((question) => question.subject === "Tarih"),
    [],
  );

  const enrichedCards = useMemo(() => EXAM_FACT_CARDS.map((card) => {
    const matchedQuestions = historyQuestions.filter((question) => matchesCard(question, card));
    const wrongQuestions = matchedQuestions.filter((question) => {
      const answer = questionStore.answers[question.id];
      return answer ? !answer.isCorrect : question.markedAnswer !== null && question.markedAnswer !== question.correctAnswer;
    });
    const distinctYears = new Set(card.years).size;
    const risk = card.directCount * 4 + distinctYears * 3 + card.optionCount + wrongQuestions.length * 5;
    return { ...card, matchedQuestions, wrongQuestions, risk };
  }).sort((a, b) => b.risk - a.risk), [historyQuestions, questionStore]);

  const visibleCards = useMemo(() => {
    const needle = normalize(query);
    let cards = enrichedCards.filter((card) => sectionId === "all" || card.sectionId === sectionId);
    if (needle) {
      cards = cards.filter((card) => normalize([card.title, card.fact, card.trap, ...card.keywords].join(" ")).includes(needle));
    }
    if (mode === "must-know") cards = cards.filter(isMustKnow);
    if (mode === "ambush") cards = cards.filter((card) => card.optionCount >= card.directCount + 3);
    if (mode === "mistakes") cards = cards.filter((card) => card.wrongQuestions.length > 0);
    if (mode === "sprint") cards = cards.slice(0, 15);
    if (mode === "priority") cards = cards.slice(0, 24);
    return cards;
  }, [enrichedCards, mode, query, sectionId]);

  const mustKnowCount = enrichedCards.filter(isMustKnow).length;

  const wrongTotal = historyQuestions.filter((question) => {
    const answer = questionStore.answers[question.id];
    return answer ? !answer.isCorrect : question.markedAnswer !== null && question.markedAnswer !== question.correctAnswer;
  }).length;
  const coverageGap = EXAM_ANALYSIS_SECTIONS.reduce(
    (sum, section) => sum + Math.max(0, section.pdfQuestionCount - section.projectQuestionCount), 0,
  );
  const reviewedPercent = Math.round((progress.reviewedIds.length / EXAM_FACT_CARDS.length) * 100);

  const saveProgress = (next: CardProgress) => {
    setProgress(next);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
  };

  const toggleReviewed = (id: string) => {
    const reviewed = progress.reviewedIds.includes(id);
    saveProgress({
      ...progress,
      reviewedIds: reviewed ? progress.reviewedIds.filter((item) => item !== id) : [...progress.reviewedIds, id],
    });
  };

  const toggleStarred = (id: string) => {
    const starred = progress.starredIds.includes(id);
    saveProgress({
      ...progress,
      starredIds: starred ? progress.starredIds.filter((item) => item !== id) : [...progress.starredIds, id],
    });
  };

  return (
    <div className="exam-analysis-page">
      <StudyNavigation active="analysis" />

      <header className="exam-analysis-hero">
        <div className="exam-analysis-hero__topline">
          <button className="study-back-button" onClick={onBack}><ArrowLeft size={18} /> Haritaya dön</button>
          <span className="exam-analysis-source"><BookOpenCheck size={15} /> 140 sayfa · {PDF_ANALYSIS_META.examYears}</span>
        </div>
        <div className="exam-analysis-hero__content">
          <div>
            <span className="exam-analysis-eyebrow"><Sparkles size={15} /> ÇIKMIŞLARIN DNA'SI</span>
            <h1>Sınavın tekrar eden<br /><em>bilgi haritası</em></h1>
            <p>{PDF_ANALYSIS_META.detectedQuestionLabels} soru sinyali, {EXAM_FACT_CARDS.length} kritik bilgi kartı ve senin {wrongTotal} tarih yanlışın tek öncelik sırasında.</p>
          </div>
          <div className="exam-analysis-progress-ring" style={{ "--progress": `${reviewedPercent * 3.6}deg` } as React.CSSProperties}>
            <div><strong>%{reviewedPercent}</strong><span>kart tamam</span></div>
          </div>
        </div>
        <p className="exam-analysis-edition-note">{PDF_ANALYSIS_META.note}</p>
      </header>

      <main className="exam-analysis-main">
        <section className="exam-analysis-stat-grid" aria-label="Analiz özeti">
          <article><span><BarChart3 size={18} /></span><strong>{PDF_ANALYSIS_META.detectedQuestionLabels}</strong><p>incelenen soru etiketi</p></article>
          <article><span><Brain size={18} /></span><strong>{EXAM_FACT_CARDS.length}</strong><p>doğrulanmış bilgi kartı</p></article>
          <article><span><AlertTriangle size={18} /></span><strong>{wrongTotal}</strong><p>kişisel tarih yanlışı</p></article>
          <article><span><TrendingUp size={18} /></span><strong>{coverageGap}</strong><p>havuza eklenebilecek konu payı</p></article>
        </section>

        <section className="exam-analysis-panel">
          <div className="exam-analysis-panel__heading">
            <div><span>KONU RADARI</span><h2>Nerede açığın var?</h2></div>
            <p>Kitaptaki konu ağırlığı ile mevcut soru havuzunu karşılaştırır.</p>
          </div>
          <div className="exam-analysis-radar">
            {EXAM_ANALYSIS_SECTIONS.map((section) => {
              const max = Math.max(section.pdfQuestionCount, section.projectQuestionCount);
              const gap = section.pdfQuestionCount - section.projectQuestionCount;
              return (
                <button key={section.id} className={sectionId === section.id ? "is-active" : ""} onClick={() => setSectionId(sectionId === section.id ? "all" : section.id)}>
                  <span className="exam-analysis-radar__title"><strong>{section.title}</strong><small>{gap > 0 ? `${gap} soru açığı` : "Havuz dengeli"}</small></span>
                  <span className="exam-analysis-radar__bars">
                    <i style={{ width: `${(section.pdfQuestionCount / max) * 100}%` }}><b>{section.pdfQuestionCount} çıkmış</b></i>
                    <i className="is-project" style={{ width: `${(section.projectQuestionCount / max) * 100}%` }}><b>{section.projectQuestionCount} sende</b></i>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="exam-analysis-workbench">
          <div className="exam-must-know-banner">
            <span><ShieldCheck size={23} /></span>
            <div><small>SINAVA GİRMEDEN ÖNCE</small><strong>Kesin Bilinecekler</strong><p>{mustKnowCount} bilgi, en az 4 farklı yıla yayılan ve doğrudan soru ya da güçlü şık tekrarı taşıyan çekirdek liste.</p></div>
            <button onClick={() => setMode("must-know")}>Listeyi aç <Target size={16} /></button>
          </div>
          <div className="exam-analysis-toolbar">
            <div className="exam-analysis-modes" role="tablist" aria-label="Çalışma modu">
              {([
                ["must-know", "Kesin bilinecekler", ShieldCheck],
                ["priority", "Bugün çalış", Flame],
                ["ambush", "Şıklarda pusu", Eye],
                ["mistakes", "Yanlışlarım", AlertTriangle],
                ["sprint", "15 kart", Target],
                ["all", "Tümü", BookCheck],
              ] as const).map(([id, label, Icon]) => (
                <button key={id} role="tab" aria-selected={mode === id} onClick={() => setMode(id)}><Icon size={16} /> {label}</button>
              ))}
            </div>
            <label className="exam-analysis-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Kavram, antlaşma, kişi ara…" /></label>
          </div>

          {sectionId !== "all" && (
            <button className="exam-analysis-filter-pill" onClick={() => setSectionId("all")}>{EXAM_ANALYSIS_SECTIONS.find((item) => item.id === sectionId)?.title} <span>×</span></button>
          )}

          <div className="exam-analysis-card-grid">
            {visibleCards.map((card, index) => {
              const tone = riskTone(card.risk);
              const reviewed = progress.reviewedIds.includes(card.id);
              const starred = progress.starredIds.includes(card.id);
              const expanded = expandedId === card.id;
              const section = EXAM_ANALYSIS_SECTIONS.find((item) => item.id === card.sectionId);
              const mustKnow = isMustKnow(card);
              return (
                <article key={card.id} className={`exam-fact-card ${reviewed ? "is-reviewed" : ""}`}>
                  <div className="exam-fact-card__top">
                    <span className={`exam-risk-badge ${tone.className}`}>#{index + 1} · {mustKnow ? "Kesin bil" : tone.label}</span>
                    <button aria-label={starred ? "Yıldızı kaldır" : "Yıldızla"} className={starred ? "is-starred" : ""} onClick={() => toggleStarred(card.id)}><Star size={18} fill={starred ? "currentColor" : "none"} /></button>
                  </div>
                  <small className="exam-fact-card__section">{section?.title}</small>
                  <h3>{card.title}</h3>
                  <p className="exam-fact-card__fact">{card.fact}</p>
                  <div className="exam-fact-card__trap"><AlertTriangle size={16} /><p><strong>ÖSYM tuzağı</strong>{card.trap}</p></div>
                  <div className="exam-fact-card__signals">
                    <span><strong>{card.directCount}</strong> doğrudan</span>
                    <span><strong>{card.optionCount}</strong> şık sinyali</span>
                    <span><strong>{card.years.length}</strong> farklı yıl</span>
                    <span className={card.wrongQuestions.length ? "has-wrong" : ""}><strong>{card.wrongQuestions.length}</strong> yanlışın</span>
                  </div>
                  <button className="exam-fact-card__details" onClick={() => setExpandedId(expanded ? null : card.id)} aria-expanded={expanded}>
                    Kanıt ve bağlantılar <ChevronDown size={16} />
                  </button>
                  {expanded && (
                    <div className="exam-fact-card__expanded">
                      <div><strong>Görülen yıllar</strong><p>{card.years.join(" · ")}</p></div>
                      <div><strong>Projede eşleşen {card.matchedQuestions.length} soru</strong><p>{card.matchedQuestions.slice(0, 4).map((question) => `#${question.subjectNumber} ${question.topic}`).join(" · ") || "Henüz eşleşen soru yok."}</p></div>
                      <a href={card.sourceUrl} target="_blank" rel="noreferrer">{card.sourceLabel} ile doğrula <ExternalLink size={14} /></a>
                    </div>
                  )}
                  <div className="exam-fact-card__actions">
                    <button className={reviewed ? "is-done" : ""} onClick={() => toggleReviewed(card.id)}>{reviewed ? <Check size={16} /> : <Brain size={16} />}{reviewed ? "Biliyorum" : "Çalıştım"}</button>
                    <button onClick={onOpenQuestions}><HelpCircle size={16} /> Sorulara git</button>
                  </div>
                </article>
              );
            })}
          </div>
          {!visibleCards.length && <div className="exam-analysis-empty"><Search size={28} /><strong>Eşleşen kart bulunamadı</strong><p>Aramayı veya konu filtresini değiştir.</p></div>}
        </section>
      </main>
    </div>
  );
}
