import { useState } from "react";
import {
  BarChart3,
  Brain,
  Layers3,
  Printer,
  Search,
  Share2,
  X,
} from "lucide-react";
import { MARKER_KINDS } from "../markerKinds";
import type { MapMarker, MarkerKind } from "../types";
import { CatalogIcon } from "./CatalogIcon";

type FeatureBarProps = {
  query: string;
  markers: MapMarker[];
  hiddenKinds: MarkerKind[];
  onQueryChange: (query: string) => void;
  onToggleKind: (kind: MarkerKind) => void;
  onQuiz: () => void;
  onStats: () => void;
  onPrint: () => void;
  onShare: () => void;
};

export function FeatureBar({
  query,
  markers,
  hiddenKinds,
  onQueryChange,
  onToggleKind,
  onQuiz,
  onStats,
  onPrint,
  onShare,
}: FeatureBarProps) {
  const [layersOpen, setLayersOpen] = useState(false);

  return (
    <div className="feature-bar">
      <label className="smart-search">
        <Search size={16} />
        <input
          value={query}
          placeholder="İl, not, ürün veya işaret ara..."
          onChange={(event) => onQueryChange(event.target.value)}
        />
        {query && (
          <button
            type="button"
            aria-label="Aramayı temizle"
            onClick={() => onQueryChange("")}
          >
            <X size={14} />
          </button>
        )}
      </label>

      <div className="feature-bar__actions">
        <div className="layer-menu">
          <button
            type="button"
            className={layersOpen ? "is-active" : ""}
            onClick={() => setLayersOpen((current) => !current)}
          >
            <Layers3 size={16} /> Katmanlar
          </button>
          {layersOpen && (
            <div className="layer-popover">
              <header>
                <div>
                  <strong>İşaret katmanları</strong>
                  <small>Haritada görmek istediklerini seç</small>
                </div>
                <button type="button" onClick={() => setLayersOpen(false)}>
                  <X size={15} />
                </button>
              </header>
              <div>
                {MARKER_KINDS.map((kind) => {
                  const count = markers.filter(
                    (marker) => marker.kind === kind.id,
                  ).length;
                  const visible = !hiddenKinds.includes(kind.id);
                  return (
                    <button
                      key={kind.id}
                      type="button"
                      className={visible ? "is-visible" : ""}
                      onClick={() => onToggleKind(kind.id)}
                    >
                      <i style={{ backgroundColor: kind.color }}>
                        <CatalogIcon name={kind.icon} size={13} color="#fff" />
                      </i>
                      <span>{kind.label}</span>
                      <small>{count}</small>
                      <b>{visible ? "Açık" : "Kapalı"}</b>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <button type="button" onClick={onQuiz}>
          <Brain size={16} /> Test modu
        </button>
        <button type="button" onClick={onStats}>
          <BarChart3 size={16} /> İlerleme
        </button>
        <button type="button" onClick={onPrint}>
          <Printer size={16} /> PDF / Yazdır
        </button>
        <button type="button" onClick={onShare}>
          <Share2 size={16} /> Paylaş
        </button>
      </div>
    </div>
  );
}
