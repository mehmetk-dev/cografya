export type StudyMap = {
  id: string;
  sourceSetId?: string;
  folderId?: string;
  name: string;
  description: string;
  themeColor: string;
  showLabels: boolean;
  showProvinceNames?: boolean;
  hiddenMarkerKinds?: MarkerKind[];
  createdAt: string;
  updatedAt: string;
};

export type MapFolder = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type ProvinceItem = {
  id: string;
  text: string;
  category: string;
};

export type ProvinceRecord = {
  id: string;
  mapId: string;
  provinceCode: number;
  provinceName: string;
  title: string;
  note: string;
  color: string;
  items: ProvinceItem[];
  labelOffset?: MapPoint;
  labelScale?: number;
  labelRotation?: number;
  updatedAt: string;
};

export type MarkerKind =
  | "mountain"
  | "plain"
  | "agriculture"
  | "river"
  | "lake"
  | "mine"
  | "energy"
  | "tourism"
  | "city"
  | "custom";

export type MarkerSubtype = string;

export type MapMarker = {
  id: string;
  mapId: string;
  provinceCode: number;
  provinceName: string;
  x: number;
  y: number;
  label: string;
  description: string;
  kind: MarkerKind;
  subtype?: MarkerSubtype;
  color: string;
  anchoredToProvince?: boolean;
  image?: string;
  topic?: string;
  place?: string;
  relation?: string;
  presetItemId?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  labelOffset?: MapPoint;
  labelScale?: number;
  labelRotation?: number;
  createdAt: string;
};

export type MarkerDraft = Pick<
  MapMarker,
  "label" | "description" | "kind" | "subtype" | "color"
>;

export type DrawingTool = "pen" | "arrow" | "circle" | "text";
export type DrawingMode = DrawingTool | "select" | "eraser";

export type MapPoint = {
  x: number;
  y: number;
};

export type MapDrawing = {
  id: string;
  mapId: string;
  tool: DrawingTool;
  color: string;
  size?: number;
  points: MapPoint[];
  text?: string;
  createdAt: string;
};

export type QuizStats = {
  id: string;
  mapId: string;
  sessions: number;
  totalAnswered: number;
  correctAnswers: number;
  bestStreak: number;
  updatedAt: string;
};

export type QuizMode = "standard" | "daily" | "mistakes" | "mixed";

export type QuizAnswerResult = {
  questionId: string;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  selectedAnswer: string;
  explanation: string;
  correct: boolean;
  streak: number;
};

export type QuizMistake = {
  id: string;
  questionId: string;
  mapId: string;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  selectedAnswer: string;
  explanation: string;
  mistakeCount: number;
  lastAnsweredAt: string;
};

export type DailyProgress = {
  date: string;
  answered: number;
  correct: number;
  completed: boolean;
  updatedAt: string;
};

export type MapBackup = {
  version: 1 | 2 | 3;
  exportedAt: string;
  map: StudyMap;
  records: ProvinceRecord[];
  markers?: MapMarker[];
  drawings?: MapDrawing[];
};

export type City = {
  id: string;
  plateNumber: number;
  name: string;
  path: string;
};
