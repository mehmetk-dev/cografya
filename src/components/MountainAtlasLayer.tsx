import { MOUNTAIN_ATLAS_LAYOUTS } from "../mountainAtlas";
import type { MapMarker, MountainShapeTool } from "../types";

type MountainAtlasLayerProps = {
  markers: MapMarker[];
  selectedCode: number | null;
  showLabels?: boolean;
  onSelectMarker: (marker: MapMarker) => void;
};

export type MountainFormation = MountainShapeTool;

export function isMountainFormation(
  value: string,
): value is MountainFormation {
  return (
    value === "mountain-fold" ||
    value === "mountain-fault-block" ||
    value === "mountain-volcanic"
  );
}

function mountainFormation(subtype?: string): MountainFormation {
  if (subtype === "mountain-fault-block") return subtype;
  if (subtype === "mountain-volcanic") return subtype;
  return "mountain-fold";
}

export function formationLabel(formation: MountainFormation) {
  if (formation === "mountain-fault-block") return "Kırık Dağ";
  if (formation === "mountain-volcanic") return "Volkanik Dağ";
  return "Kıvrım Dağı";
}

function mapLabel(label: string) {
  return label
    .replace(/ Dağları$/, " D.")
    .replace(/ Dağı$/, " D.")
    .replace(/ Volkanları$/, " Vol.");
}

export function MountainGlyph({
  formation,
}: {
  formation: MountainFormation;
}) {
  if (formation === "mountain-fault-block") {
    return (
      <g
        className="mountain-atlas-glyph mountain-atlas-glyph--fault-block"
        aria-hidden="true"
      >
        <path
          className="mountain-atlas-glyph__base"
          d="M-28 0-20-20-11 0-3-24 8 0 16-18 29 0Z"
          fill="#60463f"
          stroke="#3f302d"
          strokeLinejoin="round"
          strokeWidth="1.25"
        />
        <path
          className="mountain-atlas-glyph__facet"
          d="m-20-20 3 20h-11Zm17-4L3 0H-11Zm19 6 7 18H8Z"
          fill="#816057"
        />
        <path
          className="mountain-atlas-glyph__ridge"
          d="m-20-20 9 20m8-24L8 0m8-18L29 0"
          fill="none"
          stroke="#a08376"
          strokeLinecap="round"
          strokeWidth="1"
        />
      </g>
    );
  }

  if (formation === "mountain-volcanic") {
    return (
      <g
        className="mountain-atlas-glyph mountain-atlas-glyph--volcanic"
        aria-hidden="true"
      >
        <path
          className="mountain-atlas-glyph__smoke"
          d="M-3-27c-4-2-3-7 1-8-1-4 3-7 7-5 4-1 7 3 5 6 4 2 2 7-2 7Z"
          fill="#b77656"
          opacity=".92"
        />
        <path
          className="mountain-atlas-glyph__base"
          d="M-22 0-8-20-3-19 1-22 7-18 22 0Z"
          fill="#963f32"
          stroke="#673029"
          strokeLinejoin="round"
          strokeWidth="1.2"
        />
        <path
          className="mountain-atlas-glyph__facet"
          d="M1-22 7-18 22 0H4Z"
          fill="#c45a3e"
        />
        <path
          className="mountain-atlas-glyph__crater"
          d="m-8-20 5 1 4-3 6 4"
          fill="none"
          stroke="#efaa62"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
        />
        <path
          className="mountain-atlas-glyph__ridge"
          d="m-3-18-5 12m9-13 5 13"
          fill="none"
          stroke="#f0a061"
          strokeLinecap="round"
          strokeWidth="1.15"
        />
      </g>
    );
  }

  return (
    <g
      className="mountain-atlas-glyph mountain-atlas-glyph--fold"
      aria-hidden="true"
    >
      <path
        className="mountain-atlas-glyph__base"
        d="M-30 0-23-10-18-7-12-19-7-11-1-24 5-12 11-20 16-10 21-16 30 0Z"
        fill="#b87a53"
        stroke="#815239"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
      <path
        className="mountain-atlas-glyph__facet"
        d="m-12-19 5 8-3 11h-12Zm11-5 6 12L2 0H-10Zm12 4 5 10-2 10H2Zm10 4 9 16H14Z"
        fill="#cf9367"
      />
      <path
        className="mountain-atlas-glyph__ridge"
        d="m-23-10 5 10m6-19 5 8m6-13 6 12m6-8 5 10m5-6 4 9"
        fill="none"
        stroke="#8c5a40"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      />
    </g>
  );
}

