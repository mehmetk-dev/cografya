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
  Maximize2,
  Minus,
  Minimize2,
  MousePointer2,
  MoveRight,
  Paintbrush,
  Pencil,
  Plus,
  Trash2,
  Type,
  Undo2,
} from "lucide-react";
import { cities as mapCities } from "turkey-map-react/lib/data";
import { getArrowGeometry } from "../drawingGeometry";
import { createId } from "../id";
import { getMarkerVisual } from "../markerKinds";
import { MOUNTAIN_ATLAS_LAYOUTS } from "../mountainAtlas";
import { applyProvinceFill } from "../regionPainting";
import { RIVER_ROUTES } from "../riverRoutes";
import { CatalogIcon } from "./CatalogIcon";
import {
  formationLabel,
  isMountainFormation,
  MountainAtlasLayer,
  MountainGlyph,
  type MountainFormation,
} from "./MountainAtlasLayer";
import {
  RegionPainterPanel,
  type RegionPainterMode,
} from "./RegionPainterPanel";
import type {
  City,
  DrawingMode,
  DrawingTool,
  MapDrawing,
  MapMarker,
  MapPoint,
  MapPresentation,
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
  presentation?: MapPresentation;
  readOnly?: boolean;
  mountainToolsEnabled?: boolean;
  onSelect: (city: City) => void;
  placementProvinceCode?: number | null;
  onPlaceMarker?: (city: City, point: Point) => void;
  onPlacementMismatch?: (city: City) => void;
  matchingProvinceCodes?: Set<number> | null;
  provinceColorPreview?: {
    provinceCode: number;
    color: string;
  } | null;
  provinceFills?: Record<string, string>;
  onProvinceFillsChange?: (fills: Record<string, string>) => void;
  drawingTool?: DrawingMode | null;
  drawingColor?: string;
  drawingSize?: number;
  drawingFilled?: boolean;
  onDrawingToolChange?: (tool: DrawingMode | null) => void;
  onDrawingColorChange?: (color: string) => void;
  onDrawingSizeChange?: (size: number) => void;
  onDrawingFilledChange?: (filled: boolean) => void;
  onAddDrawing?: (
    tool: DrawingTool,
    points: MapPoint[],
    text?: string,
    size?: number,
    filled?: boolean,
  ) => void;
  onUpdateRecord?: (record: ProvinceRecord) => void;
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

type RegionPaintingGesture = {
  pointerId: number;
  touchedProvinceCodes: Set<number>;
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

type DrawingTextResizeGesture = {
  pointerId: number;
  original: MapDrawing;
  current: MapDrawing;
  start: MapPoint;
  bounds: Pick<LabelLayout, "x" | "y" | "width" | "height">;
  initialSize: number;
  rotation: number;
  moved: boolean;
};

type DrawingTextRotateGesture = {
  pointerId: number;
  original: MapDrawing;
  current: MapDrawing;
  center: Point;
  startAngle: number;
  initialRotation: number;
  moved: boolean;
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

type MarkerMoveGesture = {
  pointerId: number;
  marker: MapMarker;
  start: MapPoint;
  originalPosition: Point;
  currentPosition: Point;
  moved: boolean;
};

type MarkerLabelResizeGesture = {
  pointerId: number;
  marker: MapMarker;
  position: Point;
  start: MapPoint;
  offset: MapPoint;
  baseWidth: number;
  baseHeight: number;
  initialScale: number;
  currentScale: number;
  rotation: number;
  moved: boolean;
};

type MarkerLabelRotateGesture = {
  pointerId: number;
  marker: MapMarker;
  offset: MapPoint;
  center: Point;
  startAngle: number;
  initialRotation: number;
  currentRotation: number;
  moved: boolean;
};

type ProvinceLabelGesture = {
  pointerId: number;
  record: ProvinceRecord;
  center: Point;
  width: number;
  height: number;
  start: MapPoint;
  originalOffset: MapPoint;
  currentOffset: MapPoint;
  moved: boolean;
};

type ProvinceLabelResizeGesture = {
  pointerId: number;
  record: ProvinceRecord;
  center: Point;
  start: MapPoint;
  offset: MapPoint;
  baseWidth: number;
  baseHeight: number;
  initialScale: number;
  currentScale: number;
  rotation: number;
  moved: boolean;
};

type ProvinceLabelRotateGesture = {
  pointerId: number;
  record: ProvinceRecord;
  offset: MapPoint;
  center: Point;
  startAngle: number;
  initialRotation: number;
  currentRotation: number;
  moved: boolean;
};

type WebkitFullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type WebkitFullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

const BASE_VIEWBOX = {
  // Türkiye sınırlarının iki yanında sürüklenebilir etiketler için kalıcı
  // not cepleri bırakılır. Merkez 525'te sabit kaldığı için harita ortalanır.
  x: -115,
  y: 80,
  width: 1280,
  height: 585,
};

const MOBILE_VIEWBOX = {
  // Dar ekranda masaüstündeki geniş not ceplerinin tamamını göstermek,
  // Türkiye haritasını gereksiz yere küçültüyordu. Mobilde cepleri koruyup
  // daha sıkı bir çerçeve kullanıyoruz.
  x: -35,
  y: 80,
  width: 1120,
  height: 585,
};

const MOUNTAIN_ATLAS_VIEWBOX = {
  x: 0,
  y: 96,
  width: 1050,
  height: 510,
};

const LABEL_SCALE_MIN = 0.7;
const LABEL_SCALE_MAX = 1.8;
const LABEL_RESIZE_HANDLE_SIZE = 8;
const LABEL_ROTATE_HANDLE_DISTANCE = 14;

function normalizeLabelScale(value?: number) {
  return Math.max(
    LABEL_SCALE_MIN,
    Math.min(LABEL_SCALE_MAX, value ?? 1),
  );
}

function normalizeLabelRotation(value?: number) {
  const rotation = value ?? 0;
  return ((rotation + 180) % 360 + 360) % 360 - 180;
}

function pointAngle(center: Point, point: Point) {
  return (Math.atan2(point.y - center.y, point.x - center.x) * 180) / Math.PI;
}

function resizedLabelScale({
  initialScale,
  deltaX,
  deltaY,
  baseWidth,
  baseHeight,
  absoluteX,
  absoluteY,
  bounds,
}: {
  initialScale: number;
  deltaX: number;
  deltaY: number;
  baseWidth: number;
  baseHeight: number;
  absoluteX: number;
  absoluteY: number;
  bounds: typeof BASE_VIEWBOX;
}) {
  const horizontalChange = deltaX / baseWidth;
  const verticalChange = deltaY / baseHeight;
  const dominantChange =
    Math.abs(horizontalChange) >= Math.abs(verticalChange)
      ? horizontalChange
      : verticalChange;
  const maximumForBounds = Math.min(
    LABEL_SCALE_MAX,
    (bounds.x + bounds.width - absoluteX - 8) / baseWidth,
    (bounds.y + bounds.height - absoluteY - 8) / baseHeight,
  );

  return Math.max(
    LABEL_SCALE_MIN,
    Math.min(maximumForBounds, initialScale + dominantChange),
  );
}

const DENSE_MARKER_LABEL_THRESHOLD = 18;
const DRAWING_HIT_RADIUS = 12;
const ERASER_RADIUS = 14;
const DRAWING_SIZE_MIN = 1;
const DRAWING_TEXT_SIZE_MIN = 0.5;
const DRAWING_SIZE_MAX = 3;
const DRAWING_SIZE_STEP = 0.5;
const DEFAULT_DRAWING_STROKE_WIDTH = 4;
const DEFAULT_DRAWING_TEXT_SIZE = 19;
const MOUNTAIN_SHAPE_WIDTH = 64;
const MOUNTAIN_SHAPE_HEIGHT = 48;

const MOUNTAIN_SHAPE_TOOLS: Array<{
  tool: MountainFormation;
  label: string;
}> = [
  { tool: "mountain-fold", label: "Kıvrım dağ şekli" },
  { tool: "mountain-fault-block", label: "Kırık dağ şekli" },
  { tool: "mountain-volcanic", label: "Volkanik dağ şekli" },
];

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
    mode === "line" ||
    mode === "arrow" ||
    mode === "circle" ||
    mode === "text" ||
    Boolean(mode && isMountainFormation(mode))
  );
}

function isTransformableDrawing(drawing: Pick<MapDrawing, "tool">) {
  return drawing.tool === "text" || isMountainFormation(drawing.tool);
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

function minimumDrawingSize(tool?: DrawingMode | null) {
  return tool === "text" ? DRAWING_TEXT_SIZE_MIN : DRAWING_SIZE_MIN;
}

function normalizeDrawingSize(
  size?: number,
  minimum = DRAWING_SIZE_MIN,
) {
  if (!Number.isFinite(size)) return Math.max(DRAWING_SIZE_MIN, minimum);
  return Math.max(
    minimum,
    Math.min(DRAWING_SIZE_MAX, size as number),
  );
}

function getTextBounds(
  drawing: Pick<MapDrawing, "points" | "size" | "text">,
) {
  const origin = drawing.points[0];
  const size = normalizeDrawingSize(
    drawing.size,
    minimumDrawingSize("text"),
  );
  const width = Math.max(18 * size, (drawing.text?.length ?? 1) * 11 * size);
  return {
    x: origin.x - 3 * size,
    y: origin.y - 23 * size,
    width,
    height: 30 * size,
  };
}

function getMountainShapeBounds(
  drawing: Pick<MapDrawing, "points" | "size">,
) {
  const center = drawing.points[0];
  const size = normalizeDrawingSize(drawing.size);
  const width = MOUNTAIN_SHAPE_WIDTH * size;
  const height = MOUNTAIN_SHAPE_HEIGHT * size;
  return {
    x: center.x - width / 2,
    y: center.y - height / 2,
    width,
    height,
  };
}

function rotatePointAround(
  point: Point,
  center: Point,
  rotation: number,
) {
  const radians = (rotation * Math.PI) / 180;
  const deltaX = point.x - center.x;
  const deltaY = point.y - center.y;
  return {
    x:
      center.x +
      deltaX * Math.cos(radians) -
      deltaY * Math.sin(radians),
    y:
      center.y +
      deltaX * Math.sin(radians) +
      deltaY * Math.cos(radians),
  };
}

function rotatedTextBounds(drawing: MapDrawing) {
  const bounds = getTextBounds(drawing);
  const rotation = normalizeLabelRotation(drawing.rotation);
  if (rotation === 0) return bounds;
  const center = {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
  };
  const corners = [
    { x: bounds.x, y: bounds.y },
    { x: bounds.x + bounds.width, y: bounds.y },
    { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
    { x: bounds.x, y: bounds.y + bounds.height },
  ].map((point) => rotatePointAround(point, center, rotation));
  const xs = corners.map((point) => point.x);
  const ys = corners.map((point) => point.y);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

function drawingHitDistance(drawing: MapDrawing, point: MapPoint) {
  if (drawing.points.length === 0) return Number.POSITIVE_INFINITY;
  const first = drawing.points[0];
  const last = drawing.points[drawing.points.length - 1];

  if (drawing.tool === "text") {
    const bounds = getTextBounds(drawing);
    const center = {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2,
    };
    const localPoint = rotatePointAround(
      point,
      center,
      -normalizeLabelRotation(drawing.rotation),
    );
    return localPoint.x >= bounds.x &&
      localPoint.x <= bounds.x + bounds.width &&
      localPoint.y >= bounds.y &&
      localPoint.y <= bounds.y + bounds.height
      ? 0
      : Number.POSITIVE_INFINITY;
  }
  if (isMountainFormation(drawing.tool)) {
    const bounds = getMountainShapeBounds(drawing);
    const center = first;
    const localPoint = rotatePointAround(
      point,
      center,
      -normalizeLabelRotation(drawing.rotation),
    );
    return localPoint.x >= bounds.x &&
      localPoint.x <= bounds.x + bounds.width &&
      localPoint.y >= bounds.y &&
      localPoint.y <= bounds.y + bounds.height
      ? 0
      : Number.POSITIVE_INFINITY;
  }
  if (drawing.tool === "circle") {
    const radius = Math.hypot(last.x - first.x, last.y - first.y);
    const distanceFromCenter = Math.hypot(
      point.x - first.x,
      point.y - first.y,
    );
    if (drawing.filled && distanceFromCenter <= radius) return 0;
    return Math.abs(distanceFromCenter - radius);
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
  if (drawing.tool === "text") return rotatedTextBounds(drawing);
  if (isMountainFormation(drawing.tool)) {
    return getMountainShapeBounds(drawing);
  }
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
  if (
    drawing.points.length === 0 ||
    drawing.tool === "text" ||
    isMountainFormation(drawing.tool)
  ) {
    return [];
  }
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
    if (
      drawing.tool === "text" ||
      isMountainFormation(drawing.tool) ||
      (drawing.tool === "circle" && drawing.filled)
    ) {
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

function clampPan(
  point: Point,
  zoom: number,
  bounds: typeof BASE_VIEWBOX,
): Point {
  const visibleWidth = bounds.width / zoom;
  const visibleHeight = bounds.height / zoom;
  const limitX = (bounds.width - visibleWidth) / 2;
  const limitY = (bounds.height - visibleHeight) / 2;

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
  presentation = "default",
  readOnly = false,
  mountainToolsEnabled = false,
  onSelect,
  placementProvinceCode = null,
  onPlaceMarker,
  onPlacementMismatch,
  matchingProvinceCodes = null,
  provinceColorPreview = null,
  provinceFills = {},
  onProvinceFillsChange,
  drawingTool = null,
  drawingColor = "#d05f64",
  drawingSize = 1,
  drawingFilled = false,
  onDrawingToolChange,
  onDrawingColorChange,
  onDrawingSizeChange,
  onDrawingFilledChange,
  onAddDrawing,
  onUpdateRecord,
  onUpdateMarker,
  onUpdateDrawing,
  onReplaceDrawings,
  onUndoDrawing,
  onClearDrawings,
  exportMode = false,
}: TurkeyMapProps) {
  const isMountainAtlas = presentation === "mountain-atlas";
  const svgRef = useRef<SVGSVGElement>(null);
  const mapStageRef = useRef<HTMLElement>(null);
  const panGestureRef = useRef<PanGesture | null>(null);
  const regionPaintingGestureRef = useRef<RegionPaintingGesture | null>(null);
  const provinceFillsRef = useRef(provinceFills);
  const drawingGestureRef = useRef<DrawingGesture | null>(null);
  const drawingTextResizeGestureRef =
    useRef<DrawingTextResizeGesture | null>(null);
  const drawingTextRotateGestureRef =
    useRef<DrawingTextRotateGesture | null>(null);
  const markerLabelGestureRef = useRef<MarkerLabelGesture | null>(null);
  const markerLabelResizeGestureRef =
    useRef<MarkerLabelResizeGesture | null>(null);
  const markerLabelRotateGestureRef =
    useRef<MarkerLabelRotateGesture | null>(null);
  const markerMoveGestureRef = useRef<MarkerMoveGesture | null>(null);
  const provinceLabelGestureRef = useRef<ProvinceLabelGesture | null>(null);
  const provinceLabelResizeGestureRef =
    useRef<ProvinceLabelResizeGesture | null>(null);
  const provinceLabelRotateGestureRef =
    useRef<ProvinceLabelRotateGesture | null>(null);
  const draftDrawingRef = useRef<MapPoint[]>([]);
  const suppressMapClickRef = useRef(false);
  const suppressMarkerClickRef = useRef(false);
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
  const [resizingMarkerLabel, setResizingMarkerLabel] = useState<{
    markerId: string;
    offset: MapPoint;
    scale: number;
  } | null>(null);
  const [rotatingMarkerLabel, setRotatingMarkerLabel] = useState<{
    markerId: string;
    offset: MapPoint;
    rotation: number;
  } | null>(null);
  const [movingMarkerPosition, setMovingMarkerPosition] = useState<{
    markerId: string;
    position: Point;
  } | null>(null);
  const [movingProvinceLabel, setMovingProvinceLabel] = useState<{
    recordId: string;
    offset: MapPoint;
  } | null>(null);
  const [resizingProvinceLabel, setResizingProvinceLabel] = useState<{
    recordId: string;
    offset: MapPoint;
    scale: number;
  } | null>(null);
  const [rotatingProvinceLabel, setRotatingProvinceLabel] = useState<{
    recordId: string;
    offset: MapPoint;
    rotation: number;
  } | null>(null);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const [fallbackFullscreen, setFallbackFullscreen] = useState(false);
  const [regionPainterActive, setRegionPainterActive] = useState(false);
  const [regionPainterMode, setRegionPainterMode] =
    useState<RegionPainterMode>("paint");
  const [regionPainterColor, setRegionPainterColor] = useState("#2f80a8");
  const [displayProvinceFills, setDisplayProvinceFills] =
    useState(provinceFills);
  const [legendOpen, setLegendOpen] = useState(
    () => !window.matchMedia("(max-width: 640px)").matches,
  );
  const [isNarrowViewport, setIsNarrowViewport] = useState(
    () => window.matchMedia("(max-width: 640px)").matches,
  );
  const viewBounds = isMountainAtlas
    ? MOUNTAIN_ATLAS_VIEWBOX
    : isNarrowViewport
      ? MOBILE_VIEWBOX
      : BASE_VIEWBOX;
  const maximumZoom = isNarrowViewport ? 2.6 : 1.8;
  const rotateHandleDistance = isNarrowViewport
    ? 44
    : LABEL_ROTATE_HANDLE_DISTANCE;

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 640px)");
    const syncLegend = (event: MediaQueryListEvent) => {
      setLegendOpen(!event.matches);
      setIsNarrowViewport(event.matches);
    };
    mobileQuery.addEventListener("change", syncLegend);
    return () => mobileQuery.removeEventListener("change", syncLegend);
  }, []);

  useEffect(() => {
    const normalizedZoom = Math.min(maximumZoom, zoom);
    if (normalizedZoom !== zoom) setZoom(normalizedZoom);
    setPan((current) => clampPan(current, normalizedZoom, viewBounds));
  }, [maximumZoom, viewBounds, zoom]);

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [presentation]);

  useEffect(() => {
    const syncFullscreen = () => {
      const webkitDocument = document as WebkitFullscreenDocument;
      const fullscreenElement =
        document.fullscreenElement ?? webkitDocument.webkitFullscreenElement;
      setNativeFullscreen(fullscreenElement === mapStageRef.current);
    };

    document.addEventListener("fullscreenchange", syncFullscreen);
    document.addEventListener(
      "webkitfullscreenchange",
      syncFullscreen as EventListener,
    );
    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen);
      document.removeEventListener(
        "webkitfullscreenchange",
        syncFullscreen as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    if (!fallbackFullscreen) return;

    const exitWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFallbackFullscreen(false);
    };
    document.body.classList.add("map-fullscreen-open");
    document.addEventListener("keydown", exitWithEscape);
    return () => {
      document.body.classList.remove("map-fullscreen-open");
      document.removeEventListener("keydown", exitWithEscape);
    };
  }, [fallbackFullscreen]);

  useEffect(() => {
    provinceFillsRef.current = provinceFills;
    setDisplayProvinceFills(provinceFills);
  }, [provinceFills]);

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
    if (drawingTool) setRegionPainterActive(false);
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
  const mountainAtlasMarkers = useMemo(
    () =>
      isMountainAtlas
        ? markers.filter(
            (marker) =>
              marker.presetItemId &&
              Boolean(MOUNTAIN_ATLAS_LAYOUTS[marker.presetItemId]),
          )
        : [],
    [isMountainAtlas, markers],
  );
  const mountainAtlasMarkerIds = useMemo(
    () => new Set(mountainAtlasMarkers.map((marker) => marker.id)),
    [mountainAtlasMarkers],
  );
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
    markers.length -
      routedRiverMarkerIds.size -
      mountainAtlasMarkerIds.size >
    DENSE_MARKER_LABEL_THRESHOLD;
  const displayedMarkers = useMemo(() => {
    const pointMarkers = markers.filter(
      (marker) =>
        !routedRiverMarkerIds.has(marker.id) &&
        !mountainAtlasMarkerIds.has(marker.id),
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
    mountainAtlasMarkerIds,
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
      if (
        routedRiverMarkerIds.has(marker.id) ||
        mountainAtlasMarkerIds.has(marker.id)
      ) {
        return;
      }
      if (movingMarkerPosition?.markerId === marker.id) {
        positions.set(marker.id, movingMarkerPosition.position);
        return;
      }
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
  }, [
    markers,
    centers,
    movingMarkerPosition,
    routedRiverMarkerIds,
    mountainAtlasMarkerIds,
  ]);
  const markerLabelLayouts = useMemo(() => {
    const layouts = new Map<string, LabelLayout>();
    const placed: Array<
      Pick<LabelLayout, "x" | "y" | "width" | "height">
    > = [
      // Lejant, çizim araçları ve yakınlaştırma düğmelerinin kapladığı alanlar.
      { x: viewBounds.x + 4, y: 84, width: 142, height: 116 },
      {
        x: viewBounds.x + viewBounds.width - 220,
        y: 84,
        width: 216,
        height: 58,
      },
      { x: viewBounds.x + 4, y: 598, width: 150, height: 63 },
      {
        x: viewBounds.x + viewBounds.width - 104,
        y: 598,
        width: 100,
        height: 63,
      },
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
        left.labelOffset ||
        movingMarkerLabel?.markerId === left.id ||
        resizingMarkerLabel?.markerId === left.id ||
        rotatingMarkerLabel?.markerId === left.id;
      const rightHasCustomPosition =
        right.labelOffset ||
        movingMarkerLabel?.markerId === right.id ||
        resizingMarkerLabel?.markerId === right.id ||
        rotatingMarkerLabel?.markerId === right.id;
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
      const scale =
        resizingMarkerLabel?.markerId === marker.id
          ? resizingMarkerLabel.scale
          : normalizeLabelScale(marker.labelScale);
      const width = Math.max(52, label.length * 6.6 + 17) * scale;
      const height = 21 * scale;
      const customOffset =
        rotatingMarkerLabel?.markerId === marker.id
          ? rotatingMarkerLabel.offset
          : resizingMarkerLabel?.markerId === marker.id
          ? resizingMarkerLabel.offset
          : movingMarkerLabel?.markerId === marker.id
          ? movingMarkerLabel.offset
          : marker.labelOffset;

      if (customOffset) {
        const x = Math.max(
          viewBounds.x + 8,
          Math.min(
            viewBounds.x + viewBounds.width - width - 8,
            position.x + customOffset.x,
          ),
        );
        const y = Math.max(
          viewBounds.y + 8,
          Math.min(
            viewBounds.y + viewBounds.height - height - 8,
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
          Math.max(0, viewBounds.x + 8 - candidate.x) +
          Math.max(
            0,
            candidate.x + width - (viewBounds.x + viewBounds.width - 8),
          );
        const outsideY =
          Math.max(0, viewBounds.y + 8 - candidate.y) +
          Math.max(
            0,
            candidate.y + height -
              (viewBounds.y + viewBounds.height - 8),
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
  }, [
    markers,
    markerPositions,
    movingMarkerLabel,
    resizingMarkerLabel,
    rotatingMarkerLabel,
    viewBounds,
  ]);

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

  const viewWidth = viewBounds.width / zoom;
  const viewHeight = viewBounds.height / zoom;
  const viewX =
    viewBounds.x + (viewBounds.width - viewWidth) / 2 + pan.x;
  const viewY =
    viewBounds.y + (viewBounds.height - viewHeight) / 2 + pan.y;

  const changeZoom = (nextZoom: number) => {
    const normalizedZoom = Math.max(1, Math.min(maximumZoom, nextZoom));
    setZoom(normalizedZoom);
    setPan((current) => clampPan(current, normalizedZoom, viewBounds));
  };

  const toggleFullscreen = async () => {
    const stage = mapStageRef.current as WebkitFullscreenElement | null;
    if (!stage) return;

    const webkitDocument = document as WebkitFullscreenDocument;
    const fullscreenElement =
      document.fullscreenElement ?? webkitDocument.webkitFullscreenElement;
    if (fallbackFullscreen) {
      setFallbackFullscreen(false);
      return;
    }
    if (fullscreenElement === stage) {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else {
        await Promise.resolve(webkitDocument.webkitExitFullscreen?.());
      }
      return;
    }

    try {
      if (stage.requestFullscreen) {
        await stage.requestFullscreen({ navigationUI: "hide" });
      } else if (stage.webkitRequestFullscreen) {
        await Promise.resolve(stage.webkitRequestFullscreen());
      } else {
        setFallbackFullscreen(true);
      }
    } catch {
      setFallbackFullscreen(true);
    }
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

  const startDrawingTextResize = (
    event: React.PointerEvent<SVGGElement>,
    drawing: MapDrawing,
    bounds: Pick<LabelLayout, "x" | "y" | "width" | "height">,
  ) => {
    if (
      drawingTool !== "select" ||
      !isTransformableDrawing(drawing) ||
      readOnly ||
      !onUpdateDrawing ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }
    const point = eventToPoint(event);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const initialSize = normalizeDrawingSize(
      drawing.size,
      minimumDrawingSize(drawing.tool),
    );
    drawingTextResizeGestureRef.current = {
      pointerId: event.pointerId,
      original: drawing,
      current: drawing,
      start: point,
      bounds,
      initialSize,
      rotation: normalizeLabelRotation(drawing.rotation),
      moved: false,
    };
    setMovingDrawing(drawing);
  };

  const resizeDrawingText = (event: React.PointerEvent<SVGGElement>) => {
    const gesture = drawingTextResizeGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const point = eventToPoint(event);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    const deltaX = point.x - gesture.start.x;
    const deltaY = point.y - gesture.start.y;
    const radians = (gesture.rotation * Math.PI) / 180;
    const localDeltaX =
      deltaX * Math.cos(radians) + deltaY * Math.sin(radians);
    const localDeltaY =
      -deltaX * Math.sin(radians) + deltaY * Math.cos(radians);
    const baseWidth = gesture.bounds.width / gesture.initialSize;
    const baseHeight = gesture.bounds.height / gesture.initialSize;
    const horizontalChange = localDeltaX / baseWidth;
    const verticalChange = localDeltaY / baseHeight;
    const dominantChange =
      Math.abs(horizontalChange) >= Math.abs(verticalChange)
        ? horizontalChange
        : verticalChange;
    const maximumForBounds = Math.min(
      DRAWING_SIZE_MAX,
      (viewBounds.x +
        viewBounds.width -
        gesture.bounds.x -
        8) /
        baseWidth,
      (viewBounds.y +
        viewBounds.height -
        gesture.bounds.y -
        8) /
        baseHeight,
    );
    const size = Math.max(
      minimumDrawingSize(gesture.original.tool),
      Math.min(
        maximumForBounds,
        gesture.initialSize + dominantChange,
      ),
    );
    const current = {
      ...gesture.original,
      size,
      points:
        gesture.original.tool === "text"
          ? [
              {
                x: gesture.bounds.x + 3 * size,
                y: gesture.bounds.y + 23 * size,
              },
            ]
          : gesture.original.points,
    };
    gesture.current = current;
    gesture.moved =
      gesture.moved || Math.abs(size - gesture.initialSize) > 0.02;
    setMovingDrawing(current);
  };

  const finishDrawingTextResize = (
    event: React.PointerEvent<SVGGElement>,
    cancelled = false,
  ) => {
    const gesture = drawingTextResizeGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!cancelled && gesture.moved) {
      onUpdateDrawing?.({
        ...gesture.current,
        size: Number(
          normalizeDrawingSize(
            gesture.current.size,
            minimumDrawingSize(gesture.current.tool),
          ).toFixed(2),
        ),
      });
    }
    drawingTextResizeGestureRef.current = null;
    setMovingDrawing(null);
  };

  const resetDrawingTextSize = (
    event: React.MouseEvent<SVGGElement>,
    drawing: MapDrawing,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isTransformableDrawing(drawing) || !onUpdateDrawing) return;
    const bounds =
      drawing.tool === "text" ? getTextBounds(drawing) : undefined;
    onUpdateDrawing({
      ...drawing,
      size: DRAWING_SIZE_MIN,
      points: bounds
        ? [
            {
              x: bounds.x + 3 * DRAWING_SIZE_MIN,
              y: bounds.y + 23 * DRAWING_SIZE_MIN,
            },
          ]
        : drawing.points,
    });
  };

  const startDrawingTextRotation = (
    event: React.PointerEvent<SVGGElement>,
    drawing: MapDrawing,
    bounds: Pick<LabelLayout, "x" | "y" | "width" | "height">,
  ) => {
    if (
      drawingTool !== "select" ||
      !isTransformableDrawing(drawing) ||
      readOnly ||
      !onUpdateDrawing ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }
    const point = eventToPoint(event);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const center = {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2,
    };
    const rotation = normalizeLabelRotation(drawing.rotation);
    drawingTextRotateGestureRef.current = {
      pointerId: event.pointerId,
      original: drawing,
      current: drawing,
      center,
      startAngle: pointAngle(center, point),
      initialRotation: rotation,
      moved: false,
    };
    setMovingDrawing(drawing);
  };

  const rotateDrawingText = (event: React.PointerEvent<SVGGElement>) => {
    const gesture = drawingTextRotateGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const point = eventToPoint(event);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    const angleChange = normalizeLabelRotation(
      pointAngle(gesture.center, point) - gesture.startAngle,
    );
    const rotation =
      Math.round(
        normalizeLabelRotation(
          gesture.initialRotation + angleChange,
        ) / 5,
      ) * 5;
    const current = {
      ...gesture.original,
      rotation,
    };
    gesture.current = current;
    gesture.moved =
      gesture.moved ||
      Math.abs(
        normalizeLabelRotation(rotation - gesture.initialRotation),
      ) >= 5;
    setMovingDrawing(current);
  };

  const finishDrawingTextRotation = (
    event: React.PointerEvent<SVGGElement>,
    cancelled = false,
  ) => {
    const gesture = drawingTextRotateGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!cancelled && gesture.moved) {
      onUpdateDrawing?.(gesture.current);
    }
    drawingTextRotateGestureRef.current = null;
    setMovingDrawing(null);
  };

  const resetDrawingTextRotation = (
    event: React.MouseEvent<SVGGElement>,
    drawing: MapDrawing,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (
      !isTransformableDrawing(drawing) ||
      !drawing.rotation ||
      !onUpdateDrawing
    ) {
      return;
    }
    const resetDrawing = { ...drawing };
    delete resetDrawing.rotation;
    onUpdateDrawing(resetDrawing);
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
      readOnly ||
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
      viewBounds.x + 8,
      Math.min(
        viewBounds.x + viewBounds.width - gesture.width - 8,
        gesture.position.x + gesture.originalOffset.x + deltaX,
      ),
    );
    const absoluteY = Math.max(
      viewBounds.y + 8,
      Math.min(
        viewBounds.y + viewBounds.height - gesture.height - 8,
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

  const startMarkerLabelResize = (
    event: React.PointerEvent<SVGGElement>,
    marker: MapMarker,
    position: Point,
    layout: LabelLayout,
    scale: number,
    rotation: number,
  ) => {
    if (
      drawingTool ||
      placementProvinceCode ||
      readOnly ||
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
    const offset = {
      x: layout.x - position.x,
      y: layout.y - position.y,
    };
    markerLabelResizeGestureRef.current = {
      pointerId: event.pointerId,
      marker,
      position,
      start: point,
      offset,
      baseWidth: layout.width / scale,
      baseHeight: layout.height / scale,
      initialScale: scale,
      currentScale: scale,
      rotation,
      moved: false,
    };
    setResizingMarkerLabel({
      markerId: marker.id,
      offset,
      scale,
    });
  };

  const resizeMarkerLabel = (event: React.PointerEvent<SVGGElement>) => {
    const gesture = markerLabelResizeGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const point = eventToPoint(event);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    const deltaX = point.x - gesture.start.x;
    const deltaY = point.y - gesture.start.y;
    const rotation = (gesture.rotation * Math.PI) / 180;
    const localDeltaX =
      deltaX * Math.cos(rotation) + deltaY * Math.sin(rotation);
    const localDeltaY =
      -deltaX * Math.sin(rotation) + deltaY * Math.cos(rotation);
    const scale = resizedLabelScale({
      initialScale: gesture.initialScale,
      deltaX: localDeltaX,
      deltaY: localDeltaY,
      baseWidth: gesture.baseWidth,
      baseHeight: gesture.baseHeight,
      absoluteX: gesture.position.x + gesture.offset.x,
      absoluteY: gesture.position.y + gesture.offset.y,
      bounds: viewBounds,
    });
    gesture.currentScale = scale;
    gesture.moved =
      gesture.moved || Math.abs(scale - gesture.initialScale) > 0.01;
    setResizingMarkerLabel({
      markerId: gesture.marker.id,
      offset: gesture.offset,
      scale,
    });
  };

  const finishMarkerLabelResize = (
    event: React.PointerEvent<SVGGElement>,
    cancelled = false,
  ) => {
    const gesture = markerLabelResizeGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!cancelled && gesture.moved) {
      onUpdateMarker?.({
        ...gesture.marker,
        labelOffset: gesture.offset,
        labelScale: Number(gesture.currentScale.toFixed(2)),
      });
    }
    markerLabelResizeGestureRef.current = null;
    setResizingMarkerLabel(null);
  };

  const resetMarkerLabelSize = (
    event: React.MouseEvent<SVGGElement>,
    marker: MapMarker,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!marker.labelScale || !onUpdateMarker) return;
    const resetMarker = { ...marker };
    delete resetMarker.labelScale;
    onUpdateMarker(resetMarker);
  };

  const startMarkerLabelRotation = (
    event: React.PointerEvent<SVGGElement>,
    marker: MapMarker,
    position: Point,
    layout: LabelLayout,
    rotation: number,
  ) => {
    if (
      drawingTool ||
      placementProvinceCode ||
      readOnly ||
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
    const offset = {
      x: layout.x - position.x,
      y: layout.y - position.y,
    };
    const center = {
      x: layout.x + layout.width / 2,
      y: layout.y + layout.height / 2,
    };
    markerLabelRotateGestureRef.current = {
      pointerId: event.pointerId,
      marker,
      offset,
      center,
      startAngle: pointAngle(center, point),
      initialRotation: rotation,
      currentRotation: rotation,
      moved: false,
    };
    setRotatingMarkerLabel({
      markerId: marker.id,
      offset,
      rotation,
    });
  };

  const rotateMarkerLabel = (event: React.PointerEvent<SVGGElement>) => {
    const gesture = markerLabelRotateGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const point = eventToPoint(event);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    const angleChange = normalizeLabelRotation(
      pointAngle(gesture.center, point) - gesture.startAngle,
    );
    const rotation =
      Math.round(
        normalizeLabelRotation(
          gesture.initialRotation + angleChange,
        ) / 5,
      ) * 5;
    gesture.currentRotation = rotation;
    gesture.moved =
      gesture.moved ||
      Math.abs(
        normalizeLabelRotation(rotation - gesture.initialRotation),
      ) >= 5;
    setRotatingMarkerLabel({
      markerId: gesture.marker.id,
      offset: gesture.offset,
      rotation,
    });
  };

  const finishMarkerLabelRotation = (
    event: React.PointerEvent<SVGGElement>,
    cancelled = false,
  ) => {
    const gesture = markerLabelRotateGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!cancelled && gesture.moved) {
      onUpdateMarker?.({
        ...gesture.marker,
        labelOffset: gesture.offset,
        labelRotation: gesture.currentRotation,
      });
    }
    markerLabelRotateGestureRef.current = null;
    setRotatingMarkerLabel(null);
  };

  const resetMarkerLabelRotation = (
    event: React.MouseEvent<SVGGElement>,
    marker: MapMarker,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!marker.labelRotation || !onUpdateMarker) return;
    const resetMarker = { ...marker };
    delete resetMarker.labelRotation;
    onUpdateMarker(resetMarker);
  };

  const startMarkerMove = (
    event: React.PointerEvent<SVGGElement>,
    marker: MapMarker,
    position: Point,
  ) => {
    if (
      drawingTool ||
      placementProvinceCode ||
      readOnly ||
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
    markerMoveGestureRef.current = {
      pointerId: event.pointerId,
      marker,
      start: point,
      originalPosition: position,
      currentPosition: position,
      moved: false,
    };
    setMovingMarkerPosition({
      markerId: marker.id,
      position,
    });
  };

  const moveMarker = (event: React.PointerEvent<SVGGElement>) => {
    const gesture = markerMoveGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const point = eventToPoint(event);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    const deltaX = point.x - gesture.start.x;
    const deltaY = point.y - gesture.start.y;
    const position = {
      x: Math.max(
        viewBounds.x + 16,
        Math.min(
          viewBounds.x + viewBounds.width - 16,
          gesture.originalPosition.x + deltaX,
        ),
      ),
      y: Math.max(
        viewBounds.y + 42,
        Math.min(
          viewBounds.y + viewBounds.height - 8,
          gesture.originalPosition.y + deltaY,
        ),
      ),
    };
    gesture.currentPosition = position;
    gesture.moved = gesture.moved || Math.hypot(deltaX, deltaY) > 1;
    setMovingMarkerPosition({
      markerId: gesture.marker.id,
      position,
    });
  };

  const finishMarkerMove = (
    event: React.PointerEvent<SVGGElement>,
    cancelled = false,
  ) => {
    const gesture = markerMoveGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!cancelled && gesture.moved) {
      suppressMarkerClickRef.current = true;
      onUpdateMarker?.({
        ...gesture.marker,
        x: gesture.currentPosition.x,
        y: gesture.currentPosition.y,
        anchoredToProvince: false,
      });
      window.setTimeout(() => {
        suppressMarkerClickRef.current = false;
      }, 0);
    }
    markerMoveGestureRef.current = null;
    setMovingMarkerPosition(null);
  };

  const startProvinceLabelMove = (
    event: React.PointerEvent<SVGGElement>,
    record: ProvinceRecord,
    center: Point,
    width: number,
    height: number,
    offset: MapPoint,
  ) => {
    if (
      drawingTool ||
      placementProvinceCode ||
      readOnly ||
      !onUpdateRecord ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }
    const point = eventToPoint(event);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    provinceLabelGestureRef.current = {
      pointerId: event.pointerId,
      record,
      center,
      width,
      height,
      start: point,
      originalOffset: offset,
      currentOffset: offset,
      moved: false,
    };
    setMovingProvinceLabel({
      recordId: record.id,
      offset,
    });
  };

  const moveProvinceLabel = (event: React.PointerEvent<SVGGElement>) => {
    const gesture = provinceLabelGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const point = eventToPoint(event);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    const deltaX = point.x - gesture.start.x;
    const deltaY = point.y - gesture.start.y;
    const absoluteX = Math.max(
      viewBounds.x + 8,
      Math.min(
        viewBounds.x + viewBounds.width - gesture.width - 8,
        gesture.center.x + gesture.originalOffset.x + deltaX,
      ),
    );
    const absoluteY = Math.max(
      viewBounds.y + 8,
      Math.min(
        viewBounds.y + viewBounds.height - gesture.height - 8,
        gesture.center.y + gesture.originalOffset.y + deltaY,
      ),
    );
    const offset = {
      x: absoluteX - gesture.center.x,
      y: absoluteY - gesture.center.y,
    };
    gesture.currentOffset = offset;
    gesture.moved = gesture.moved || Math.hypot(deltaX, deltaY) > 1;
    setMovingProvinceLabel({
      recordId: gesture.record.id,
      offset,
    });
  };

  const finishProvinceLabelMove = (
    event: React.PointerEvent<SVGGElement>,
    cancelled = false,
  ) => {
    const gesture = provinceLabelGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!cancelled && gesture.moved) {
      onUpdateRecord?.({
        ...gesture.record,
        labelOffset: gesture.currentOffset,
      });
    }
    provinceLabelGestureRef.current = null;
    setMovingProvinceLabel(null);
  };

  const resetProvinceLabelPosition = (
    event: React.MouseEvent<SVGGElement>,
    record: ProvinceRecord,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!record.labelOffset || !onUpdateRecord) return;
    const resetRecord = { ...record };
    delete resetRecord.labelOffset;
    onUpdateRecord(resetRecord);
  };

  const startProvinceLabelResize = (
    event: React.PointerEvent<SVGGElement>,
    record: ProvinceRecord,
    center: Point,
    offset: MapPoint,
    width: number,
    height: number,
    scale: number,
    rotation: number,
  ) => {
    if (
      drawingTool ||
      placementProvinceCode ||
      readOnly ||
      !onUpdateRecord ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }
    const point = eventToPoint(event);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    provinceLabelResizeGestureRef.current = {
      pointerId: event.pointerId,
      record,
      center,
      start: point,
      offset,
      baseWidth: width / scale,
      baseHeight: height / scale,
      initialScale: scale,
      currentScale: scale,
      rotation,
      moved: false,
    };
    setResizingProvinceLabel({
      recordId: record.id,
      offset,
      scale,
    });
  };

  const resizeProvinceLabel = (event: React.PointerEvent<SVGGElement>) => {
    const gesture = provinceLabelResizeGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const point = eventToPoint(event);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    const deltaX = point.x - gesture.start.x;
    const deltaY = point.y - gesture.start.y;
    const rotation = (gesture.rotation * Math.PI) / 180;
    const localDeltaX =
      deltaX * Math.cos(rotation) + deltaY * Math.sin(rotation);
    const localDeltaY =
      -deltaX * Math.sin(rotation) + deltaY * Math.cos(rotation);
    const scale = resizedLabelScale({
      initialScale: gesture.initialScale,
      deltaX: localDeltaX,
      deltaY: localDeltaY,
      baseWidth: gesture.baseWidth,
      baseHeight: gesture.baseHeight,
      absoluteX: gesture.center.x + gesture.offset.x,
      absoluteY: gesture.center.y + gesture.offset.y,
      bounds: viewBounds,
    });
    gesture.currentScale = scale;
    gesture.moved =
      gesture.moved || Math.abs(scale - gesture.initialScale) > 0.01;
    setResizingProvinceLabel({
      recordId: gesture.record.id,
      offset: gesture.offset,
      scale,
    });
  };

  const finishProvinceLabelResize = (
    event: React.PointerEvent<SVGGElement>,
    cancelled = false,
  ) => {
    const gesture = provinceLabelResizeGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!cancelled && gesture.moved) {
      onUpdateRecord?.({
        ...gesture.record,
        labelOffset: gesture.offset,
        labelScale: Number(gesture.currentScale.toFixed(2)),
      });
    }
    provinceLabelResizeGestureRef.current = null;
    setResizingProvinceLabel(null);
  };

  const resetProvinceLabelSize = (
    event: React.MouseEvent<SVGGElement>,
    record: ProvinceRecord,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!record.labelScale || !onUpdateRecord) return;
    const resetRecord = { ...record };
    delete resetRecord.labelScale;
    onUpdateRecord(resetRecord);
  };

  const startProvinceLabelRotation = (
    event: React.PointerEvent<SVGGElement>,
    record: ProvinceRecord,
    provinceCenter: Point,
    offset: MapPoint,
    width: number,
    height: number,
    rotation: number,
  ) => {
    if (
      drawingTool ||
      placementProvinceCode ||
      readOnly ||
      !onUpdateRecord ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }
    const point = eventToPoint(event);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const center = {
      x: provinceCenter.x + offset.x + width / 2,
      y: provinceCenter.y + offset.y + height / 2,
    };
    provinceLabelRotateGestureRef.current = {
      pointerId: event.pointerId,
      record,
      offset,
      center,
      startAngle: pointAngle(center, point),
      initialRotation: rotation,
      currentRotation: rotation,
      moved: false,
    };
    setRotatingProvinceLabel({
      recordId: record.id,
      offset,
      rotation,
    });
  };

  const rotateProvinceLabel = (event: React.PointerEvent<SVGGElement>) => {
    const gesture = provinceLabelRotateGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const point = eventToPoint(event);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    const angleChange = normalizeLabelRotation(
      pointAngle(gesture.center, point) - gesture.startAngle,
    );
    const rotation =
      Math.round(
        normalizeLabelRotation(
          gesture.initialRotation + angleChange,
        ) / 5,
      ) * 5;
    gesture.currentRotation = rotation;
    gesture.moved =
      gesture.moved ||
      Math.abs(
        normalizeLabelRotation(rotation - gesture.initialRotation),
      ) >= 5;
    setRotatingProvinceLabel({
      recordId: gesture.record.id,
      offset: gesture.offset,
      rotation,
    });
  };

  const finishProvinceLabelRotation = (
    event: React.PointerEvent<SVGGElement>,
    cancelled = false,
  ) => {
    const gesture = provinceLabelRotateGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!cancelled && gesture.moved) {
      onUpdateRecord?.({
        ...gesture.record,
        labelOffset: gesture.offset,
        labelRotation: gesture.currentRotation,
      });
    }
    provinceLabelRotateGestureRef.current = null;
    setRotatingProvinceLabel(null);
  };

  const resetProvinceLabelRotation = (
    event: React.MouseEvent<SVGGElement>,
    record: ProvinceRecord,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!record.labelRotation || !onUpdateRecord) return;
    const resetRecord = { ...record };
    delete resetRecord.labelRotation;
    onUpdateRecord(resetRecord);
  };

  const provinceCodeAtClientPoint = (
    clientX: number,
    clientY: number,
    eventTarget?: EventTarget | null,
  ) => {
    const directTarget =
      eventTarget instanceof Element
        ? eventTarget.closest<SVGPathElement>("[data-province-code]")
        : null;
    const path =
      directTarget ??
      document
        .elementsFromPoint(clientX, clientY)
        .map((element) =>
          element.closest<SVGPathElement>("[data-province-code]"),
        )
        .find((candidate) => Boolean(candidate));
    const provinceCode = Number(path?.dataset.provinceCode);
    return Number.isInteger(provinceCode) &&
      provinceCode >= 1 &&
      provinceCode <= 81
      ? provinceCode
      : null;
  };

  const applyRegionPainting = (
    provinceCodes: number[],
    fill: string | null,
    persist = true,
  ) => {
    const next = applyProvinceFill(
      provinceFillsRef.current,
      provinceCodes,
      fill,
    );
    provinceFillsRef.current = next;
    setDisplayProvinceFills(next);
    if (persist) onProvinceFillsChange?.(next);
  };

  const handleProvinceClick = (
    event: React.MouseEvent<SVGGElement>,
    city: City,
  ) => {
    if (drawingTool || regionPainterActive) return;
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
      | "id"
      | "tool"
      | "color"
      | "size"
      | "filled"
      | "rotation"
      | "points"
      | "text"
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
    if (drawing.tool === "line") {
      return (
        <line
          key={drawing.id}
          {...common}
          className={`${common.className} drawing-shape--line`}
          x1={first.x}
          y1={first.y}
          x2={last.x}
          y2={last.y}
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
          className={`${common.className} ${
            drawing.filled ? "drawing-shape--filled-circle" : ""
          }`}
          fill={drawing.filled ? drawing.color : "none"}
          fillOpacity={drawing.filled ? 0.28 : undefined}
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
    if (isMountainFormation(drawing.tool)) {
      const rotation = normalizeLabelRotation(drawing.rotation);
      const size = normalizeDrawingSize(drawing.size);
      return (
        <g
          key={drawing.id}
          className={`drawing-mountain-symbol drawing-mountain-symbol--${drawing.tool}`}
          data-rotation={rotation}
          transform={`translate(${first.x} ${first.y}) rotate(${rotation}) scale(${size})`}
        >
          <g transform="translate(0 20)">
            <MountainGlyph formation={drawing.tool} />
          </g>
        </g>
      );
    }
    const bounds = getTextBounds(drawing);
    const rotation = normalizeLabelRotation(drawing.rotation);
    return (
      <text
        key={drawing.id}
        className="drawing-text"
        x={first.x}
        y={first.y}
        fill={drawing.color}
        transform={
          rotation === 0
            ? undefined
            : `rotate(${rotation} ${bounds.x + bounds.width / 2} ${bounds.y + bounds.height / 2})`
        }
        style={{
          fontSize:
            DEFAULT_DRAWING_TEXT_SIZE *
            normalizeDrawingSize(
              drawing.size,
              minimumDrawingSize(drawing.tool),
            ),
          strokeWidth:
            DEFAULT_DRAWING_STROKE_WIDTH *
            normalizeDrawingSize(
              drawing.size,
              minimumDrawingSize(drawing.tool),
            ),
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
    ? selectedDrawing.tool === "text"
      ? getTextBounds(selectedDrawing)
      : drawingBounds(selectedDrawing)
    : undefined;

  return (
    <section
      ref={mapStageRef}
      className={[
        "map-stage",
        isMountainAtlas ? "map-stage--mountain-atlas" : "",
        placementProvinceCode ? "map-stage--placing" : "",
        nativeFullscreen || fallbackFullscreen
          ? "map-stage--fullscreen"
          : "",
      ].join(" ")}
      aria-label={
        isMountainAtlas
          ? "Etkileşimli Türkiye dağları atlası"
          : "Etkileşimli Türkiye haritası"
      }
    >
      {!exportMode && (
        <div className="map-stage__topline">
          <div>
            <span className="eyebrow">
              {isMountainAtlas ? "FİZİKİ COĞRAFYA ATLASI" : "ÇALIŞMA ALANI"}
            </span>
            <h2>
              {isMountainAtlas
                ? "Türkiye'nin dağ haritası"
                : "Türkiye'nin 81 ili"}
            </h2>
          </div>

          {!isMountainAtlas && (
            <div className="map-legend" aria-label="Harita açıklaması">
              <span><i className="legend-dot legend-dot--empty" /> Boş</span>
              <span><i className="legend-dot legend-dot--saved" /> Not eklendi</span>
              {Object.keys(displayProvinceFills).length > 0 && (
                <span>
                  <i className="legend-dot legend-dot--region" /> Bölge rengi
                </span>
              )}
              <span><i className="legend-dot legend-dot--selected" /> Seçili</span>
            </div>
          )}
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
            isMountainAtlas ? "turkey-map--mountain-atlas" : "",
            zoom > 1 && !drawingTool && !placementProvinceCode
              ? "turkey-map--pannable"
              : "",
            isPanning ? "turkey-map--panning" : "",
            drawingTool === "select" ? "turkey-map--selecting-drawing" : "",
            drawingTool === "eraser" ? "turkey-map--erasing" : "",
            isDrawingTool(drawingTool) ? "turkey-map--drawing" : "",
            regionPainterActive ? "turkey-map--region-painting" : "",
          ].join(" ")}
          viewBox={`${viewX} ${viewY} ${viewWidth} ${viewHeight}`}
          role="group"
          aria-label={
            isMountainAtlas
              ? "Türkiye'nin dağlarını gösteren atlas haritası"
              : "81 ilden oluşan Türkiye haritası"
          }
          onPointerDown={(event) => {
            if (exportMode) return;
            if (regionPainterActive) {
              if (event.pointerType === "mouse" && event.button !== 0) return;
              const provinceCode = provinceCodeAtClientPoint(
                event.clientX,
                event.clientY,
                event.target,
              );
              if (!provinceCode) return;
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              suppressMapClickRef.current = true;
              regionPaintingGestureRef.current = {
                pointerId: event.pointerId,
                touchedProvinceCodes: new Set([provinceCode]),
              };
              applyRegionPainting(
                [provinceCode],
                regionPainterMode === "paint" ? regionPainterColor : null,
                false,
              );
              return;
            }
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
                    normalizeDrawingSize(
                      drawingSize,
                      minimumDrawingSize("text"),
                    ),
                  );
                }
                return;
              }
              if (isMountainFormation(drawingTool)) {
                onAddDrawing?.(
                  drawingTool,
                  [point],
                  undefined,
                  normalizeDrawingSize(drawingSize),
                );
                return;
              }
              event.currentTarget.setPointerCapture(event.pointerId);
              draftDrawingRef.current = [point];
              setDraftDrawing(draftDrawingRef.current);
              return;
            }

            if (
              placementProvinceCode ||
              zoom <= 1 ||
              (event.pointerType === "mouse" && event.button !== 0)
            ) {
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
            const regionPaintingGesture = regionPaintingGestureRef.current;
            if (
              regionPaintingGesture &&
              regionPaintingGesture.pointerId === event.pointerId
            ) {
              const provinceCode = provinceCodeAtClientPoint(
                event.clientX,
                event.clientY,
              );
              if (
                !provinceCode ||
                regionPaintingGesture.touchedProvinceCodes.has(provinceCode)
              ) {
                return;
              }
              event.preventDefault();
              regionPaintingGesture.touchedProvinceCodes.add(provinceCode);
              applyRegionPainting(
                [provinceCode],
                regionPainterMode === "paint" ? regionPainterColor : null,
                false,
              );
              return;
            }

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
                viewBounds,
              ),
            );
          }}
          onPointerUp={(event) => {
            const regionPaintingGesture = regionPaintingGestureRef.current;
            if (
              regionPaintingGesture &&
              regionPaintingGesture.pointerId === event.pointerId
            ) {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
              onProvinceFillsChange?.(provinceFillsRef.current);
              regionPaintingGestureRef.current = null;
              window.setTimeout(() => {
                suppressMapClickRef.current = false;
              }, 0);
              return;
            }

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
                  drawingTool === "circle" ? drawingFilled : undefined,
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
            if (
              regionPaintingGestureRef.current?.pointerId === event.pointerId
            ) {
              onProvinceFillsChange?.(provinceFillsRef.current);
              regionPaintingGestureRef.current = null;
              suppressMapClickRef.current = false;
            }
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
              const regionFill =
                displayProvinceFills[String(city.plateNumber)];
              const effectiveColor =
                previewColor || regionFill || record?.color || themeColor;

              return (
                <g
                  key={city.id}
                  className={[
                    "province",
                    isSelected ? "province--selected" : "",
                    record ? "province--recorded" : "",
                    regionFill ? "province--region-filled" : "",
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
                  aria-label={`${city.plateNumber.toString().padStart(2, "0")} ${city.name}${record ? ", not eklendi" : ""}${regionFill ? ", bölge rengi eklendi" : ""}`}
                  aria-pressed={isSelected}
                  onClick={(event) => handleProvinceClick(event, city)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      if (regionPainterActive) {
                        applyRegionPainting(
                          [city.plateNumber],
                          regionPainterMode === "paint"
                            ? regionPainterColor
                            : null,
                        );
                      } else if (!placementProvinceCode) {
                        onSelect(city);
                      }
                    }
                  }}
                  style={
                    {
                      "--record-color": effectiveColor,
                      "--region-color": regionFill || themeColor,
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

          <g className="drawing-layer">
            {displayedDrawings.map((drawing) => renderDrawing(drawing))}
            {selectedDrawingBounds &&
              (selectedDrawing && isTransformableDrawing(selectedDrawing) ? (
                <g
                  className="drawing-transform-controls"
                  transform={`rotate(${normalizeLabelRotation(selectedDrawing.rotation)} ${selectedDrawingBounds.x + selectedDrawingBounds.width / 2} ${selectedDrawingBounds.y + selectedDrawingBounds.height / 2})`}
                >
                  <rect
                    className="drawing-selection"
                    x={selectedDrawingBounds.x - 8}
                    y={selectedDrawingBounds.y - 8}
                    width={Math.max(
                      16,
                      selectedDrawingBounds.width + 16,
                    )}
                    height={Math.max(
                      16,
                      selectedDrawingBounds.height + 16,
                    )}
                    rx="7"
                  />
                  <g
                    className="map-label-resize-handle"
                    onDoubleClick={(event) =>
                      resetDrawingTextSize(event, selectedDrawing)
                    }
                    onPointerDown={(event) =>
                      startDrawingTextResize(
                        event,
                        selectedDrawing,
                        selectedDrawingBounds,
                      )
                    }
                    onPointerMove={resizeDrawingText}
                    onPointerUp={(event) =>
                      finishDrawingTextResize(event)
                    }
                    onPointerCancel={(event) =>
                      finishDrawingTextResize(event, true)
                    }
                  >
                    <title>
                      Köşeyi çekerek boyutlandır · Çift tıklayarak normal
                      boyuta döndür
                    </title>
                    <rect
                      className="map-control-hit"
                      x={
                        selectedDrawingBounds.x +
                        selectedDrawingBounds.width
                      }
                      y={
                        selectedDrawingBounds.y +
                        selectedDrawingBounds.height
                      }
                      width={LABEL_RESIZE_HANDLE_SIZE}
                      height={LABEL_RESIZE_HANDLE_SIZE}
                      rx="2"
                    />
                    <rect
                      x={
                        selectedDrawingBounds.x +
                        selectedDrawingBounds.width
                      }
                      y={
                        selectedDrawingBounds.y +
                        selectedDrawingBounds.height
                      }
                      width={LABEL_RESIZE_HANDLE_SIZE}
                      height={LABEL_RESIZE_HANDLE_SIZE}
                      rx="2"
                    />
                    <path
                      d={`M ${selectedDrawingBounds.x + selectedDrawingBounds.width + 2} ${selectedDrawingBounds.y + selectedDrawingBounds.height + 6} L ${selectedDrawingBounds.x + selectedDrawingBounds.width + 6} ${selectedDrawingBounds.y + selectedDrawingBounds.height + 2} M ${selectedDrawingBounds.x + selectedDrawingBounds.width + 5} ${selectedDrawingBounds.y + selectedDrawingBounds.height + 6} L ${selectedDrawingBounds.x + selectedDrawingBounds.width + 6} ${selectedDrawingBounds.y + selectedDrawingBounds.height + 5}`}
                    />
                  </g>
                  <g
                    className="map-label-rotate-handle"
                    onDoubleClick={(event) =>
                      resetDrawingTextRotation(event, selectedDrawing)
                    }
                    onPointerDown={(event) =>
                      startDrawingTextRotation(
                        event,
                        selectedDrawing,
                        selectedDrawingBounds,
                      )
                    }
                    onPointerMove={rotateDrawingText}
                    onPointerUp={(event) =>
                      finishDrawingTextRotation(event)
                    }
                    onPointerCancel={(event) =>
                      finishDrawingTextRotation(event, true)
                    }
                  >
                    <title>
                      Sürükleyerek döndür · Çift tıklayarak düz konuma
                      döndür
                    </title>
                    <circle
                      className="map-control-hit"
                      cx={
                        selectedDrawingBounds.x +
                        selectedDrawingBounds.width / 2
                      }
                      cy={
                        selectedDrawingBounds.y -
                        rotateHandleDistance -
                        8
                      }
                      r="5"
                    />
                    <line
                      x1={
                        selectedDrawingBounds.x +
                        selectedDrawingBounds.width / 2
                      }
                      y1={selectedDrawingBounds.y - 8}
                      x2={
                        selectedDrawingBounds.x +
                        selectedDrawingBounds.width / 2
                      }
                      y2={
                        selectedDrawingBounds.y -
                        rotateHandleDistance -
                        3
                      }
                    />
                    <circle
                      cx={
                        selectedDrawingBounds.x +
                        selectedDrawingBounds.width / 2
                      }
                      cy={
                        selectedDrawingBounds.y -
                        rotateHandleDistance -
                        8
                      }
                      r="5"
                    />
                  </g>
                </g>
              ) : (
                <rect
                  className="drawing-selection"
                  x={selectedDrawingBounds.x - 8}
                  y={selectedDrawingBounds.y - 8}
                  width={Math.max(16, selectedDrawingBounds.width + 16)}
                  height={Math.max(
                    16,
                    selectedDrawingBounds.height + 16,
                  )}
                  rx="7"
                />
              ))}
            {isDrawingTool(drawingTool) &&
              draftDrawing.length > 0 &&
              renderDrawing(
                {
                  id: "draft",
                  tool: drawingTool,
                  color: drawingColor,
                  size: normalizeDrawingSize(drawingSize),
                  filled:
                    drawingTool === "circle" ? drawingFilled : undefined,
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
            <g className="annotation-layer">
              {records.map((record) => {
                const center = centers[record.provinceCode];
                const label = (record.items[0]?.text || record.title).trim();
                if (!center || !label) return null;

                const labelLines = wrapManualNoteLabel(label);
                const longestLine = Math.max(
                  ...labelLines.map((line) => line.length),
                );
                const scale =
                  resizingProvinceLabel?.recordId === record.id
                    ? resizingProvinceLabel.scale
                    : normalizeLabelScale(record.labelScale);
                const rotation =
                  rotatingProvinceLabel?.recordId === record.id
                    ? rotatingProvinceLabel.rotation
                    : normalizeLabelRotation(record.labelRotation);
                const width =
                  Math.max(42, longestLine * 6.5 + 18) * scale;
                const height =
                  (12 + labelLines.length * 10) * scale;
                const labelCenterX = Math.min(
                  viewBounds.x + viewBounds.width - width / 2 - 8,
                  Math.max(
                    viewBounds.x + width / 2 + 8,
                    center.x,
                  ),
                );
                const automaticOffset = {
                  x: labelCenterX - center.x - width / 2,
                  y: 12,
                };
                const requestedOffset =
                  rotatingProvinceLabel?.recordId === record.id
                    ? rotatingProvinceLabel.offset
                    : resizingProvinceLabel?.recordId === record.id
                    ? resizingProvinceLabel.offset
                    : movingProvinceLabel?.recordId === record.id
                    ? movingProvinceLabel.offset
                    : record.labelOffset ?? automaticOffset;
                const rectX =
                  Math.max(
                    viewBounds.x + 8,
                    Math.min(
                      viewBounds.x + viewBounds.width - width - 8,
                      center.x + requestedOffset.x,
                    ),
                  ) - center.x;
                const rectY =
                  Math.max(
                    viewBounds.y + 8,
                    Math.min(
                      viewBounds.y + viewBounds.height - height - 8,
                      center.y + requestedOffset.y,
                    ),
                  ) - center.y;
                const localLabelX = rectX + width / 2;
                const anchorX = Math.min(
                  rectX + width,
                  Math.max(rectX, 0),
                );
                const anchorY = Math.min(
                  rectY + height,
                  Math.max(rectY, 4),
                );
                const labelInteractive =
                  Boolean(onUpdateRecord) &&
                  !readOnly &&
                  !drawingTool &&
                  !placementProvinceCode;

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
                      x2={rotation === 0 ? anchorX : localLabelX}
                      y2={
                        rotation === 0
                          ? anchorY
                          : rectY + height / 2
                      }
                    />
                    <g
                      className={[
                        "map-annotation__label",
                        labelInteractive
                          ? "map-annotation__label--interactive"
                          : "",
                        movingProvinceLabel?.recordId === record.id
                          ? "is-moving"
                          : "",
                        resizingProvinceLabel?.recordId === record.id
                          ? "is-resizing"
                          : "",
                        rotatingProvinceLabel?.recordId === record.id
                          ? "is-rotating"
                          : "",
                      ].join(" ")}
                      transform={`rotate(${rotation} ${localLabelX} ${rectY + height / 2})`}
                      style={
                        {
                          "--label-font-size": `${9 * scale}px`,
                        } as React.CSSProperties
                      }
                      onClick={(event) => event.stopPropagation()}
                      onDoubleClick={(event) =>
                        resetProvinceLabelPosition(event, record)
                      }
                      onPointerDown={(event) =>
                        startProvinceLabelMove(
                          event,
                          record,
                          center,
                          width,
                          height,
                          { x: rectX, y: rectY },
                        )
                      }
                      onPointerMove={moveProvinceLabel}
                      onPointerUp={(event) =>
                        finishProvinceLabelMove(event)
                      }
                      onPointerCancel={(event) =>
                        finishProvinceLabelMove(event, true)
                      }
                    >
                      {labelInteractive && (
                        <title>
                          Sürükleyerek taşı
                          {record.labelOffset
                            ? " · Çift tıklayarak otomatik konuma döndür"
                            : ""}
                        </title>
                      )}
                      <rect
                        x={rectX}
                        y={rectY}
                        width={width}
                        height={height}
                        rx={7 * scale}
                      />
                      <text
                        x={localLabelX}
                        y={rectY + 15 * scale}
                      >
                        {labelLines.map((line, index) => (
                          <tspan
                            key={`${line}-${index}`}
                            x={localLabelX}
                            dy={index === 0 ? 0 : 10 * scale}
                          >
                            {line}
                          </tspan>
                        ))}
                      </text>
                      {labelInteractive && (
                        <g
                          className="map-label-resize-handle"
                          onDoubleClick={(event) =>
                            resetProvinceLabelSize(event, record)
                          }
                          onPointerDown={(event) =>
                            startProvinceLabelResize(
                              event,
                              record,
                              center,
                              { x: rectX, y: rectY },
                              width,
                              height,
                              scale,
                              rotation,
                            )
                          }
                          onPointerMove={resizeProvinceLabel}
                          onPointerUp={(event) =>
                            finishProvinceLabelResize(event)
                          }
                          onPointerCancel={(event) =>
                            finishProvinceLabelResize(event, true)
                          }
                        >
                          <title>
                            Köşeyi çekerek boyutlandır · Çift tıklayarak
                            normal boyuta döndür
                          </title>
                          <rect
                            className="map-control-hit"
                            x={
                              rectX +
                              width -
                              LABEL_RESIZE_HANDLE_SIZE
                            }
                            y={
                              rectY +
                              height -
                              LABEL_RESIZE_HANDLE_SIZE
                            }
                            width={LABEL_RESIZE_HANDLE_SIZE}
                            height={LABEL_RESIZE_HANDLE_SIZE}
                            rx="2"
                          />
                          <rect
                            x={
                              rectX +
                              width -
                              LABEL_RESIZE_HANDLE_SIZE
                            }
                            y={
                              rectY +
                              height -
                              LABEL_RESIZE_HANDLE_SIZE
                            }
                            width={LABEL_RESIZE_HANDLE_SIZE}
                            height={LABEL_RESIZE_HANDLE_SIZE}
                            rx="2"
                          />
                          <path
                            d={`M ${rectX + width - 6} ${rectY + height - 2} L ${rectX + width - 2} ${rectY + height - 6} M ${rectX + width - 3} ${rectY + height - 2} L ${rectX + width - 2} ${rectY + height - 3}`}
                          />
                        </g>
                      )}
                      {labelInteractive && (
                        <g
                          className="map-label-rotate-handle"
                          onDoubleClick={(event) =>
                            resetProvinceLabelRotation(event, record)
                          }
                          onPointerDown={(event) =>
                            startProvinceLabelRotation(
                              event,
                              record,
                              center,
                              { x: rectX, y: rectY },
                              width,
                              height,
                              rotation,
                            )
                          }
                          onPointerMove={rotateProvinceLabel}
                          onPointerUp={(event) =>
                            finishProvinceLabelRotation(event)
                          }
                          onPointerCancel={(event) =>
                            finishProvinceLabelRotation(event, true)
                          }
                        >
                          <title>
                            Sürükleyerek döndür · Çift tıklayarak düz konuma
                            döndür
                          </title>
                          <circle
                            className="map-control-hit"
                            cx={localLabelX}
                            cy={rectY - rotateHandleDistance}
                            r="5"
                          />
                          <line
                            x1={localLabelX}
                            y1={rectY}
                            x2={localLabelX}
                            y2={rectY - rotateHandleDistance + 5}
                          />
                          <circle
                            cx={localLabelX}
                            cy={rectY - rotateHandleDistance}
                            r="5"
                          />
                        </g>
                      )}
                    </g>
                  </g>
                );
              })}
            </g>
          )}

          {isMountainAtlas && (
            <MountainAtlasLayer
              markers={mountainAtlasMarkers}
              selectedCode={selectedCode}
              showLabels={showLabels}
              onSelectMarker={(marker) => {
                const city = cities.find(
                  (candidate) => candidate.plateNumber === marker.provinceCode,
                );
                if (city) onSelect(city);
              }}
            />
          )}

          <g className="marker-layer">
            {displayedMarkers.map(({ marker, count }) => {
              const position = markerPositions.get(marker.id);
              if (!position) return null;
              const labelLayout = markerLabelLayouts.get(marker.id);
              const visual = getMarkerVisual(marker);
              const shortLabel = shortMarkerLabel(marker.label);
              const labelScale =
                resizingMarkerLabel?.markerId === marker.id
                  ? resizingMarkerLabel.scale
                  : normalizeLabelScale(marker.labelScale);
              const labelRotation =
                rotatingMarkerLabel?.markerId === marker.id
                  ? rotatingMarkerLabel.rotation
                  : normalizeLabelRotation(marker.labelRotation);
              const markerInteractive =
                count === 1 &&
                Boolean(onUpdateMarker) &&
                !readOnly &&
                !drawingTool &&
                !placementProvinceCode;
              const labelInteractive =
                count === 1 &&
                Boolean(onUpdateMarker) &&
                !readOnly &&
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
                    movingMarkerPosition?.markerId === marker.id
                      ? "is-moving"
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
                    if (suppressMarkerClickRef.current) {
                      event.preventDefault();
                      event.stopPropagation();
                      suppressMarkerClickRef.current = false;
                      return;
                    }
                    event.stopPropagation();
                    if (count > 1) {
                      const nextZoom = Math.max(1.4, zoom + 0.4);
                      setZoom(nextZoom);
                      setPan(
                        clampPan(
                          {
                            x:
                              position.x -
                              (viewBounds.x + viewBounds.width / 2),
                            y:
                              position.y -
                              (viewBounds.y + viewBounds.height / 2),
                          },
                          nextZoom,
                          viewBounds,
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
                              (viewBounds.x + viewBounds.width / 2),
                            y:
                              position.y -
                              (viewBounds.y + viewBounds.height / 2),
                          },
                          nextZoom,
                          viewBounds,
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
                      x2={
                        labelRotation === 0
                          ? labelLayout.anchorX - position.x
                          : labelLayout.x -
                            position.x +
                            labelLayout.width / 2
                      }
                      y2={
                        labelRotation === 0
                          ? labelLayout.anchorY - position.y
                          : labelLayout.y -
                            position.y +
                            labelLayout.height / 2
                      }
                    />
                  )}
                  <g
                    className={[
                      "map-marker__body",
                      markerInteractive
                        ? "map-marker__body--interactive"
                        : "",
                    ].join(" ")}
                    onPointerDown={(event) =>
                      startMarkerMove(event, marker, position)
                    }
                    onPointerMove={moveMarker}
                    onPointerUp={(event) => finishMarkerMove(event)}
                    onPointerCancel={(event) =>
                      finishMarkerMove(event, true)
                    }
                  >
                    {markerInteractive && (
                      <title>İşareti sürükleyerek taşı</title>
                    )}
                    <path
                      className="map-marker__pin"
                      d="M0,0 C-3,-6 -13,-12 -13,-23 A13,13 0 1,1 13,-23 C13,-12 3,-6 0,0 Z"
                    />
                    <circle className="map-marker__center" cy="-23" r="8.2" />
                    <g
                      className="map-marker__symbol"
                      transform="translate(-6 -29)"
                    >
                      <CatalogIcon
                        name={visual.icon}
                        size={12}
                        color={marker.color}
                        strokeWidth={2.4}
                      />
                    </g>
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
                        resizingMarkerLabel?.markerId === marker.id
                          ? "is-resizing"
                          : "",
                        rotatingMarkerLabel?.markerId === marker.id
                          ? "is-rotating"
                          : "",
                      ].join(" ")}
                      transform={`rotate(${labelRotation} ${labelLayout.x - position.x + labelLayout.width / 2} ${labelLayout.y - position.y + labelLayout.height / 2})`}
                      style={
                        {
                          "--label-font-size": `${8.5 * labelScale}px`,
                          "--label-font-size-mobile": `${10.5 * labelScale}px`,
                        } as React.CSSProperties
                      }
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
                        rx={6 * labelScale}
                      />
                      <rect
                        className="map-marker__label-accent"
                        x={labelLayout.x - position.x + 2 * labelScale}
                        y={labelLayout.y - position.y + 2 * labelScale}
                        width={4 * labelScale}
                        height={labelLayout.height - 4 * labelScale}
                        rx={2 * labelScale}
                      />
                      <text
                        x={
                          labelLayout.x -
                          position.x +
                          labelLayout.width / 2
                        }
                        y={
                          labelLayout.y -
                          position.y +
                          14 * labelScale
                        }
                      >
                        {shortLabel}
                      </text>
                      {labelInteractive && (
                        <g
                          className="map-label-resize-handle"
                          onDoubleClick={(event) =>
                            resetMarkerLabelSize(event, marker)
                          }
                          onPointerDown={(event) =>
                            startMarkerLabelResize(
                              event,
                              marker,
                              position,
                              labelLayout,
                              labelScale,
                              labelRotation,
                            )
                          }
                          onPointerMove={resizeMarkerLabel}
                          onPointerUp={(event) =>
                            finishMarkerLabelResize(event)
                          }
                          onPointerCancel={(event) =>
                            finishMarkerLabelResize(event, true)
                          }
                        >
                          <title>
                            Köşeyi çekerek boyutlandır · Çift tıklayarak
                            normal boyuta döndür
                          </title>
                          <rect
                            className="map-control-hit"
                            x={
                              labelLayout.x -
                              position.x +
                              labelLayout.width -
                              LABEL_RESIZE_HANDLE_SIZE
                            }
                            y={
                              labelLayout.y -
                              position.y +
                              labelLayout.height -
                              LABEL_RESIZE_HANDLE_SIZE
                            }
                            width={LABEL_RESIZE_HANDLE_SIZE}
                            height={LABEL_RESIZE_HANDLE_SIZE}
                            rx="2"
                          />
                          <rect
                            x={
                              labelLayout.x -
                              position.x +
                              labelLayout.width -
                              LABEL_RESIZE_HANDLE_SIZE
                            }
                            y={
                              labelLayout.y -
                              position.y +
                              labelLayout.height -
                              LABEL_RESIZE_HANDLE_SIZE
                            }
                            width={LABEL_RESIZE_HANDLE_SIZE}
                            height={LABEL_RESIZE_HANDLE_SIZE}
                            rx="2"
                          />
                          <path
                            d={`M ${labelLayout.x - position.x + labelLayout.width - 6} ${labelLayout.y - position.y + labelLayout.height - 2} L ${labelLayout.x - position.x + labelLayout.width - 2} ${labelLayout.y - position.y + labelLayout.height - 6} M ${labelLayout.x - position.x + labelLayout.width - 3} ${labelLayout.y - position.y + labelLayout.height - 2} L ${labelLayout.x - position.x + labelLayout.width - 2} ${labelLayout.y - position.y + labelLayout.height - 3}`}
                          />
                        </g>
                      )}
                      {labelInteractive && (
                        <g
                          className="map-label-rotate-handle"
                          onDoubleClick={(event) =>
                            resetMarkerLabelRotation(event, marker)
                          }
                          onPointerDown={(event) =>
                            startMarkerLabelRotation(
                              event,
                              marker,
                              position,
                              labelLayout,
                              labelRotation,
                            )
                          }
                          onPointerMove={rotateMarkerLabel}
                          onPointerUp={(event) =>
                            finishMarkerLabelRotation(event)
                          }
                          onPointerCancel={(event) =>
                            finishMarkerLabelRotation(event, true)
                          }
                        >
                          <title>
                            Sürükleyerek döndür · Çift tıklayarak düz konuma
                            döndür
                          </title>
                          <circle
                            className="map-control-hit"
                            cx={
                              labelLayout.x -
                              position.x +
                              labelLayout.width / 2
                            }
                            cy={
                              labelLayout.y -
                              position.y -
                              rotateHandleDistance
                            }
                            r="5"
                          />
                          <line
                            x1={
                              labelLayout.x -
                              position.x +
                              labelLayout.width / 2
                            }
                            y1={labelLayout.y - position.y}
                            x2={
                              labelLayout.x -
                              position.x +
                              labelLayout.width / 2
                            }
                            y2={
                              labelLayout.y -
                              position.y -
                              rotateHandleDistance +
                              5
                            }
                          />
                          <circle
                            cx={
                              labelLayout.x -
                              position.x +
                              labelLayout.width / 2
                            }
                            cy={
                              labelLayout.y -
                              position.y -
                              rotateHandleDistance
                            }
                            r="5"
                          />
                        </g>
                      )}
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {!exportMode && !readOnly && regionPainterActive && (
          <RegionPainterPanel
            color={regionPainterColor}
            fills={displayProvinceFills}
            mode={regionPainterMode}
            onApply={(provinceCodes, fill) =>
              applyRegionPainting(provinceCodes, fill)
            }
            onClose={() => setRegionPainterActive(false)}
            onColorChange={setRegionPainterColor}
            onModeChange={setRegionPainterMode}
          />
        )}

        {!exportMode && !readOnly && (
          <div className="drawing-toolbar" aria-label="Harita çizim araçları">
            <button
              type="button"
              className={regionPainterActive ? "is-active" : ""}
              title="Bölge boyama"
              aria-label="Bölge boyama"
              aria-pressed={regionPainterActive}
              onClick={() => {
                const nextActive = !regionPainterActive;
                setRegionPainterActive(nextActive);
                if (nextActive) onDrawingToolChange?.(null);
              }}
            >
              <Paintbrush size={15} />
            </button>
            <span className="drawing-toolbar__divider" />
            {mountainToolsEnabled && (
              <>
                <div
                  className="mountain-shape-tools"
                  role="group"
                  aria-label="Dağ şekilleri"
                >
                  {MOUNTAIN_SHAPE_TOOLS.map(({ tool, label }) => (
                    <button
                      key={tool}
                      type="button"
                      className={drawingTool === tool ? "is-active" : ""}
                      title={`${formationLabel(tool)} yerleştir`}
                      aria-label={label}
                      onClick={() => {
                        setRegionPainterActive(false);
                        onDrawingToolChange?.(
                          drawingTool === tool ? null : tool,
                        );
                      }}
                    >
                      <svg viewBox="-34 -43 68 48" aria-hidden="true">
                        <MountainGlyph formation={tool} />
                      </svg>
                    </button>
                  ))}
                </div>
                <span className="drawing-toolbar__divider" />
              </>
            )}
            {[
              {
                tool: "select" as const,
                label: "Seç ve taşı",
                icon: MousePointer2,
              },
              { tool: "pen" as const, label: "Kalem", icon: Pencil },
              { tool: "line" as const, label: "Düz çizgi", icon: Minus },
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
                onClick={() => {
                  setRegionPainterActive(false);
                  onDrawingToolChange?.(drawingTool === tool ? null : tool);
                }}
              >
                <Icon size={15} />
              </button>
            ))}
            {!regionPainterActive && (
              <>
                <span className="drawing-toolbar__divider" />
                {(drawingTool === "pen" ||
                  drawingTool === "text" ||
                  (drawingTool !== null &&
                    isMountainFormation(drawingTool))) && (
                  <>
                    <div
                      className="drawing-toolbar__size"
                      title={
                        drawingTool === "pen"
                          ? "Kalem kalınlığı"
                          : drawingTool === "text"
                            ? "Yazı boyutu"
                            : "Dağ şekli boyutu"
                      }
                    >
                      <button
                        type="button"
                        aria-label={
                          drawingTool === "pen"
                            ? "Kalemi incelt"
                            : drawingTool === "text"
                              ? "Yazıyı küçült"
                              : "Dağ şeklini küçült"
                        }
                        disabled={
                          normalizeDrawingSize(
                            drawingSize,
                            minimumDrawingSize(drawingTool),
                          ) <= minimumDrawingSize(drawingTool)
                        }
                        onClick={() =>
                          onDrawingSizeChange?.(
                            Math.max(
                              minimumDrawingSize(drawingTool),
                              normalizeDrawingSize(
                                drawingSize,
                                minimumDrawingSize(drawingTool),
                              ) -
                                DRAWING_SIZE_STEP,
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
                            : drawingTool === "text"
                              ? "Seçili yazı boyutu"
                              : "Seçili dağ şekli boyutu"
                        }
                      >
                        {normalizeDrawingSize(
                          drawingSize,
                          minimumDrawingSize(drawingTool),
                        )}×
                      </output>
                      <button
                        type="button"
                        aria-label={
                          drawingTool === "pen"
                            ? "Kalemi kalınlaştır"
                            : drawingTool === "text"
                              ? "Yazıyı büyüt"
                              : "Dağ şeklini büyüt"
                        }
                        disabled={
                          normalizeDrawingSize(
                            drawingSize,
                            minimumDrawingSize(drawingTool),
                          ) >= DRAWING_SIZE_MAX
                        }
                        onClick={() =>
                          onDrawingSizeChange?.(
                            Math.min(
                              DRAWING_SIZE_MAX,
                              normalizeDrawingSize(
                                drawingSize,
                                minimumDrawingSize(drawingTool),
                              ) +
                                DRAWING_SIZE_STEP,
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
                    onChange={(event) =>
                      onDrawingColorChange?.(event.target.value)
                    }
                  />
                </label>
                {drawingTool === "circle" && (
                  <button
                    type="button"
                    className={drawingFilled ? "is-active" : ""}
                    title={
                      drawingFilled
                        ? "Daire dolgusunu kapat"
                        : "Daire dolgusunu aç"
                    }
                    aria-label={
                      drawingFilled
                        ? "Daire dolgusunu kapat"
                        : "Daire dolgusunu aç"
                    }
                    aria-pressed={drawingFilled}
                    onClick={() => onDrawingFilledChange?.(!drawingFilled)}
                  >
                    <Circle
                      size={15}
                      fill={drawingFilled ? "currentColor" : "none"}
                    />
                  </button>
                )}
                <button
                  type="button"
                  title="Son çizimi geri al"
                  onClick={onUndoDrawing}
                >
                  <Undo2 size={15} />
                </button>
                <button
                  type="button"
                  title="Bütün çizimleri sil"
                  onClick={onClearDrawings}
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        )}

        {!exportMode && !isMountainAtlas && markerLegend.length > 0 && (
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
                disabled={zoom >= maximumZoom}
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
                title={
                  nativeFullscreen || fallbackFullscreen
                    ? "Tam ekrandan çık"
                    : "Haritayı tam ekran yap"
                }
                aria-label={
                  nativeFullscreen || fallbackFullscreen
                    ? "Tam ekrandan çık"
                    : "Haritayı tam ekran yap"
                }
                aria-pressed={nativeFullscreen || fallbackFullscreen}
                onClick={() => void toggleFullscreen()}
              >
                {nativeFullscreen || fallbackFullscreen ? (
                  <Minimize2 size={17} />
                ) : (
                  <Maximize2 size={17} />
                )}
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
