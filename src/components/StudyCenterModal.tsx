import { useEffect, useState } from "react";
import {
  Brain,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  RotateCcw,
  Shuffle,
  Trash2,
  X,
} from "lucide-react";
import type { DailyProgress, QuizMistake } from "../types";

type StudyCenterTab = "overview" | "mistakes";

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
          <button
            type="button"
            aria-label="Çalışma merkezini kapat"
            onClick={onClose}
          >
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
              <span><b>{dailyProgress?.correct ?? 0}</b> bugünkü doğru</span>
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
                        <small>Senin cevabın: {mistake.selectedAnswer}</small>
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
                <span>
                  Yeni bir deneme çözdüğünde yanlışların burada görünür.
                </span>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
