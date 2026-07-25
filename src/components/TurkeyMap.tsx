import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Circle,
  Eraser,
  Minus,
  MoveRight,
  Pencil,
  Plus,
  Scan,
  Type,
  Undo2,
} from "lucide-react";
import { cities as mapCities } from "turkey-map-react/lib/data";
import { getMarkerVisual } from "../markerKinds";
import { RIVER_ROUTES } from "../riverRoutes";
import { CatalogIcon } from "./CatalogIcon";
import type {
  City,
  DrawingTool,
  MapDrawing,
  MapMarker,
  MapPoint,
  ProvinceRecord,
} from "../types";

type TurkeyMapProps = {
  selectedCode: number | null;
  records: ProvinceRecord[];
  markers: MapMarker[];
  drawings?: MapDrawing[];
  themeColor: string;
  showLabels: boolean;
  showProvinceNames?: boolean;
  readOnly?: boolean;
  onSelect: (city: City) => void;
  placementProvinceCode?: number | null;
  onPlaceMarker?: (city: City, point: Point) => void;
  onPlacementMismatch?: (city: City) => void;
  matchingProvinceCodes?: Set<number> | null;
  drawingTool?: DrawingTool | null;
  drawingColor?: string;
  onDrawingToolChange?: (tool: DrawingTool | null) => void;
  onDrawingColorChange?: (color: string) => void;
  onAddDrawing?: (
    tool: DrawingTool,
    points: MapPoint[],
    text?: string,
  ) => void;
  onUndoDrawing?: () => void;
  onClearDrawings?: () => void;
  exportMode?: boolean;
};

export type Point = {
  x: number;
  y: number;
};

type LabelLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
  anchorX: number;
  anchorY: number;
};

type PanGesture = {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startPan: Point;
  moved: boolean;
};

const BASE_VIEWBOX = {
  x: 0,
  y: 80,
  width: 1050,
  height: 585,
};

const DENSE_MARKER_LABEL_THRESHOLD = 18;

const cities = [...(mapCities as City[])].sort(
  (left, right) => left.plateNumber - right.plateNumber,
);

export const turkeyCities = cities;

function shortMarkerLabel(label: string) {
  return label.length > 18 ? `${label.slice(0, 17)}…` : label;
}

function overlapArea(
  left: Pick<LabelLayout, "x" | "y" | "width" | "height">,
  right: Pick<LabelLayout, "x" | "y" | "width" | "height">,
  padding = 0,
) {
  const width =
    Math.min(left.x + left.width + padding, right.x + right.width + padding) -
    Math.max(left.x - padding, right.x - padding);
  const height =
    Math.min(left.y + left.height + padding, right.y + right.height + padding) -
    Math.max(left.y - padding, right.y - padding);
  return Math.max(0, width) * Math.max(0, height);
}

function smoothPath(points: MapPoint[]) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[Math.max(0, index - 1)];
    const current = points[index];
    const next = points[index + 1];
    const following = points[Math.min(points.length - 1, index + 2)];
    const controlOne = {
      x: current.x + (next.x - previous.x) / 6,
      y: current.y + (next.y - previous.y) / 6,
    };
    const controlTwo = {
      x: next.x - (following.x - current.x) / 6,
      y: next.y - (following.y - current.y) / 6,
    };
    path += ` C ${controlOne.x} ${controlOne.y}, ${controlTwo.x} ${controlTwo.y}, ${next.x} ${next.y}`;
  }
  return path;
}

function clampPan(point: Point, zoom: number): Point {
  const visibleWidth = BASE_VIEWBOX.width / zoom;
  const visibleHeight = BASE_VIEWBOX.height / zoom;
  const limitX = (BASE_VIEWBOX.width - visibleWidth) / 2;
  const limitY = (BASE_VIEWBOX.height - visibleHeight) / 2;

  return {
    x: Math.max(-limitX, Math.min(limitX, point.x)),
    y: Math.max(-limitY, Math.min(limitY, point.y)),
  };
}