const LEGEND_ITEMS: Array<{
  formation: MountainFormation;
  label: string;
}> = [
  { formation: "mountain-fault-block", label: "Kırık Dağlar" },
  { formation: "mountain-volcanic", label: "Volkanik Dağlar" },
  { formation: "mountain-fold", label: "Kıvrım Dağları" },
];

export function MountainAtlasLayer({
  markers,
  selectedCode,
  showLabels = true,
  onSelectMarker,
}: MountainAtlasLayerProps) {
  const atlasMarkers = markers.flatMap((marker) => {
    const presetId = marker.presetItemId;
    if (!presetId) return [];

    const layout = MOUNTAIN_ATLAS_LAYOUTS[presetId];
    return layout ? [{ layout, marker, presetId }] : [];
  });

  return (
    <g className="mountain-atlas-layer" aria-label="Türkiye'nin dağları">
      <text
        className="mountain-atlas-title"
        x="525"
        y="112"
        textAnchor="middle"
      >
        TÜRKİYE’NİN DAĞLARI
      </text>

      {atlasMarkers.map(({ layout, marker, presetId }) => {
        const formation = mountainFormation(marker.subtype);
        const labelX = layout.labelOffset.x;
        const labelY = layout.labelOffset.y;
        const labelRotation = layout.labelRotation ?? 0;
        const absoluteLabelX = layout.point.x + labelX;
        const labelAnchor =
          absoluteLabelX < 85
            ? "start"
            : absoluteLabelX > 1015
              ? "end"
              : labelX >= 16
                ? "start"
                : labelX <= -16
                  ? "end"
                  : "middle";
        const selected = selectedCode === marker.provinceCode;

        return (
          <g
            className={[
              "mountain-atlas-marker",
              `mountain-atlas-marker--${formation.replace("mountain-", "")}`,
              selected ? "is-selected" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            data-preset-id={presetId}
            data-province-code={marker.provinceCode}
            key={marker.id}
            transform={`translate(${layout.point.x} ${layout.point.y})`}
            role="button"
            tabIndex={0}
            aria-label={`${marker.label}, ${marker.provinceName}, ${formationLabel(formation)}`}
            aria-pressed={selected}
            onClick={(event) => {
              event.stopPropagation();
              onSelectMarker(marker);
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              event.stopPropagation();
              onSelectMarker(marker);
            }}
          >
            <title>
              {marker.label} · {marker.provinceName} ·{" "}
              {formationLabel(formation)}
            </title>
            <g
              className="mountain-atlas-symbol"
              transform={`scale(${(layout.symbolScale ?? 1) * 0.76})`}
            >
              <MountainGlyph formation={formation} />
            </g>
            {showLabels && (
              <text
                className="mountain-atlas-label"
                x={labelX}
                y={labelY}
                textAnchor={labelAnchor}
                dominantBaseline="middle"
                transform={
                  labelRotation
                    ? `rotate(${labelRotation} ${labelX} ${labelY})`
                    : undefined
                }
              >
                {mapLabel(marker.label)}
              </text>
            )}
          </g>
        );
      })}

      <g
        className="mountain-atlas-legend"
        transform="translate(706 101)"
        aria-label="Dağ oluşumları lejantı"
      >
        <rect
          className="mountain-atlas-legend__background"
          width="337"
          height="43"
          rx="9"
        />
        {LEGEND_ITEMS.map((item, index) => {
          return (
            <g
              className="mountain-atlas-legend__item"
              data-formation={item.formation}
              key={item.formation}
              transform={`translate(${index * 111} 0)`}
            >
              <g transform="translate(18 29) scale(.38)">
                <MountainGlyph formation={item.formation} />
              </g>
              <text x="34" y="25">
                {item.label}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
}
