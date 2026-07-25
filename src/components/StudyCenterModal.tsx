import { useEffect, useState } from "react";
import {
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  ExternalLink,
  Mountain,
  RotateCcw,
  Shuffle,
  Trash2,
  X,
} from "lucide-react";
import { STUDY_NOTE_TOPICS } from "../studyNotes";
import type { DailyProgress, QuizMistake } from "../types";

type StudyCenterTab = "overview" | "notes" | "mistakes";

type StudyCenterModalProps = {
  open: boolean;
  initialTab: StudyCenterTab;
  dailyProgress?: DailyProgress;
  dailyStreak: number;
  mistakes: QuizMistake[];
  onClose: () => void;
  onStartDaily: () => void;
  onStartMixed: () => void;
  onStartMistakes: () => void;
  onClearMistakes: () => void;
};

export function StudyCenterModal({
  open,
  initialTab,
  dailyProgress,
  dailyStreak,
  mistakes,
  onClose,
  onStartDaily,
  onStartMixed,
  onStartMistakes,
  onClearMistakes,
}: StudyCenterModalProps) {
  const [tab, setTab] = useState<StudyCenterTab>(initialTab);

  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  if (!open) return null;

  const answered = dailyProgress?.answered ?? 0;
  const dailyPercent = Math.min(100, answered * 10);
  const mountainNotes = STUDY_NOTE_TOPICS.find(
    (topic) => topic.id === "mountains",
  );

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="study-center-modal" role="dialog" aria-modal="true">
        <header className="modal-header">
          <div>
            <span><Brain size={20} /></span>
            <div>
              <small>KPSS ÇALIŞMA MERKEZİ</small>
              <h2>Bugün ne çalışalım?</h2>
            </div>
          </div>
          <button type="button" aria-label="Çalışma merkezini kapat" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <div className="study-center-tabs">
          <button
            className={tab === "overview" ? "is-active" : ""}
            type="button"
            onClick={() => setTab("overview")}
          >
            Çalışma
          </button>
          <button
            className={tab === "notes" ? "is-active" : ""}
            type="button"
            onClick={() => setTab("notes")}
          >
            Konu Notları
          </button>
          <button
            className={tab === "mistakes" ? "is-active" : ""}
            type="button"
            onClick={() => setTab("mistakes")}
          >
            Yanlışlar <span>{mistakes.length}</span>
          </button>
        </div>

        {tab === "overview" ? (
          <div className="study-center-content">
            <article className="study-mode-card study-mode-card--daily">
              <span><CalendarDays size={24} /></span>
              <div>
                <small>GÜNLÜK ÇALIŞMA</small>
                <h3>Bugünün 10 sorusu</h3>
                <p>Bütün konulardan dengeli, kısa bir tekrar.</p>
                <div className="daily-progress">
                  <i><b style={{ width: `${dailyPercent}%` }} /></i>
                  <span>{answered} / 10</span>
                </div>
              </div>
              <button type="button" onClick={onStartDaily}>
                {dailyProgress?.completed ? (
                  <><CheckCircle2 size={15} /> Tekrar çöz</>
                ) : (
                  "Başla"
                )}
              </button>
            </article>

            <div className="study-mini-stats">
              <span><b>{dailyStreak}</b> günlük seri</span>
              <span><b>{mistakes.length}</b> bekleyen yanlış</span>
              <span>
                <b>{dailyProgress?.correct ?? 0}</b> bugünkü doğru
              </span>
            </div>

            <article className="study-mode-card">
              <span><Shuffle size={23} /></span>
              <div>
                <small>KARIŞIK DENEME</small>
                <h3>Karışık KPSS</h3>
                <p>Dağ, plato, maden, tarım ve diğer bütün setler bir arada.</p>
              </div>
              <button type="button" onClick={onStartMixed}>10 soru çöz</button>
            </article>

            <article className="study-mode-card">
              <span><RotateCcw size={23} /></span>
              <div>
                <small>TEKRAR</small>
                <h3>Yanlışlarını yeniden çöz</h3>
                <p>Doğru cevapladığın soru listeden otomatik çıkar.</p>
              </div>
              <button
                type="button"
                disabled={mistakes.length === 0}
                onClick={onStartMistakes}
              >
                {mistakes.length ? `${mistakes.length} soruyu çöz` : "Yanlış yok"}
              </button>
            </article>
          </div>
        ) : tab === "notes" && mountainNotes ? (
          <div className="study-notes">
            <header className="study-notes__hero">
              <span><Mountain size={25} /></span>
              <div>
                <small>{mountainNotes.subject}</small>
                <h3>{mountainNotes.title}</h3>
                <p>{mountainNotes.description}</p>
              </div>
              <b>1 konu hazır</b>
            </header>

            <section className="study-note-quick">
              <div>
                <BookOpen size={17} />
                <strong>60 saniyelik tekrar</strong>
              </div>
              <ul>
                {mountainNotes.quickFacts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </section>

            <div className="study-note-sections">
              {mountainNotes.sections.map((section, index) => (
                <details key={section.id} open={index === 0}>
                  <summary>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <small>{section.eyebrow}</small>
                      <strong>{section.title}</strong>
                    </div>
                    <ChevronDown size={18} />
                  </summary>
                  <div className="study-note-section__body">
                    <p>{section.summary}</p>

                    {section.bullets && (
                      <ul>
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}

                    {section.groups && (
                      <div className="study-note-groups">
                        {section.groups.map((group) => (
                          <article key={group.title}>
                            <strong>{group.title}</strong>
                            <ul>
                              {group.items.map((entry) => (
                                <li key={entry}>{entry}</li>
                              ))}
                            </ul>
                          </article>
                        ))}
                      </div>
                    )}

                    {section.examNote && (
                      <aside>
                        <b>KPSS ODAĞI</b>
                        <span>{section.examNote}</span>
                      </aside>
                    )}
                  </div>
                </details>
              ))}
            </div>

            <footer className="study-note-sources">
              <div>
                <BookOpen size={17} />
                <span>
                  <strong>Resmî MEB kaynakları</strong>
                  <small>
                    Notlar özetlenmiş ve sınav tekrarına göre düzenlenmiştir.
                  </small>
                </span>
              </div>
              <div>
                {mountainNotes.sources.map((source) => (
                  <a
                    href={source.url}
                    key={`${source.label}-${source.detail}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>
                      <strong>{source.label}</strong>
                      <small>{source.detail}</small>
                    </span>
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </footer>
          </div>
        ) : (
          <div className="mistake-notebook">
            <header>
              <div>
                <CircleAlert size={18} />
                <span>
                  <strong>Yanlışlar defteri</strong>
                  <small>Doğru bildiklerin otomatik temizlenir.</small>
                </span>
              </div>
              {mistakes.length > 0 && (
                <button type="button" onClick={onClearMistakes}>
                  <Trash2 size={14} /> Temizle
                </button>
              )}
            </header>

            {mistakes.length > 0 ? (
              <>
                <div className="mistake-list">
                  {mistakes.map((mistake) => (
                    <article key={mistake.id}>
                      <span>{mistake.mistakeCount}×</span>
                      <div>
                        <strong>{mistake.prompt}</strong>
                        <small>
                          Senin cevabın: {mistake.selectedAnswer}
                        </small>
                        <p>Doğru cevap: {mistake.correctAnswer}</p>
                      </div>
                    </article>
                  ))}
                </div>
                <button
                  className="mistake-review-button"
                  type="button"
                  onClick={onStartMistakes}
                >
                  <RotateCcw size={16} /> Yanlışlardan test oluştur
                </button>
              </>
            ) : (
              <div className="mistake-empty">
                <CheckCircle2 size={34} />
                <strong>Bekleyen yanlışın yok</strong>
                <span>Yeni bir deneme çözdüğünde yanlışların burada görünür.</span>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