export function TurkeyMap({
  selectedCode,
  records,
  markers,
  drawings = [],
  themeColor,
  showLabels,
  showProvinceNames = false,
  readOnly = false,
  onSelect,
  placementProvinceCode = null,
  onPlaceMarker,
  onPlacementMismatch,
  matchingProvinceCodes = null,
  drawingTool = null,
  drawingColor = "#d05f64",
  onDrawingToolChange,
  onDrawingColorChange,
  onAddDrawing,
  onUndoDrawing,
  onClearDrawings,
  exportMode = false,
}: TurkeyMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const panGestureRef = useRef<PanGesture | null>(null);
  const suppressMapClickRef = useRef(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [centers, setCenters] = useState<Record<number, Point>>({});
  const [provinceSizes, setProvinceSizes] = useState<
    Record<number, { width: number; height: number }>
  >({});
  const [draftDrawing, setDraftDrawing] = useState<MapPoint[]>([]);
  const [legendOpen, setLegendOpen] = useState(
    () => !window.matchMedia("(max-width: 640px)").matches,
  );

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 640px)");
    const syncLegend = (event: MediaQueryListEvent) => {
      setLegendOpen(!event.matches);
    };
    mobileQuery.addEventListener("change", syncLegend);
    return () => mobileQuery.removeEventListener("change", syncLegend);
  }, []);

  const recordsByCode = useMemo(
    () => new Map(records.map((record) => [record.provinceCode, record])),
    [records],
  );
  const markerLegend = useMemo(() => {
    const groups = new Map<
      string,
      { visual: ReturnType<typeof getMarkerVisual>; count: number; color: string }
    >();

    markers.forEach((marker) => {
      const visual = getMarkerVisual(marker);
      const current = groups.get(visual.id);
      if (current) {
        current.count += 1;
      } else {
        groups.set(visual.id, {
          visual,
          count: 1,
          color: marker.color,
        });
      }
    });

    return [...groups.values()];
  }, [markers]);
  const routedRivers = useMemo(
    () =>
      markers.flatMap((marker) => {
        if (marker.kind !== "river" || !marker.presetItemId) return [];
        const route = RIVER_ROUTES[marker.presetItemId];
        return route ? [{ marker, route }] : [];
      }),
    [markers],
  );
  const routedRiverMarkerIds = useMemo(
    () => new Set(routedRivers.map(({ marker }) => marker.id)),
    [routedRivers],
  );
  const denseMarkerLabels =
    markers.length - routedRiverMarkerIds.size > DENSE_MARKER_LABEL_THRESHOLD;
  const markerPositions = useMemo(() => {
    const offsets = [
      { x: 0, y: 0 },
      { x: 19, y: -18 },
      { x: -19, y: 18 },
      { x: 24, y: 17 },
      { x: -24, y: -17 },
      { x: 0, y: 31 },
      { x: 0, y: -31 },
    ];
    const provinceCounts = new Map<number, number>();
    const positions = new Map<string, Point>();

    markers.forEach((marker) => {
      if (routedRiverMarkerIds.has(marker.id)) return;
      if (!marker.anchoredToProvince) {
        positions.set(marker.id, { x: marker.x, y: marker.y });
        return;
      }
      const center = centers[marker.provinceCode];
      if (!center) return;
      const index = provinceCounts.get(marker.provinceCode) ?? 0;
      provinceCounts.set(marker.provinceCode, index + 1);
      const ring = Math.floor(index / offsets.length);
      const base = offsets[index % offsets.length];
      const scale = 1 + ring * 0.72;
      positions.set(marker.id, {
        x: center.x + base.x * scale,
        y: center.y + base.y * scale,
      });
    });

    return positions;
  }, [markers, centers, routedRiverMarkerIds]);
  const markerLabelLayouts = useMemo(() => {
    const layouts = new Map<string, LabelLayout>();
    const placed: Array<
      Pick<LabelLayout, "x" | "y" | "width" | "height">
    > = [
      // Lejant, çizim araçları ve yakınlaştırma düğmelerinin kapladığı alanlar.
      { x: 4, y: 84, width: 142, height: 116 },
      { x: 830, y: 84, width: 216, height: 58 },
      { x: 4, y: 598, width: 150, height: 63 },
      { x: 946, y: 598, width: 100, height: 63 },
    ];
    const pinBoxes = [...markerPositions.entries()].map(([id, position]) => ({
      id,
      x: position.x - 15,
      y: position.y - 39,
      width: 30,
      height: 41,
    }));
    const orderedMarkers = [...markers].sort((left, right) => {
      const leftPosition = markerPositions.get(left.id);
      const rightPosition = markerPositions.get(right.id);
      if (!leftPosition || !rightPosition) return 0;
      return (
        leftPosition.y - rightPosition.y ||
        leftPosition.x - rightPosition.x
      );
    });

    orderedMarkers.forEach((marker) => {
      const position = markerPositions.get(marker.id);
      if (!position) return;
      const label = shortMarkerLabel(marker.label);
      const width = Math.max(52, label.length * 6.6 + 17);
      const height = 21;
      const verticalOffsets = [-43, 4, -69, 30, -95, 56];
      const candidates = verticalOffsets.flatMap((offsetY) => [
        { x: position.x + 14, y: position.y + offsetY },
        { x: position.x - width - 14, y: position.y + offsetY },
      ]);
      candidates.push(
        { x: position.x - width / 2, y: position.y - 70 },
        { x: position.x - width / 2, y: position.y + 12 },
      );
      // Yoğun setlerde (özellikle Marmara, İç Anadolu ve maden/sanayi
      // haritaları) yakın seçenekler dolabilir. Genişleyen halkalar bütün
      // harita üzerinde çakışmasız bir yedek konum arar.
      [58, 82, 108, 136, 166, 198].forEach((radius) => {
        for (let degree = 0; degree < 360; degree += 30) {
          const angle = (degree * Math.PI) / 180;
          candidates.push({
            x: position.x + Math.cos(angle) * radius - width / 2,
            y:
              position.y -
              23 +
              Math.sin(angle) * radius -
              height / 2,
          });
        }
      });

      const best = candidates.reduce<{
        x: number;
        y: number;
        score: number;
      } | null>((winner, candidate, candidateIndex) => {
        const rectangle = { ...candidate, width, height };
        const labelCollision = placed.reduce(
          (total, existing) =>
            total + overlapArea(rectangle, existing, 3),
          0,
        );
        const pinCollision = pinBoxes.reduce(
          (total, pin) =>
            pin.id === marker.id
              ? total
              : total + overlapArea(rectangle, pin, 2),
          0,
        );
        const outsideX =
          Math.max(0, BASE_VIEWBOX.x + 8 - candidate.x) +
          Math.max(
            0,
            candidate.x + width - (BASE_VIEWBOX.x + BASE_VIEWBOX.width - 8),
          );
        const outsideY =
          Math.max(0, BASE_VIEWBOX.y + 8 - candidate.y) +
          Math.max(
            0,
            candidate.y + height -
              (BASE_VIEWBOX.y + BASE_VIEWBOX.height - 8),
          );
        const distance = Math.hypot(
          candidate.x + width / 2 - position.x,
          candidate.y + height / 2 - (position.y - 23),
        );
        const score =
          labelCollision * 5000 +
          pinCollision * 2500 +
          (outsideX + outsideY) * 50000 +
          distance +
          candidateIndex * 0.2;

        return !winner || score < winner.score
          ? { ...candidate, score }
          : winner;
      }, null);

      if (!best) return;
      const anchorX = Math.min(
        best.x + width,
        Math.max(best.x, position.x),
      );
      const anchorY = Math.min(
        best.y + height,
        Math.max(best.y, position.y - 23),
      );
      const layout = {
        x: best.x,
        y: best.y,
        width,
        height,
        anchorX,
        anchorY,
      };
      layouts.set(marker.id, layout);
      placed.push(layout);
    });

    return layouts;
  }, [markers, markerPositions]);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const nextCenters: Record<number, Point> = {};
    const nextSizes: Record<number, { width: number; height: number }> = {};

    svg.querySelectorAll<SVGPathElement>("[data-province-code]").forEach((path) => {
      const code = Number(path.dataset.provinceCode);
      const box = path.getBBox();
      nextCenters[code] = {
        x: box.x + box.width / 2,
        y: box.y + box.height / 2,
      };
      nextSizes[code] = { width: box.width, height: box.height };
    });

    setCenters(nextCenters);
    setProvinceSizes(nextSizes);
  }, []);

  const viewWidth = BASE_VIEWBOX.width / zoom;
  const viewHeight = BASE_VIEWBOX.height / zoom;
  const viewX =
    BASE_VIEWBOX.x + (BASE_VIEWBOX.width - viewWidth) / 2 + pan.x;
  const viewY =
    BASE_VIEWBOX.y + (BASE_VIEWBOX.height - viewHeight) / 2 + pan.y;

  const changeZoom = (nextZoom: number) => {
    const normalizedZoom = Math.max(1, Math.min(1.8, nextZoom));
    setZoom(normalizedZoom);
    setPan((current) => clampPan(current, normalizedZoom));
  };

  const resetViewport = () => {
    panGestureRef.current = null;
    setIsPanning(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const eventToPoint = (
    event: React.PointerEvent<SVGSVGElement> | React.MouseEvent<SVGGElement>,
  ) => {
    const svg = svgRef.current;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return null;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const result = point.matrixTransform(matrix.inverse());
    return { x: result.x, y: result.y };
  };

  const handleProvinceClick = (
    event: React.MouseEvent<SVGGElement>,
    city: City,
  ) => {
    if (drawingTool) return;
    if (!placementProvinceCode) {
      onSelect(city);
      return;
    }

    if (city.plateNumber !== placementProvinceCode) {
      onPlacementMismatch?.(city);
      return;
    }

    const point = eventToPoint(event);
    if (point) onPlaceMarker?.(city, point);
  };

  const drawingPath = (points: MapPoint[]) =>
    points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

  const renderDrawing = (
    drawing: Pick<MapDrawing, "id" | "tool" | "color" | "points" | "text">,
    draft = false,
  ) => {
    if (drawing.points.length === 0) return null;
    const first = drawing.points[0];
    const last = drawing.points[drawing.points.length - 1];
    const common = {
      stroke: drawing.color,
      className: draft ? "drawing-shape drawing-shape--draft" : "drawing-shape",
    };

    if (drawing.tool === "pen") {
      return (
        <path
          key={drawing.id}
          {...common}
          d={drawingPath(drawing.points)}
          fill="none"
        />
      );
    }
    if (drawing.tool === "circle") {
      const radius = Math.hypot(last.x - first.x, last.y - first.y);
      return (
        <circle
          key={drawing.id}
          {...common}
          cx={first.x}
          cy={first.y}
          r={radius}
          fill="none"
        />
      );
    }
    if (drawing.tool === "arrow") {
      const angle = Math.atan2(last.y - first.y, last.x - first.x);
      const size = 11;
      const left = {
        x: last.x - size * Math.cos(angle - Math.PI / 6),
        y: last.y - size * Math.sin(angle - Math.PI / 6),
      };
      const right = {
        x: last.x - size * Math.cos(angle + Math.PI / 6),
        y: last.y - size * Math.sin(angle + Math.PI / 6),
      };
      return (
        <g key={drawing.id} className={common.className}>
          <line {...common} x1={first.x} y1={first.y} x2={last.x} y2={last.y} />
          <path
            d={`M ${left.x} ${left.y} L ${last.x} ${last.y} L ${right.x} ${right.y}`}
            fill="none"
            stroke={drawing.color}
          />
        </g>
      );
    }
    return (
      <text
        key={drawing.id}
        className="drawing-text"
        x={first.x}
        y={first.y}
        fill={drawing.color}
      >
        {drawing.text}
      </text>
    );
  };

  return (
    <section
      className={`map-stage ${placementProvinceCode ? "map-stage--placing" : ""}`}
      aria-label="Etkileşimli Türkiye haritası"
    >
      <div className="map-stage__topline">
        <div>
          <span className="eyebrow">ÇALIŞMA ALANI</span>
          <h2>Türkiye&apos;nin 81 ili</h2>
        </div>

        <div className="map-legend" aria-label="Harita açıklaması">
          <span><i className="legend-dot legend-dot--empty" /> Boş</span>
          <span><i className="legend-dot legend-dot--saved" /> Not eklendi</span>
          <span><i className="legend-dot legend-dot--selected" /> Seçili</span>
        </div>
      </div>

      <div className="map-canvas">
        <div className="map-texture" />
        {placementProvinceCode && (
          <div className="placement-banner">
            <span>+</span>
            İşareti bırakmak için seçili ilin içinde bir noktaya dokun
          </div>
        )}
        <svg
          ref={svgRef}
          className={[
            "turkey-map",
            zoom > 1 && !drawingTool ? "turkey-map--pannable" : "",
            isPanning ? "turkey-map--panning" : "",
          ].join(" ")}
          viewBox={`${viewX} ${viewY} ${viewWidth} ${viewHeight}`}
          role="group"
          aria-label="81 ilden oluşan Türkiye haritası"
          onPointerDown={(event) => {
            if (exportMode) return;
            if (drawingTool) {
              const point = eventToPoint(event);
              if (!point) return;
              if (drawingTool === "text") {
                const text = window.prompt("Haritaya yazılacak metin:");
                if (text?.trim()) onAddDrawing?.("text", [point], text.trim());
                return;
              }
              event.currentTarget.setPointerCapture(event.pointerId);
              setDraftDrawing([point]);
              return;
            }

            if (zoom <= 1 || (event.pointerType === "mouse" && event.button !== 0)) {
              return;
            }
            event.currentTarget.setPointerCapture(event.pointerId);
            panGestureRef.current = {
              pointerId: event.pointerId,
              startClientX: event.clientX,
              startClientY: event.clientY,
              startPan: pan,
              moved: false,
            };
            setIsPanning(true);
          }}
          onPointerMove={(event) => {
            if (drawingTool && draftDrawing.length > 0) {
              const point = eventToPoint(event);
              if (!point) return;
              setDraftDrawing((current) =>
                drawingTool === "pen"
                  ? [...current, point]
                  : [current[0], point],
              );
              return;
            }

            const gesture = panGestureRef.current;
            const svg = svgRef.current;
            if (!gesture || gesture.pointerId !== event.pointerId || !svg) return;
            const deltaX = event.clientX - gesture.startClientX;
            const deltaY = event.clientY - gesture.startClientY;
            if (Math.hypot(deltaX, deltaY) > 4) gesture.moved = true;
            if (!gesture.moved) return;

            event.preventDefault();
            setPan(
              clampPan(
                {
                  x:
                    gesture.startPan.x -
                    deltaX * (viewWidth / Math.max(svg.clientWidth, 1)),
                  y:
                    gesture.startPan.y -
                    deltaY * (viewHeight / Math.max(svg.clientHeight, 1)),
                },
                zoom,
              ),
            );
          }}
          onPointerUp={(event) => {
            if (drawingTool && draftDrawing.length > 0) {
              event.currentTarget.releasePointerCapture(event.pointerId);
              if (draftDrawing.length > 1) {
                onAddDrawing?.(drawingTool, draftDrawing);
              }
              setDraftDrawing([]);
              return;
            }

            const gesture = panGestureRef.current;
            if (!gesture || gesture.pointerId !== event.pointerId) return;
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
            suppressMapClickRef.current = gesture.moved;
            panGestureRef.current = null;
            setIsPanning(false);
            window.setTimeout(() => {
              suppressMapClickRef.current = false;
            }, 0);
          }}
          onPointerCancel={(event) => {
            if (
              panGestureRef.current?.pointerId === event.pointerId
            ) {
              panGestureRef.current = null;
              suppressMapClickRef.current = false;
              setIsPanning(false);
            }
            setDraftDrawing([]);
          }}
          onClickCapture={(event) => {
            if (!suppressMapClickRef.current) return;
            event.preventDefault();
            event.stopPropagation();
            suppressMapClickRef.current = false;
          }}
        >
          <g className="province-layer">
            {cities.map((city) => {
              const record = recordsByCode.get(city.plateNumber);
              const isSelected = selectedCode === city.plateNumber;

              return (
                <g
                  key={city.id}
                  className={[
                    "province",
                    isSelected ? "province--selected" : "",
                    record ? "province--recorded" : "",
                    city.plateNumber === placementProvinceCode
                      ? "province--placement-target"
                      : "",
                    matchingProvinceCodes &&
                    !matchingProvinceCodes.has(city.plateNumber)
                      ? "province--filtered-out"
                      : "",
                  ].join(" ")}
                  role="button"
                  tabIndex={0}
                  aria-label={`${city.plateNumber.toString().padStart(2, "0")} ${city.name}${record ? ", not eklendi" : ""}`}
                  aria-pressed={isSelected}
                  onClick={(event) => handleProvinceClick(event, city)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      if (!placementProvinceCode) onSelect(city);
                    }
                  }}
                  style={
                    {
                      "--record-color": record?.color || themeColor,
                      "--theme-color": themeColor,
                    } as React.CSSProperties
                  }
                >
                  <title>
                    {city.plateNumber.toString().padStart(2, "0")} · {city.name}
                    {record ? " · Not eklendi" : ""}
                  </title>
                  <path data-province-code={city.plateNumber} d={city.path} />
                </g>
              );
            })}
          </g>

          <g className="river-route-layer">
            {routedRivers.map(({ marker, route }) => {
              const visual = getMarkerVisual(marker);
              const last = route.points.at(-1);
              const beforeLast = route.points.at(-2);
              const angle =
                last && beforeLast
                  ? (Math.atan2(
                      last.y - beforeLast.y,
                      last.x - beforeLast.x,
                    ) *
                      180) /
                    Math.PI
                  : 0;
              const routeLabel = shortMarkerLabel(marker.label);
              const labelWidth = Math.max(56, routeLabel.length * 6.8 + 20);
              const branchNames = route.branches
                .map((branch) => branch.name)
                .join(", ");
              const selectRiver = () => {
                if (drawingTool || placementProvinceCode) return;
                const city = cities.find(
                  (candidate) =>
                    candidate.plateNumber === marker.provinceCode,
                );
                if (city) onSelect(city);
              };

              return (
                <g
                  key={marker.id}
                  className={[
                    "river-route",
                    selectedCode === marker.provinceCode
                      ? "river-route--selected"
                      : "",
                  ].join(" ")}
                  role="button"
                  tabIndex={0}
                  aria-label={`${marker.label}, ${visual.label}. Kolları: ${branchNames}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    selectRiver();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selectRiver();
                    }
                  }}
                  style={
                    {
                      "--river-color": marker.color,
                    } as React.CSSProperties
                  }
                >
                  <title>
                    {marker.label} · {visual.label} · Kolları: {branchNames}
                  </title>
                  <path
                    className="river-route__hit"
                    d={smoothPath(route.points)}
                  />
                  <path
                    className="river-route__main"
                    d={smoothPath(route.points)}
                  />
                  {route.branches.map((branch) => (
                    <g key={branch.name}>
                      <path
                        className="river-route__branch"
                        d={smoothPath(branch.points)}
                      />
                      {showLabels && branch.labelAt && (
                        <text
                          className="river-route__branch-label"
                          x={branch.labelAt.x}
                          y={branch.labelAt.y}
                        >
                          {branch.name}
                        </text>
                      )}
                    </g>
                  ))}
                  <circle
                    className="river-route__source"
                    cx={route.points[0].x}
                    cy={route.points[0].y}
                    r="3.6"
                  />
                  {last && (
                    <path
                      className="river-route__arrow"
                      d="M -9 -5 L 0 0 L -9 5"
                      transform={`translate(${last.x} ${last.y}) rotate(${angle})`}
                    />
                  )}
                  {showLabels && (
                    <g
                      className="river-route__label"
                      transform={`translate(${route.labelAt.x} ${route.labelAt.y})`}
                    >
                      <rect
                        x={-labelWidth / 2}
                        y="-14"
                        width={labelWidth}
                        height="22"
                        rx="7"
                      />
                      <text y="1">{routeLabel}</text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {showProvinceNames && (
            <g className="province-name-layer" aria-hidden="true">
              {cities.map((city) => {
                const center = centers[city.plateNumber];
                const size = provinceSizes[city.plateNumber];
                if (!center || !size) return null;
                const fontSize = Math.max(
                  4.5,
                  Math.min(
                    7.4,
                    size.width / Math.max(city.name.length * 0.72, 4),
                    size.height * 0.34,
                  ),
                );
                return (
                  <text
                    key={city.id}
                    x={center.x}
                    y={center.y + fontSize / 3}
                    style={{ fontSize }}
                  >
                    {city.name}
                  </text>
                );
              })}
            </g>
          )}

          <g className="drawing-layer" aria-hidden="true">
            {drawings.map((drawing) => renderDrawing(drawing))}
            {drawingTool &&
              draftDrawing.length > 0 &&
              renderDrawing(
                {
                  id: "draft",
                  tool: drawingTool,
                  color: drawingColor,
                  points: draftDrawing,
                },
                true,
              )}
          </g>

          {showLabels && (
            <g className="annotation-layer" aria-hidden="true">
              {records.map((record) => {
                const center = centers[record.provinceCode];
                const label = (record.items[0]?.text || record.title).trim();
                if (!center || !label) return null;

                const shortLabel =
                  label.length > 13 ? `${label.slice(0, 12)}…` : label;
                const width = Math.max(42, shortLabel.length * 6.5 + 18);

                return (
                  <g
                    key={record.id}
                    className="map-annotation"
                    transform={`translate(${center.x} ${center.y})`}
                  >
                    <circle r="4.5" fill={record.color || themeColor} />
                    <line y1="4" y2="13" />
                    <rect
                      x={-width / 2}
                      y="12"
                      width={width}
                      height="22"
                      rx="7"
                    />
                    <text y="27">{shortLabel}</text>
                  </g>
                );
              })}
            </g>
          )}

          <g className="marker-layer">
            {markers.map((marker) => {
              if (routedRiverMarkerIds.has(marker.id)) return null;
              const position = markerPositions.get(marker.id);
              if (!position) return null;
              const labelLayout = markerLabelLayouts.get(marker.id);
              const visual = getMarkerVisual(marker);
              const shortLabel = shortMarkerLabel(marker.label);

              return (
                <g
                  key={marker.id}
                  className={[
                    "map-marker",
                    denseMarkerLabels ? "map-marker--dense" : "",
                    selectedCode === marker.provinceCode
                      ? "map-marker--selected"
                      : "",
                  ].join(" ")}
                  transform={`translate(${position.x} ${position.y})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${marker.label}, ${marker.provinceName}, ${visual.label}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    const city = cities.find(
                      (candidate) =>
                        candidate.plateNumber === marker.provinceCode,
                    );
                    if (city && !placementProvinceCode) onSelect(city);
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    const city = cities.find(
                      (candidate) =>
                        candidate.plateNumber === marker.provinceCode,
                    );
                    if (city && !placementProvinceCode) onSelect(city);
                  }}
                  style={
                    { "--marker-color": marker.color } as React.CSSProperties
                  }
                >
                  <title>
                    {marker.label} · {marker.provinceName} · {visual.label}
                  </title>
                  {showLabels && labelLayout && (
                    <line
                      className="map-marker__leader"
                      x1="0"
                      y1="-23"
                      x2={labelLayout.anchorX - position.x}
                      y2={labelLayout.anchorY - position.y}
                    />
                  )}
                  <path
                    className="map-marker__pin"
                    d="M0,0 C-3,-6 -13,-12 -13,-23 A13,13 0 1,1 13,-23 C13,-12 3,-6 0,0 Z"
                  />
                  <circle className="map-marker__center" cy="-23" r="8.2" />
                  <g className="map-marker__symbol" transform="translate(-6 -29)">
                    <CatalogIcon
                      name={visual.icon}
                      size={12}
                      color={marker.color}
                      strokeWidth={2.4}
                    />
                  </g>
                  {showLabels && labelLayout && (
                    <g className="map-marker__label">
                      <rect
                        x={labelLayout.x - position.x}
                        y={labelLayout.y - position.y}
                        width={labelLayout.width}
                        height={labelLayout.height}
                        rx="6"
                      />
                      <rect
                        className="map-marker__label-accent"
                        x={labelLayout.x - position.x + 2}
                        y={labelLayout.y - position.y + 2}
                        width="4"
                        height={labelLayout.height - 4}
                        rx="2"
                      />
                      <text
                        x={
                          labelLayout.x -
                          position.x +
                          labelLayout.width / 2
                        }
                        y={labelLayout.y - position.y + 14}
                      >
                        {shortLabel}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {!exportMode && !readOnly && (
          <div className="drawing-toolbar" aria-label="Harita çizim araçları">
            {[
              { tool: "pen" as const, label: "Kalem", icon: Pencil },
              { tool: "arrow" as const, label: "Ok", icon: MoveRight },
              { tool: "circle" as const, label: "Daire", icon: Circle },
              { tool: "text" as const, label: "Metin", icon: Type },
            ].map(({ tool, label, icon: Icon }) => (
              <button
                key={tool}
                type="button"
                className={drawingTool === tool ? "is-active" : ""}
                title={label}
                aria-label={label}
                onClick={() =>
                  onDrawingToolChange?.(drawingTool === tool ? null : tool)
                }
              >
                <Icon size={15} />
              </button>
            ))}
            <span className="drawing-toolbar__divider" />
            <label title="Çizim rengi">
              <input
                type="color"
                value={drawingColor}
                onChange={(event) => onDrawingColorChange?.(event.target.value)}
              />
            </label>
            <button type="button" title="Son çizimi geri al" onClick={onUndoDrawing}>
              <Undo2 size={15} />
            </button>
            <button type="button" title="Bütün çizimleri sil" onClick={onClearDrawings}>
              <Eraser size={15} />
            </button>
          </div>
        )}

        {markerLegend.length > 0 && (
          <div
            className={[
              "marker-legend",
              legendOpen || exportMode
                ? "marker-legend--open"
                : "marker-legend--collapsed",
            ].join(" ")}
            aria-label="İşaret lejantı"
          >
            <button
              className="marker-legend__toggle"
              type="button"
              aria-expanded={legendOpen || exportMode}
              onClick={() => setLegendOpen((current) => !current)}
            >
              <strong>LEJANT</strong>
              {!exportMode && (
                <ChevronDown
                  className={legendOpen ? "is-open" : ""}
                  size={14}
                />
              )}
            </button>
            {(legendOpen || exportMode) && (
              <div>
                {markerLegend.map((group) => (
                  <span key={group.visual.id}>
                    <i style={{ backgroundColor: group.color }}>
                      <CatalogIcon
                        name={group.visual.icon}
                        size={11}
                        color="#fff"
                      />
                    </i>
                    {group.visual.label}
                    <small>{group.count}</small>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {!exportMode && (
          <>
            <div className="zoom-controls" aria-label="Yakınlaştırma araçları">
              <button
                type="button"
                title="Yakınlaştır"
                aria-label="Yakınlaştır"
                disabled={zoom >= 1.8}
                onClick={() => changeZoom(zoom + 0.2)}
              >
                <Plus size={17} />
              </button>
              <button
                type="button"
                title="Uzaklaştır"
                aria-label="Uzaklaştır"
                disabled={zoom <= 1}
                onClick={() => changeZoom(zoom - 0.2)}
              >
                <Minus size={17} />
              </button>
              <button
                type="button"
                title="Haritayı ekrana sığdır"
                aria-label="Haritayı ekrana sığdır"
                onClick={resetViewport}
              >
                <Scan size={17} />
              </button>
            </div>

            <div className="map-count">
              <strong>81</strong>
              <span>seçilebilir il</span>
            </div>
          </>
        )}
      </div>

      {!exportMode && (
        <p className="map-hint">
          <span className="map-hint__desktop">
            Bir ile dokun; yakınlaştırdığında haritayı fareyle sürükle.
          </span>
          <span className="map-hint__mobile">
            Yakınlaştırdığında haritayı parmağınla sürükleyerek hareket ettir.
          </span>
        </p>
      )}
    </section>
  );
}
