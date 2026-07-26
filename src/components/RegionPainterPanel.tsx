import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eraser,
  Paintbrush,
  RotateCcw,
  X,
} from "lucide-react";
import { GEOGRAPHICAL_REGIONS } from "../regionPainting";

export type RegionPainterMode = "paint" | "erase";

type RegionPainterPanelProps = {
  color: string;
  fills: Record<string, string>;
  mode: RegionPainterMode;
  onApply: (provinceCodes: number[], fill: string | null) => void;
  onClose: () => void;
  onColorChange: (color: string) => void;
  onModeChange: (mode: RegionPainterMode) => void;
};

const COLOR_SWATCHES = [
  "#2f80a8",
  "#5e9e96",
  "#d2a84b",
  "#e28a4e",
  "#c96b53",
  "#9b6f9e",
];

export function RegionPainterPanel({
  color,
  fills,
  mode,
  onApply,
  onClose,
  onColorChange,
  onModeChange,
}: RegionPainterPanelProps) {
  const filledCount = Object.keys(fills).length;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section
      className={`region-painter ${
        collapsed ? "region-painter--collapsed" : ""
      }`}
      role="region"
      aria-label="Bölge boyama paneli"
    >
      <header className="region-painter__header">
        <div>
          <span className="eyebrow">TOPLU İL SEÇİMİ</span>
          <strong>Bölge Boyama</strong>
        </div>
        <span className="region-painter__count">{filledCount} il boyalı</span>
        <button
          type="button"
          aria-label={
            collapsed ? "Bölge ayarlarını aç" : "Bölge ayarlarını küçült"
          }
          onClick={() => setCollapsed((current) => !current)}
        >
          {collapsed ? <ChevronDown size={17} /> : <ChevronUp size={17} />}
        </button>
        <button
          type="button"
          aria-label="Bölge boyamayı kapat"
          onClick={onClose}
        >
          <X size={17} />
        </button>
      </header>

      {!collapsed && (
        <>
          <div className="region-painter__mode" aria-label="Bölge boyama modu">
            <button
              type="button"
              className={mode === "paint" ? "is-active" : ""}
              aria-pressed={mode === "paint"}
              onClick={() => onModeChange("paint")}
            >
              <Paintbrush size={15} /> Boya
            </button>
            <button
              type="button"
              className={mode === "erase" ? "is-active" : ""}
              aria-pressed={mode === "erase"}
              onClick={() => onModeChange("erase")}
            >
              <Eraser size={15} /> Silgi
            </button>
          </div>

          <p className="region-painter__hint">
            {mode === "paint"
              ? "Haritada parmağını veya fareyi illerin üzerinde kaydır."
              : "Rengini kaldırmak istediğin illerin üzerinde kaydır."}
          </p>

          {mode === "paint" && (
            <div className="region-painter__colors" aria-label="Bölge rengi">
              {COLOR_SWATCHES.map((swatch) => (
                <button
                  type="button"
                  key={swatch}
                  className={color === swatch ? "is-active" : ""}
                  style={{ "--swatch-color": swatch } as React.CSSProperties}
                  aria-label={`${swatch} rengini seç`}
                  aria-pressed={color === swatch}
                  onClick={() => onColorChange(swatch)}
                />
              ))}
              <label title="Özel bölge rengi">
                <input
                  type="color"
                  value={color}
                  aria-label="Özel bölge rengi"
                  onChange={(event) => onColorChange(event.target.value)}
                />
              </label>
            </div>
          )}

          <button
            className="region-painter__start"
            type="button"
            onClick={() => setCollapsed(true)}
          >
            <Paintbrush size={14} />
            Haritada {mode === "paint" ? "boyamaya" : "silmeye"} başla
          </button>

          <div className="region-painter__presets">
            <span>Hazır coğrafi bölgeler</span>
            <div>
              {GEOGRAPHICAL_REGIONS.map((region) => (
                <button
                  type="button"
                  key={region.id}
                  style={
                    { "--region-color": region.color } as React.CSSProperties
                  }
                  aria-label={`${region.name} bölgesini ${
                    mode === "paint" ? "uygula" : "kaldır"
                  }`}
                  onClick={() => {
                    if (mode === "paint") onColorChange(region.color);
                    onApply(
                      region.provinceCodes,
                      mode === "paint" ? region.color : null,
                    );
                  }}
                >
                  <i />
                  <span>{region.shortName}</span>
                  <small>{region.provinceCodes.length}</small>
                </button>
              ))}
            </div>
          </div>

          {filledCount > 0 && (
            <button
              className="region-painter__clear"
              type="button"
              onClick={() => {
                onModeChange("erase");
                onApply(Object.keys(fills).map(Number), null);
              }}
            >
              <RotateCcw size={14} /> Tüm bölge renklerini kaldır
            </button>
          )}
        </>
      )}
    </section>
  );
}
