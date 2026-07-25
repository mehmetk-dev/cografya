import {
  CalendarCheck2,
  CircleAlert,
  Library,
  Map,
} from "lucide-react";

type MobileBottomNavProps = {
  mistakeCount: number;
  dailyCompleted: boolean;
  onMap: () => void;
  onSets: () => void;
  onDaily: () => void;
  onMistakes: () => void;
};

export function MobileBottomNav({
  mistakeCount,
  dailyCompleted,
  onMap,
  onSets,
  onDaily,
  onMistakes,
}: MobileBottomNavProps) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobil çalışma menüsü">
      <button type="button" onClick={onMap}>
        <Map size={19} />
        <span>Harita</span>
      </button>
      <button type="button" onClick={onSets}>
        <Library size={19} />
        <span>Setler</span>
      </button>
      <button
        className={dailyCompleted ? "is-complete" : ""}
        type="button"
        onClick={onDaily}
      >
        <CalendarCheck2 size={19} />
        <span>Günlük</span>
        {dailyCompleted && <i />}
      </button>
      <button type="button" onClick={onMistakes}>
        <CircleAlert size={19} />
        <span>Yanlışlar</span>
        {mistakeCount > 0 && <b>{mistakeCount}</b>}
      </button>
    </nav>
  );
}
