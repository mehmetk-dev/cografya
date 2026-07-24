import { BarChart3, Brain, Crosshair, Map, Pencil, X } from "lucide-react";
import type { MapDrawing, MapMarker, ProvinceRecord, QuizStats } from "../types";

type StatsModalProps = {
  open: boolean;
  mapName: string;
  records: ProvinceRecord[];
  markers: MapMarker[];
  drawings: MapDrawing[];
  quizStats?: QuizStats;
  onClose: () => void;
};

export function StatsModal({
  open,
  mapName,
  records,
  markers,
  drawings,
  quizStats,
  onClose,
}: StatsModalProps) {
  if (!open) return null;

  const provinces = new Set([
    ...records.map((record) => record.provinceCode),
    ...markers.map((marker) => marker.provinceCode),
  ]).size;
  const coverage = Math.round((provinces / 81) * 100);
  const success = quizStats?.totalAnswered
    ? Math.round(
        (quizStats.correctAnswers / quizStats.totalAnswered) * 100,
      )
    : 0;

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="stats-modal" role="dialog" aria-modal="true">
        <header className="modal-header">
          <div>
            <span><BarChart3 size={20} /></span>
            <div>
              <small>ÇALIŞMA İLERLEMESİ</small>
              <h2>{mapName}</h2>
            </div>
          </div>
          <button type="button" aria-label="İstatistikleri kapat" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <div className="coverage-card">
          <div>
            <small>HARİTA TAMAMLANMA ORANI</small>
            <strong>%{coverage}</strong>
            <span>{provinces} / 81 il çalışıldı</span>
          </div>
          <div
            className="coverage-ring"
            style={{
              background: `conic-gradient(#e9a23b ${coverage * 3.6}deg, #e8e2d7 0deg)`,
            }}
          >
            <i>{coverage}%</i>
          </div>
        </div>

        <div className="stats-grid">
          <article><Map size={19} /><strong>{records.length}</strong><span>Notlu il</span></article>
          <article><Crosshair size={19} /><strong>{markers.length}</strong><span>Konum işareti</span></article>
          <article><Pencil size={19} /><strong>{drawings.length}</strong><span>Harita çizimi</span></article>
          <article><Brain size={19} /><strong>%{success}</strong><span>Test başarısı</span></article>
        </div>

        <div className="quiz-stat-line">
          <span><b>{quizStats?.sessions ?? 0}</b> test oturumu</span>
          <span><b>{quizStats?.totalAnswered ?? 0}</b> cevap</span>
          <span><b>{quizStats?.bestStreak ?? 0}</b> en iyi seri</span>
        </div>

        <div className="coverage-bar">
          <span style={{ width: `${coverage}%` }} />
        </div>
        <p>
          {81 - provinces > 0
            ? `Çalışılmayı bekleyen ${81 - provinces} il var.`
            : "Türkiye’nin bütün illerine en az bir not veya işaret ekledin."}
        </p>
      </section>
    </div>
  );
}
