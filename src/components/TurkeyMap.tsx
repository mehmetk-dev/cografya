import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ChevronDown,
  Circle,
  Eraser,
  Minus,
  MousePointer2,
  MoveRight,
  Pencil,
  Plus,
  Scan,
  Trash2,
  Type,
  Undo2,
} from "lucide-react";
import { cities as mapCities } from "turkey-map-react/lib/data";
import { getArrowGeometry } from "../drawingGeometry";
import { createId } from "../id";
import { getMarkerVisual } from "../markerKinds";
import { RIVER_ROUTES } from "../riverRoutes";
import { CatalogIcon } from "./CatalogIcon";
import type {
  City,
  DrawingMode,
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
  provinceColorPreview?: {
    provinceCode: number;
    color: string;
  } | null;
  drawingTool?: DrawingMode | null;
  drawingColor?: string;
  drawingSize?: number;
  onDrawingToolChange?: (tool: DrawingMode | null) => void;
  onDrawingColorChange?: (color: string) => void;
  onDrawingSizeChange?: (size: number) => void;
  onAddDrawing?: (
    tool: DrawingTool,
    points: MapPoint[],
    text?: string,
    size?: number,
  ) => void;
  onUpdateMarker?: (marker: MapMarker) => void;
  onUpdateDrawing?: (drawing: MapDrawing) => void;
  onReplaceDrawings?: (
    removedIds: string[],
    replacements: MapDrawing[],
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

type DrawingGesture =
  | {
      kind: "move";
      pointerId: number;
      start: MapPoint;
      original: MapDrawing;
      current: MapDrawing;
      moved: boolean;
    }
  | {
      kind: "erase";
      pointerId: number;
      points: MapPoint[];
    };

type MarkerLabelGesture = {
  pointerId: number;
  marker: MapMarker;
  position: Point;
  width: number;
  height: number;
  start: MapPoint;
  originalOffset: MapPoint;
  currentOffset: MapPoint;
  moved: boolean;
};

const BASE_VIEWBOX = {
  x: 0,
  y: 80,
  width: 1050,
  height: 585,
};

const DENSE_MARKER_LABEL_THRESHOLD = 18;
const DRAWING_HIT_RADIUS = 12;
const ERASER_RADIUS = 14;
const DRAWING_SIZE_MIN = 1;
const DRAWING_SIZE_MAX = 3;
const DRAWING_SIZE_STEP = 0.5;
const DEFAULT_DRAWING_STROKE_WIDTH = 4;
const DEFAULT_DRAWING_TEXT_SIZE = 19;

const cities = [...(mapCities as City[])].sort(
  (left, right) => left.plateNumber - right.plateNumber,
);

export const turkeyCities = cities;

function shortMarkerLabel(label: string) {
  return label.length > 18 ? `${label.slice(0, 17)}…` : label;
}

function wrapManualNoteLabel(label: string, maxLineLength = 34) {
  const lines: string[] = [];
  let currentLine = "";

  label
    .trim()
    .split(/\s+/)
    .forEach((word) => {
      if (word.length > maxLineLength) {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = "";
        }
        for (let index = 0; index < word.length; index += maxLineLength) {
          const part = word.slice(index, index + maxLineLength);
          if (part.length === maxLineLength) {
            lines.push(part);
          } else {
            currentLine = part;
          }
        }
        return;
      }

      const candidate = currentLine ? `${currentLine} ${word}` : word;
      if (candidate.length <= maxLineLength) {
        currentLine = candidate;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

  if (currentLine) lines.push(currentLine);
  return lines.length > 0 ? lines : [label];
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

function isDrawingTool(mode: DrawingMode | null): mode is DrawingTool {
  return (
    mode === "pen" ||
    mode === "arrow" ||
    mode === "circle" ||
    mode === "text"
  );
}

function distanceToSegment(
  point: MapPoint,
  start: MapPoint,
  end: MapPoint,
) {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  if (deltaX === 0 && deltaY === 0) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }
  const ratio = Math.max(
    0,
    Math.min(
      1,
      ((point.x - start.x) * deltaX + (point.y - start.y) * deltaY) /
        (deltaX * deltaX + deltaY * deltaY),
    ),
  );
  return Math.hypot(
    point.x - (start.x + ratio * deltaX),
    point.y - (start.y + ratio * deltaY),
  );
}

function distanceToPolyline(point: MapPoint, points: MapPoint[]) {
  if (points.length === 0) return Number.POSITIVE_INFINITY;
  if (points.length === 1) {
    return Math.hypot(point.x - points[0].x, point.y - points[0].y);
  }
  let nearest = Number.POSITIVE_INFINITY;
  for (let index = 1; index < points.length; index += 1) {
    nearest = Math.min(
      nearest,
      distanceToSegment(point, points[index - 1], points[index]),
    );
  }
  return nearest;
}

function normalizeDrawingSize(size?: number) {
  if (!Number.isFinite(size)) return DRAWING_SIZE_MIN;
  return Math.max(
    DRAWING_SIZE_MIN,
    Math.min(DRAWING_SIZE_MAX, size as number),
  );
}

function getTextBounds(drawing: MapDrawing) {
  const origin = drawing.points[0];
  const size = normalizeDrawingSize(drawing.size);
  const width = Math.max(18 * size, (drawing.text?.length ?? 1) * 11 * size);
  return {
    x: origin.x - 3 * size,
    y: origin.y - 23 * size,
    width,
    height: 30 * size,
  };
}

function drawingHitDistance(drawing: MapDrawing, point: MapPoint) {
  if (drawing.points.length === 0) return Number.POSITIVE_INFINITY;
  const first = drawing.points[0];
  const last = drawing.points[drawing.points.length - 1];

  if (drawing.tool === "text") {
    const bounds = getTextBounds(drawing);
    return point.x >= bounds.x &&
      point.x <= bounds.x + bounds.width &&
      point.y >= bounds.y &&
      point.y <= bounds.y + bounds.height
      ? 0
      : Number.POSITIVE_INFINITY;
  }
  if (drawing.tool === "circle") {
    const radius = Math.hypot(last.x - first.x, last.y - first.y);
    return Math.abs(Math.hypot(point.x - first.x, point.y - first.y) - radius);
  }
  if (drawing.tool === "arrow") {
    const { tip, baseCenter, left, right } = getArrowGeometry(first, last);
    return Math.min(
      distanceToSegment(point, first, baseCenter),
      distanceToSegment(point, left, tip),
      distanceToSegment(point, tip, right),
      distanceToSegment(point, right, left),
    );
  }
  return distanceToPolyline(point, drawing.points);
}

function findDrawingAt(
  drawings: MapDrawing[],
  point: MapPoint,
  radius: number,
) {
  return [...drawings]
    .reverse()
    .find((drawing) => drawingHitDistance(drawing, point) <= radius);
}

function translateDrawing(
  drawing: MapDrawing,
  deltaX: number,
  deltaY: number,
): MapDrawing {
  return {
    ...drawing,
    points: drawing.points.map((point) => ({
      x: point.x + deltaX,
      y: point.y + deltaY,
    })),
  };
}

function drawingBounds(drawing: MapDrawing) {
  if (drawing.tool === "text") return getTextBounds(drawing);
  const first = drawing.points[0];
  const last = drawing.points[drawing.points.length - 1];
  if (drawing.tool === "circle") {
    const radius = Math.hypot(last.x - first.x, last.y - first.y);
    return {
      x: first.x - radius,
      y: first.y - radius,
      width: radius * 2,
      height: radius * 2,
    };
  }
  const points =
    drawing.tool === "arrow"
      ? [
          ...drawing.points,
          ...Object.values(getArrowGeometry(first, last)),
        ]
      : drawing.points;
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

function densifyPolyline(points: MapPoint[], maxStep = 4) {
  if (points.length < 2) return [...points];
  const result: MapPoint[] = [points[0]];
  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1];
    const end = points[index];
    const steps = Math.max(
      1,
      Math.ceil(Math.hypot(end.x - start.x, end.y - start.y) / maxStep),
    );
    for (let step = 1; step <= steps; step += 1) {
      result.push({
        x: start.x + ((end.x - start.x) * step) / steps,
        y: start.y + ((end.y - start.y) * step) / steps,
      });
    }
  }
  return result;
}

function drawingPolylines(drawing: MapDrawing) {
  if (drawing.points.length === 0 || drawing.tool === "text") return [];
  const first = drawing.points[0];
  const last = drawing.points[drawing.points.length - 1];
  if (drawing.tool === "circle") {
    const radius = Math.hypot(last.x - first.x, last.y - first.y);
    return [
      Array.from({ length: 97 }, (_, index) => {
        const angle = (index / 96) * Math.PI * 2;
        return {
          x: first.x + Math.cos(angle) * radius,
          y: first.y + Math.sin(angle) * radius,
        };
      }),
    ];
  }
  if (drawing.tool === "arrow") {
    const { tip, baseCenter, left, right } = getArrowGeometry(first, last);
    return [[first, baseCenter], [left, tip, right, left]];
  }
  return [drawing.points];
}

function splitPolylineByEraser(
  points: MapPoint[],
  eraserPath: MapPoint[],
  radius: number,
) {
  const pieces: MapPoint[][] = [];
  let current: MapPoint[] = [];
  densifyPolyline(points).forEach((point) => {
    if (distanceToPolyline(point, eraserPath) <= radius) {
      if (current.length >= 2) pieces.push(current);
      current = [];
      return;
    }
    current.push(point);
  });
  if (current.length >= 2) pieces.push(current);
  return pieces;
}

function eraseDrawings(
  drawings: MapDrawing[],
  eraserPath: MapPoint[],
  radius: number,
) {
  const removedIds: string[] = [];
  const replacements: MapDrawing[] = [];

  drawings.forEach((drawing) => {
    if (drawing.tool === "text") {
      const touched = eraserPath.some(
        (point) => drawingHitDistance(drawing, point) <= radius,
      );
      if (touched) removedIds.push(drawing.id);
      return;
    }

    const polylines = drawingPolylines(drawing);
    const touched = polylines.some((polyline) =>
      densifyPolyline(polyline).some(
        (point) => distanceToPolyline(point, eraserPath) <= radius,
      ),
    );
    if (!touched) return;

    removedIds.push(drawing.id);
    const pieces = polylines.flatMap((polyline) =>
      splitPolylineByEraser(polyline, eraserPath, radius),
    );
    pieces.forEach((points, index) => {
      replacements.push({
        ...drawing,
        id: index === 0 ? drawing.id : createId(),
        tool: "pen",
        points,
        text: undefined,
      });
    });
  });

  return { removedIds, replacements };
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
  provinceColorPreview = null,
  drawingTool = null,
  drawingColor = "#d05f64",
  drawingSize = 1,
  onDrawingToolChange,
  onDrawingColorChange,
  onDrawingSizeChange,
  onAddDrawing,
  onUpdateMarker,
  onUpdateDrawing,
  onReplaceDrawings,
  onUndoDrawing,
  onClearDrawings,
  exportMode = false,
}: TurkeyMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const panGestureRef = useRef<PanGesture | null>(null);
  const drawingGestureRef = useRef<DrawingGesture | null>(null);
  const markerLabelGestureRef = useRef<MarkerLabelGesture | null>(null);
  const draftDrawingRef = useRef<MapPoint[]>([]);
  const suppressMapClickRef = useRef(false);
  const riverClipId = `river-land-${useId().replaceAll(":", "")}`;
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [centers, setCenters] = useState<Record<number, Point>>({});
  const [provinceSizes, setProvinceSizes] = useState<
    Record<number, { width: number; height: number }>
  >({});
  const [draftDrawing, setDraftDrawing] = useState<MapPoint[]>([]);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(
    null,
  );
  const [movingDrawing, setMovingDrawing] = useState<MapDrawing | null>(null);
  const [eraserTrail, setEraserTrail] = useState<MapPoint[]>([]);
  const [movingMarkerLabel, setMovingMarkerLabel] = useState<{
    markerId: string;
    offset: MapPoint;
  } | null>(null);
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

  useEffect(() => {
    if (
      selectedDrawingId &&
      !drawings.some((drawing) => drawing.id === selectedDrawingId)
    ) {
      setSelectedDrawingId(null);
      setMovingDrawing(null);
    }
  }, [drawings, selectedDrawingId]);

  useEffect(() => {
    if (drawingTool !== "select") {
      setSelectedDrawingId(null);
      setMovingDrawing(null);
    }
    if (!isDrawingTool(drawingTool)) {
      draftDrawingRef.current = [];
      setDraftDrawing([]);
    }
  }, [drawingTool]);

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
    () => {
      const seenRouteIds = new Set<string>();

      return markers.flatMap((marker) => {
        if (marker.kind !== "river" || !marker.presetItemId) return [];
        const route = RIVER_ROUTES[marker.presetItemId];
        if (!route || seenRouteIds.has(route.id)) return [];
        seenRouteIds.add(route.id);
        return [{ marker, route }];
      });
    },
    [markers],
  );
  const routedRiverMarkerIds = useMemo(() => {
    const routedLabels = new Set(
      routedRivers.map(({ marker }) => marker.label),
    );

    return new Set(
      markers
        .filter(
          (marker) =>
            marker.kind === "river" && routedLabels.has(marker.label),
        )
        .map((marker) => marker.id),
    );
  }, [markers, routedRivers]);
  const visibleRiverLabelCounts = useMemo(() => {
    const counts = new Map<string, number>();
    const addLabel = (label: string) => {
      counts.set(label, (counts.get(label) ?? 0) + 1);
    };

    routedRivers.forEach(({ marker, route }) => {
      addLabel(marker.label);
      route.branches.forEach((branch) => addLabel(branch.name));
    });

    return counts;
  }, [routedRivers]);
  const denseMarkerLabels =
    markers.length - routedRiverMarkerIds.size > DENSE_MARKER_LABEL_THRESHOLD;
  const displayedMarkers = useMemo(() => {
    const pointMarkers = markers.filter(
      (marker) => !routedRiverMarkerIds.has(marker.id),
    );
    if (!denseMarkerLabels || zoom >= 1.35) {
      return pointMarkers.map((marker) => ({ marker, count: 1 }));
    }

    const clusters = new Map<
      string,
      { marker: MapMarker; count: number }
    >();
    pointMarkers.forEach((marker) => {
      const point = marker.anchoredToProvince
        ? centers[marker.provinceCode]
        : { x: marker.x, y: marker.y };
      const clusterKey = point
        ? `area-${Math.round(point.x / 115)}-${Math.round(point.y / 95)}`
        : marker.id;
      const current = clusters.get(clusterKey);
      if (current) {
        current.count += 1;
      } else {
        clusters.set(clusterKey, { marker, count: 1 });
      }
    });
    return [...clusters.values()];
  }, [
    denseMarkerLabels,
    centers,
    markers,
    routedRiverMarkerIds,
    zoom,
  ]);
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
      const leftHasCustomPosition =
        left.labelOffset || movingMarkerLabel?.markerId === left.id;
      const rightHasCustomPosition =
        right.labelOffset || movingMarkerLabel?.markerId === right.id;
      if (Boolean(leftHasCustomPosition) !== Boolean(rightHasCustomPosition)) {
        return leftHasCustomPosition ? -1 : 1;
      }
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
      const customOffset =
        movingMarkerLabel?.markerId === marker.id
          ? movingMarkerLabel.offset
          : marker.labelOffset;

      if (customOffset) {
        const x = Math.max(
          BASE_VIEWBOX.x + 8,
          Math.min(
            BASE_VIEWBOX.x + BASE_VIEWBOX.width - width - 8,
            position.x + customOffset.x,
          ),
        );
        const y = Math.max(
          BASE_VIEWBOX.y + 8,
          Math.min(
            BASE_VIEWBOX.y + BASE_VIEWBOX.height - height - 8,
            position.y + customOffset.y,
          ),
        );
        const anchorX = Math.min(x + width, Math.max(x, position.x));
        const anchorY = Math.min(
          y + height,
          Math.max(y, position.y - 23),
        );
        const layout = { x, y, width, height, anchorX, anchorY };
        layouts.set(marker.id, layout);
        placed.push(layout);
        return;
      }

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
  }, [markers, markerPositions, movingMarkerLabel]);

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
    event:
      | React.PointerEvent<SVGSVGElement>
      | React.PointerEvent<SVGGElement>
      | React.MouseEvent<SVGGElement>,
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

  const startMarkerLabelMove = (
    event: React.PointerEvent<SVGGElement>,
    marker: MapMarker,
    position: Point,
    layout: LabelLayout,
  ) => {
    if (
      drawingTool ||
      placementProvinceCode ||
      !onUpdateMarker ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }
    const point = eventToPoint(event);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const originalOffset = {
      x: layout.x - position.x,
      y: layout.y - position.y,
    };
    markerLabelGestureRef.current = {
      pointerId: event.pointerId,
      marker,
      position,
      width: layout.width,
      height: layout.height,
      start: point,
      originalOffset,
      currentOffset: originalOffset,
      moved: false,
    };
    setMovingMarkerLabel({
      markerId: marker.id,
      offset: originalOffset,
    });
  };

  const moveMarkerLabel = (event: React.PointerEvent<SVGGElement>) => {
    const gesture = markerLabelGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const point = eventToPoint(event);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    const deltaX = point.x - gesture.start.x;
    const deltaY = point.y - gesture.start.y;
    const absoluteX = Math.max(
      BASE_VIEWBOX.x + 8,
      Math.min(
        BASE_VIEWBOX.x + BASE_VIEWBOX.width - gesture.width - 8,
        gesture.position.x + gesture.originalOffset.x + deltaX,
      ),
    );
    const absoluteY = Math.max(
      BASE_VIEWBOX.y + 8,
      Math.min(
        BASE_VIEWBOX.y + BASE_VIEWBOX.height - gesture.height - 8,
        gesture.position.y + gesture.originalOffset.y + deltaY,
      ),
    );
    const offset = {
      x: absoluteX - gesture.position.x,
      y: absoluteY - gesture.position.y,
    };
    gesture.currentOffset = offset;
    gesture.moved =
      gesture.moved || Math.hypot(deltaX, deltaY) > 1;
    setMovingMarkerLabel({
      markerId: gesture.marker.id,
      offset,
    });
  };

  const finishMarkerLabelMove = (
    event: React.PointerEvent<SVGGElement>,
    cancelled = false,
  ) => {
    const gesture = markerLabelGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!cancelled && gesture.moved) {
      onUpdateMarker?.({
        ...gesture.marker,
        labelOffset: gesture.currentOffset,
      });
    }
    markerLabelGestureRef.current = null;
    setMovingMarkerLabel(null);
  };

  const resetMarkerLabelPosition = (
    event: React.MouseEvent<SVGGElement>,
    marker: MapMarker,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!marker.labelOffset || !onUpdateMarker) return;
    const resetMarker = { ...marker };
    delete resetMarker.labelOffset;
    onUpdateMarker(resetMarker);
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
    drawing: Pick<
      MapDrawing,
      "id" | "tool" | "color" | "size" | "points" | "text"
    >,
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
          style={{
            strokeWidth:
              DEFAULT_DRAWING_STROKE_WIDTH *
              normalizeDrawingSize(drawing.size),
          }}
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
      const { tip, baseCenter, left, right } = getArrowGeometry(first, last);
      return (
        <g key={drawing.id}>
          <line
            {...common}
            x1={first.x}
            y1={first.y}
            x2={baseCenter.x}
            y2={baseCenter.y}
          />
          <path
            {...common}
            d={`M ${left.x} ${left.y} L ${tip.x} ${tip.y} L ${right.x} ${right.y} Z`}
            fill={drawing.color}
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
        style={{
          fontSize:
            DEFAULT_DRAWING_TEXT_SIZE * normalizeDrawingSize(drawing.size),
          strokeWidth:
            DEFAULT_DRAWING_STROKE_WIDTH *
            normalizeDrawingSize(drawing.size),
        }}
      >
        {drawing.text}
      </text>
    );
  };

  const displayedDrawings = drawings.map((drawing) =>
    movingDrawing?.id === drawing.id ? movingDrawing : drawing,
  );
  const selectedDrawing = selectedDrawingId
    ? displayedDrawings.find((drawing) => drawing.id === selectedDrawingId)
    : undefined;
  const selectedDrawingBounds = selectedDrawing
    ? drawingBounds(selectedDrawing)
    : undefined;

  return (
    <section
      className={`map-stage ${placementProvinceCode ? "map-stage--placing" : ""}`}
      aria-label="Etkileşimli Türkiye haritası"
    >
      {!exportMode && (
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
      )}

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
            drawingTool === "select" ? "turkey-map--selecting-drawing" : "",
            drawingTool === "eraser" ? "turkey-map--erasing" : "",
            isDrawingTool(drawingTool) ? "turkey-map--drawing" : "",
          ].join(" ")}
          viewBox={`${viewX} ${viewY} ${viewWidth} ${viewHeight}`}
          role="group"
          aria-label="81 ilden oluşan Türkiye haritası"
          onPointerDown={(event) => {
            if (exportMode) return;
            if (drawingTool) {
              if (event.pointerType === "mouse" && event.button !== 0) return;
              const point = eventToPoint(event);
              if (!point) return;
              if (drawingTool === "select") {
                const drawing = findDrawingAt(
                  drawings,
                  point,
                  DRAWING_HIT_RADIUS / zoom,
                );
                setSelectedDrawingId(drawing?.id ?? null);
                setMovingDrawing(drawing ?? null);
                if (!drawing) return;
                event.currentTarget.setPointerCapture(event.pointerId);
                drawingGestureRef.current = {
                  kind: "move",
                  pointerId: event.pointerId,
                  start: point,
                  original: drawing,
                  current: drawing,
                  moved: false,
                };
                return;
              }
              if (drawingTool === "eraser") {
                event.currentTarget.setPointerCapture(event.pointerId);
                drawingGestureRef.current = {
                  kind: "erase",
                  pointerId: event.pointerId,
                  points: [point],
                };
                setEraserTrail([point]);
                return;
              }
              if (drawingTool === "text") {
                const text = window.prompt("Haritaya yazılacak metin:");
                if (text?.trim()) {
                  onAddDrawing?.(
                    "text",
                    [point],
                    text.trim(),
                    normalizeDrawingSize(drawingSize),
                  );
                }
                return;
              }
              event.currentTarget.setPointerCapture(event.pointerId);
              draftDrawingRef.current = [point];
              setDraftDrawing(draftDrawingRef.current);
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
            const drawingGesture = drawingGestureRef.current;
            if (
              drawingGesture &&
              drawingGesture.pointerId === event.pointerId
            ) {
              const point = eventToPoint(event);
              if (!point) return;
              event.preventDefault();
              if (drawingGesture.kind === "move") {
                const deltaX = point.x - drawingGesture.start.x;
                const deltaY = point.y - drawingGesture.start.y;
                const current = translateDrawing(
                  drawingGesture.original,
                  deltaX,
                  deltaY,
                );
                drawingGesture.current = current;
                drawingGesture.moved =
                  drawingGesture.moved || Math.hypot(deltaX, deltaY) > 1;
                setMovingDrawing(current);
              } else {
                const previous =
                  drawingGesture.points[drawingGesture.points.length - 1];
                if (Math.hypot(point.x - previous.x, point.y - previous.y) > 1) {
                  drawingGesture.points.push(point);
                  setEraserTrail([...drawingGesture.points]);
                }
              }
              return;
            }

            if (
              isDrawingTool(drawingTool) &&
              draftDrawingRef.current.length > 0
            ) {
              const point = eventToPoint(event);
              if (!point) return;
              event.preventDefault();
              const next =
                drawingTool === "pen"
                  ? [...draftDrawingRef.current, point]
                  : [draftDrawingRef.current[0], point];
              draftDrawingRef.current = next;
              setDraftDrawing(next);
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
            const drawingGesture = drawingGestureRef.current;
            if (
              drawingGesture &&
              drawingGesture.pointerId === event.pointerId
            ) {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
              if (drawingGesture.kind === "move") {
                if (drawingGesture.moved) {
                  onUpdateDrawing?.(drawingGesture.current);
                }
                setMovingDrawing(null);
              } else {
                const finalPoint = eventToPoint(event);
                if (finalPoint) drawingGesture.points.push(finalPoint);
                const result = eraseDrawings(
                  drawings,
                  drawingGesture.points,
                  ERASER_RADIUS / zoom,
                );
                if (result.removedIds.length > 0) {
                  onReplaceDrawings?.(
                    result.removedIds,
                    result.replacements,
                  );
                }
                setEraserTrail([]);
              }
              drawingGestureRef.current = null;
              return;
            }

            if (
              isDrawingTool(drawingTool) &&
              draftDrawingRef.current.length > 0
            ) {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
              const finalPoint = eventToPoint(event);
              let completed = draftDrawingRef.current;
              const lastPoint = completed[completed.length - 1];
              if (
                finalPoint &&
                Math.hypot(
                  finalPoint.x - lastPoint.x,
                  finalPoint.y - lastPoint.y,
                ) > 1
              ) {
                completed =
                  drawingTool === "pen"
                    ? [...completed, finalPoint]
                    : [completed[0], finalPoint];
              }
              if (completed.length > 1) {
                onAddDrawing?.(
                  drawingTool,
                  completed,
                  undefined,
                  normalizeDrawingSize(drawingSize),
                );
              }
              draftDrawingRef.current = [];
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
            if (drawingGestureRef.current?.pointerId === event.pointerId) {
              drawingGestureRef.current = null;
              setMovingDrawing(null);
              setEraserTrail([]);
            }
            if (
              panGestureRef.current?.pointerId === event.pointerId
            ) {
              panGestureRef.current = null;
              suppressMapClickRef.current = false;
              setIsPanning(false);
            }
            draftDrawingRef.current = [];
            setDraftDrawing([]);
          }}
          onClickCapture={(event) => {
            if (!suppressMapClickRef.current) return;
            event.preventDefault();
            event.stopPropagation();
            suppressMapClickRef.current = false;
          }}
        >
          <defs>
            <clipPath id={riverClipId}>
              {cities.map((city) => (
                <path key={city.id} d={city.path} />
              ))}
            </clipPath>
          </defs>

          <g className="province-layer">
            {cities.map((city) => {
              const record = recordsByCode.get(city.plateNumber);
              const isSelected = selectedCode === city.plateNumber;
              const previewColor =
                provinceColorPreview?.provinceCode === city.plateNumber
                  ? provinceColorPreview.color
                  : undefined;

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
                      "--record-color":
                        previewColor || record?.color || themeColor,
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
                  <g clipPath={`url(#${riverClipId})`}>
                    <path
                      className="river-route__hit"
                      d={smoothPath(route.points)}
                    />
                    <path
                      className="river-route__main"
                      d={smoothPath(route.points)}
                    />
                    {route.branches.map((branch) => (
                      <path
                        key={branch.name}
                        className="river-route__branch"
                        d={smoothPath(branch.points)}
                      />
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
                  </g>
                  {route.branches.map((branch) => (
                    <g key={branch.name}>
                      {showLabels && branch.labelAt && (
                        <text
                          className="river-route__branch-label"
                          x={branch.labelAt.x}
                          y={branch.labelAt.y}
                        >
                          {(visibleRiverLabelCounts.get(branch.name) ?? 0) > 1
                            ? `${branch.name} · ${marker.label}`
                            : branch.name}
                        </text>
                      )}
                    </g>
                  ))}
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
            {displayedDrawings.map((drawing) => renderDrawing(drawing))}
            {selectedDrawingBounds && (
              <rect
                className="drawing-selection"
                x={selectedDrawingBounds.x - 8}
                y={selectedDrawingBounds.y - 8}
                width={Math.max(16, selectedDrawingBounds.width + 16)}
                height={Math.max(16, selectedDrawingBounds.height + 16)}
                rx="7"
              />
            )}
            {isDrawingTool(drawingTool) &&
              draftDrawing.length > 0 &&
              renderDrawing(
                {
                  id: "draft",
                  tool: drawingTool,
                  color: drawingColor,
                  size: normalizeDrawingSize(drawingSize),
                  points: draftDrawing,
                },
                true,
              )}
            {drawingTool === "eraser" && eraserTrail.length > 0 && (
              <>
                <path
                  className="drawing-eraser-trail"
                  d={drawingPath(eraserTrail)}
                />
                <circle
                  className="drawing-eraser-cursor"
                  cx={eraserTrail[eraserTrail.length - 1].x}
                  cy={eraserTrail[eraserTrail.length - 1].y}
                  r={ERASER_RADIUS / zoom}
                />
              </>
            )}
          </g>

          {showLabels && (
            <g className="annotation-layer" aria-hidden="true">
              {records.map((record) => {
                const center = centers[record.provinceCode];
                const label = (record.items[0]?.text || record.title).trim();
                if (!center || !label) return null;

                const labelLines = wrapManualNoteLabel(label);
                const longestLine = Math.max(
                  ...labelLines.map((line) => line.length),
                );
                const width = Math.max(42, longestLine * 6.5 + 18);
                const height = 12 + labelLines.length * 10;
                const labelCenterX = Math.min(
                  BASE_VIEWBOX.x + BASE_VIEWBOX.width - width / 2 - 8,
                  Math.max(
                    BASE_VIEWBOX.x + width / 2 + 8,
                    center.x,
                  ),
                );
                const localLabelX = labelCenterX - center.x;

                return (
                  <g
                    key={record.id}
                    className="map-annotation"
                    transform={`translate(${center.x} ${center.y})`}
                  >
                    <circle r="4.5" fill={record.color || themeColor} />
                    <line
                      x1="0"
                      y1="4"
                      x2={localLabelX}
                      y2="13"
                    />
                    <rect
                      x={localLabelX - width / 2}
                      y="12"
                      width={width}
                      height={height}
                      rx="7"
                    />
                    <text x={localLabelX} y="27">
                      {labelLines.map((line, index) => (
                        <tspan
                          key={`${line}-${index}`}
                          x={localLabelX}
                          dy={index === 0 ? 0 : 10}
                        >
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          <g className="marker-layer">
            {displayedMarkers.map(({ marker, count }) => {
              const position = markerPositions.get(marker.id);
              if (!position) return null;
              const labelLayout = markerLabelLayouts.get(marker.id);
              const visual = getMarkerVisual(marker);
              const shortLabel = shortMarkerLabel(marker.label);
              const labelInteractive =
                count === 1 &&
                Boolean(onUpdateMarker) &&
                !drawingTool &&
                !placementProvinceCode;

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
                  aria-label={
                    count > 1
                      ? `${marker.provinceName}, ${count} işaret`
                      : `${marker.label}, ${marker.provinceName}, ${visual.label}`
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    if (count > 1) {
                      const nextZoom = Math.max(1.4, zoom + 0.4);
                      setZoom(nextZoom);
                      setPan(
                        clampPan(
                          {
                            x:
                              position.x -
                              (BASE_VIEWBOX.x + BASE_VIEWBOX.width / 2),
                            y:
                              position.y -
                              (BASE_VIEWBOX.y + BASE_VIEWBOX.height / 2),
                          },
                          nextZoom,
                        ),
                      );
                      return;
                    }
                    const city = cities.find(
                      (candidate) =>
                        candidate.plateNumber === marker.provinceCode,
                    );
                    if (city && !placementProvinceCode) onSelect(city);
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    if (count > 1) {
                      const nextZoom = Math.max(1.4, zoom + 0.4);
                      setZoom(nextZoom);
                      setPan(
                        clampPan(
                          {
                            x:
                              position.x -
                              (BASE_VIEWBOX.x + BASE_VIEWBOX.width / 2),
                            y:
                              position.y -
                              (BASE_VIEWBOX.y + BASE_VIEWBOX.height / 2),
                          },
                          nextZoom,
                        ),
                      );
                      return;
                    }
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
                    {count > 1
                      ? `${marker.provinceName} · ${count} işaret · Yakınlaştırınca ayrılır`
                      : `${marker.label} · ${marker.provinceName} · ${visual.label}`}
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
                  {count > 1 && (
                    <g
                      className="map-marker__cluster-count"
                      transform="translate(10 -35)"
                      aria-hidden="true"
                    >
                      <circle r="11" />
                      <text y="3">{count}</text>
                    </g>
                  )}
                  {showLabels && labelLayout && (
                    <g
                      className={[
                        "map-marker__label",
                        labelInteractive
                          ? "map-marker__label--interactive"
                          : "",
                        movingMarkerLabel?.markerId === marker.id
                          ? "is-moving"
                          : "",
                      ].join(" ")}
                      onClick={(event) => event.stopPropagation()}
                      onDoubleClick={(event) =>
                        resetMarkerLabelPosition(event, marker)
                      }
                      onPointerDown={(event) =>
                        startMarkerLabelMove(
                          event,
                          marker,
                          position,
                          labelLayout,
                        )
                      }
                      onPointerMove={moveMarkerLabel}
                      onPointerUp={(event) =>
                        finishMarkerLabelMove(event)
                      }
                      onPointerCancel={(event) =>
                        finishMarkerLabelMove(event, true)
                      }
                    >
                      {labelInteractive && (
                        <title>
                          Sürükleyerek taşı
                          {marker.labelOffset
                            ? " · Çift tıklayarak otomatik konuma döndür"
                            : ""}
                        </title>
                      )}
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
              {
                tool: "select" as const,
                label: "Seç ve taşı",
                icon: MousePointer2,
              },
              { tool: "pen" as const, label: "Kalem", icon: Pencil },
              { tool: "arrow" as const, label: "Ok", icon: MoveRight },
              { tool: "circle" as const, label: "Daire", icon: Circle },
              { tool: "text" as const, label: "Metin", icon: Type },
              {
                tool: "eraser" as const,
                label: "Bölgesel silgi",
                icon: Eraser,
              },
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
            {(drawingTool === "pen" || drawingTool === "text") && (
              <>
                <div
                  className="drawing-toolbar__size"
                  title={
                    drawingTool === "pen" ? "Kalem kalınlığı" : "Yazı boyutu"
                  }
                >
                  <button
                    type="button"
                    aria-label={
                      drawingTool === "pen" ? "Kalemi incelt" : "Yazıyı küçült"
                    }
                    disabled={normalizeDrawingSize(drawingSize) <= DRAWING_SIZE_MIN}
                    onClick={() =>
                      onDrawingSizeChange?.(
                        Math.max(
                          DRAWING_SIZE_MIN,
                          normalizeDrawingSize(drawingSize) - DRAWING_SIZE_STEP,
                        ),
                      )
                    }
                  >
                    <Minus size={14} />
                  </button>
                  <output
                    aria-label={
                      drawingTool === "pen"
                        ? "Seçili kalem kalınlığı"
                        : "Seçili yazı boyutu"
                    }
                  >
                    {normalizeDrawingSize(drawingSize)}×
                  </output>
                  <button
                    type="button"
                    aria-label={
                      drawingTool === "pen"
                        ? "Kalemi kalınlaştır"
                        : "Yazıyı büyüt"
                    }
                    disabled={normalizeDrawingSize(drawingSize) >= DRAWING_SIZE_MAX}
                    onClick={() =>
                      onDrawingSizeChange?.(
                        Math.min(
                          DRAWING_SIZE_MAX,
                          normalizeDrawingSize(drawingSize) + DRAWING_SIZE_STEP,
                        ),
                      )
                    }
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="drawing-toolbar__divider" />
              </>
            )}
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
              <Trash2 size={15} />
            </button>
          </div>
        )}

        {!exportMode && markerLegend.length > 0 && (
          <div
            className={[
              "marker-legend",
              legendOpen ? "marker-legend--open" : "marker-legend--collapsed",
            ].join(" ")}
            aria-label="İşaret lejantı"
          >
            <button
              className="marker-legend__toggle"
              type="button"
              aria-expanded={legendOpen}
              onClick={() => setLegendOpen((current) => !current)}
            >
              <strong>LEJANT</strong>
              <ChevronDown
                className={legendOpen ? "is-open" : ""}
                size={14}
              />
            </button>
            {legendOpen && (
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
