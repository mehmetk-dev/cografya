import { useEffect, useMemo, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  CheckCircle2,
  Download,
  EllipsisVertical,
  Eye,
  EyeOff,
  FileUp,
  ImageDown,
  LoaderCircle,
  LockKeyhole,
  MapPinned,
  PencilLine,
  Search,
} from "lucide-react";
import { toBlob } from "html-to-image";
import { db, createBlankMap } from "./db";
import { downloadImageBlob } from "./imageDownload";
import { MapSidebar } from "./components/MapSidebar";
import {
  TurkeyMap,
  turkeyCities,
} from "./components/TurkeyMap";
import { ProvinceEditor } from "./components/ProvinceEditor";
import { ExportPoster } from "./components/ExportPoster";
import { FeatureBar } from "./components/FeatureBar";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { QuizModal } from "./components/QuizModal";
import { StudyCenterModal } from "./components/StudyCenterModal";
import { StudyNotesPage } from "./components/StudyNotesPage";
import { StatsModal } from "./components/StatsModal";
import { ReadySetOverview } from "./components/ReadySetOverview";
import { createId } from "./id";
import { getMarkerVisual } from "./markerKinds";
import {
  getReadySet,
  READY_STUDY_SETS,
  type ReadyStudySet,
} from "./readySets";
import type {
  City,
  DailyProgress,
  DrawingMode,
  DrawingTool,
  MapDrawing,
  MapFolder,
  MapMarker,
  MapBackup,
  MarkerDraft,
  MarkerKind,
  ProvinceRecord,
  QuizAnswerResult,
  QuizMode,
  QuizStats,
  StudyMap,
} from "./types";

const ACTIVE_MAP_KEY = "cografya-atlasim-active-map";
const STUDY_NOTES_HASH = "#konu-notlari";

function dateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dailyStreak(progress: DailyProgress[]) {
  const completedDates = new Set(
    progress.filter((entry) => entry.completed).map((entry) => entry.date),
  );
  const cursor = new Date();

  if (!completedDates.has(dateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (completedDates.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function isMapBackup(value: unknown): value is MapBackup {
  if (!value || typeof value !== "object") return false;

  const backup = value as Partial<MapBackup>;
  return (
    (backup.version === 1 || backup.version === 2 || backup.version === 3) &&
    Boolean(backup.map) &&
    typeof backup.map?.name === "string" &&
    Array.isArray(backup.records) &&
    (backup.markers === undefined || Array.isArray(backup.markers)) &&
    (backup.drawings === undefined || Array.isArray(backup.drawings))
  );
}

function safeFileName(name: string) {
  return name
    .toLocaleLowerCase("tr-TR")
    .replace(/[çÇ]/g, "c")
    .replace(/[ğĞ]/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o")
    .replace(/[şŞ]/g, "s")
    .replace(/[üÜ]/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const EXPORTED_SVG_STYLE_PROPERTIES = [
  "color",
  "display",
  "fill",
  "fill-opacity",
  "filter",
  "font-family",
  "font-size",
  "font-style",
  "font-weight",
  "letter-spacing",
  "opacity",
  "paint-order",
  "stroke",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-opacity",
  "stroke-width",
  "text-anchor",
  "vector-effect",
  "visibility",
] as const;

function freezeExportSvgStyles(root: HTMLElement) {
  const elements = Array.from(
    root.querySelectorAll<SVGElement>("svg, svg *"),
  );
  const previousStyles = elements.map((element) => ({
    element,
    style: element.getAttribute("style"),
  }));

  elements.forEach((element) => {
    const computed = window.getComputedStyle(element);
    EXPORTED_SVG_STYLE_PROPERTIES.forEach((property) => {
      const value = computed.getPropertyValue(property);
      if (value) element.style.setProperty(property, value);
    });
  });

  return () => {
    previousStyles.forEach(({ element, style }) => {
      if (style === null) {
        element.removeAttribute("style");
      } else {
        element.setAttribute("style", style);
      }
    });
  };
}

function buildReadySetMarkers(set: ReadyStudySet, mapId: string) {
  const now = new Date().toISOString();
  return set.items.map<MapMarker>((entry) => {
    const city = turkeyCities.find(
      (candidate) => candidate.plateNumber === entry.provinceCode,
    );
    const visual = getMarkerVisual({
      kind: entry.kind,
      subtype: entry.subtype,
      color: "",
    });
    const branches = entry.branches?.length
      ? ` Kolları: ${entry.branches.join(", ")}.`
      : "";

    return {
      id: createId(),
      mapId,
      provinceCode: entry.provinceCode,
      provinceName: city?.name ?? "Türkiye",
      x: 0,
      y: 0,
      label: entry.label,
      description: `${entry.description}${branches}`,
      kind: entry.kind,
      subtype: entry.subtype,
      color: visual.color || set.color,
      anchoredToProvince: true,
      image: entry.image,
      topic: entry.topic,
      place: entry.place,
      relation: entry.relation,
      sourceLabel: entry.sourceLabel,
      sourceUrl: entry.sourceUrl,
      presetItemId: entry.id,
      createdAt: now,
    };
  });
}

function readyMarkerSignature(marker: MapMarker) {
  return JSON.stringify([
    marker.presetItemId,
    marker.provinceCode,
    marker.label,
    marker.description,
    marker.kind,
    marker.subtype,
    marker.color,
    marker.anchoredToProvince,
    marker.x,
    marker.y,
    marker.image,
    marker.topic,
    marker.place,
    marker.relation,
    marker.sourceLabel,
    marker.sourceUrl,
  ]);
}

async function refreshReadySetContent(set: ReadyStudySet, mapId: string) {
  const currentMarkers = await db.mapMarkers
    .where("mapId")
    .equals(mapId)
    .toArray();
  const expectedMarkers = buildReadySetMarkers(set, mapId);
  const presetMarkers = currentMarkers.filter(
    (marker) => Boolean(marker.presetItemId),
  );
  const currentByPresetId = new Map(
    presetMarkers.map((marker) => [marker.presetItemId, marker]),
  );
  const needsRefresh =
    currentMarkers.length !== set.items.length ||
    presetMarkers.length !== set.items.length ||
    expectedMarkers.some((expected) => {
      const current = currentByPresetId.get(expected.presetItemId);
      return (
        !current ||
        readyMarkerSignature(current) !== readyMarkerSignature(expected)
      );
    });
  if (!needsRefresh) return false;

  const refreshedMarkers = expectedMarkers.map((expected) => {
    const current = currentByPresetId.get(expected.presetItemId);
    return {
      ...expected,
      id: current?.id ?? expected.id,
      labelOffset: current?.labelOffset,
    };
  });

  await db.transaction("rw", db.studyMaps, db.mapMarkers, async () => {
    if (currentMarkers.length > 0) {
      await db.mapMarkers.bulkDelete(
        currentMarkers.map((marker) => marker.id),
      );
    }
    await db.mapMarkers.bulkAdd(refreshedMarkers);
    await db.studyMaps.update(mapId, {
      name: set.title,
      description: set.description,
      themeColor: set.color,
      updatedAt: new Date().toISOString(),
    });
  });
  return true;
}

export default function App() {
  const maps = useLiveQuery(() => db.studyMaps.orderBy("updatedAt").reverse().toArray());
  const mapFolders = useLiveQuery(() =>
    db.mapFolders.orderBy("createdAt").toArray(),
  );
  const allRecords = useLiveQuery(() => db.provinceRecords.toArray());
  const allMarkers = useLiveQuery(() => db.mapMarkers.toArray());
  const allDrawings = useLiveQuery(() => db.mapDrawings.toArray());
  const allQuizStats = useLiveQuery(() => db.quizStats.toArray());
  const quizMistakes = useLiveQuery(() =>
    db.quizMistakes.orderBy("lastAnsweredAt").reverse().toArray(),
  );
  const dailyProgressEntries = useLiveQuery(() =>
    db.dailyProgress.orderBy("date").reverse().toArray(),
  );
  const [activeMapId, setActiveMapId] = useState<string | null>(() =>
    localStorage.getItem(ACTIVE_MAP_KEY),
  );
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [mapName, setMapName] = useState("");
  const [toast, setToast] = useState("");
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [readyTopicFilter, setReadyTopicFilter] = useState<string | null>(null);
  const [drawingTool, setDrawingTool] = useState<DrawingMode | null>(null);
  const [drawingColor, setDrawingColor] = useState("#d05f64");
  const [drawingSizes, setDrawingSizes] = useState({
    pen: 1,
    text: 1,
  });
  const [provinceColorPreview, setProvinceColorPreview] = useState<{
    provinceCode: number;
    color: string;
  } | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizMode, setQuizMode] = useState<QuizMode>("standard");
  const [statsOpen, setStatsOpen] = useState(false);
  const [studyCenterOpen, setStudyCenterOpen] = useState(false);
  const [studyCenterTab, setStudyCenterTab] = useState<
    "overview" | "mistakes"
  >("overview");
  const [notesPageOpen, setNotesPageOpen] = useState(
    () => window.location.hash === STUDY_NOTES_HASH,
  );
  const [initializationError, setInitializationError] = useState("");
  const [pendingMarker, setPendingMarker] = useState<{
    provinceCode: number;
    draft: MarkerDraft;
  } | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const exportPosterRef = useRef<HTMLDivElement>(null);
  const mobileActionsRef = useRef<HTMLDivElement>(null);
  const pendingMapActivationRef = useRef<string | null>(null);

  useEffect(() => {
    setProvinceColorPreview(null);
  }, [activeMapId, selectedCity?.plateNumber]);

  const activeMap = maps?.find((map) => map.id === activeMapId);
  const activeReadySet = getReadySet(activeMap?.sourceSetId);
  const personalMaps = useMemo(
    () => (maps ?? []).filter((map) => !map.sourceSetId),
    [maps],
  );
  const activeRecords = useMemo(
    () =>
      (allRecords ?? []).filter((record) => record.mapId === activeMapId),
    [allRecords, activeMapId],
  );
  const activeMarkers = useMemo(
    () =>
      (allMarkers ?? []).filter((marker) => marker.mapId === activeMapId),
    [allMarkers, activeMapId],
  );
  const activeDrawings = useMemo(
    () =>
      (allDrawings ?? []).filter((drawing) => drawing.mapId === activeMapId),
    [allDrawings, activeMapId],
  );
  const activeQuizStats = allQuizStats?.find(
    (stats) => stats.mapId === activeMapId,
  );
  const todayProgress = dailyProgressEntries?.find(
    (entry) => entry.date === dateKey(),
  );
  const currentDailyStreak = dailyStreak(dailyProgressEntries ?? []);
  const mixedQuizMarkers = useMemo(
    () =>
      READY_STUDY_SETS.flatMap((set) =>
        buildReadySetMarkers(set, `mixed-${set.id}`).map((marker) => ({
          ...marker,
          presetItemId: `${set.id}:${marker.presetItemId}`,
        })),
      ),
    [],
  );
  const mixedQuizQuestions = useMemo(
    () =>
      READY_STUDY_SETS.flatMap((set) =>
        set.quizQuestions.map((question) => ({
          ...question,
          id: `${set.id}:${question.id}`,
        })),
      ),
    [],
  );
  const activeSetQuizQuestions = useMemo(
    () =>
      activeReadySet?.quizQuestions.map((question) => ({
        ...question,
        id: `${activeReadySet.id}:${question.id}`,
      })),
    [activeReadySet],
  );
  const mistakeQuizQuestions = useMemo(
    () =>
      (quizMistakes ?? []).map((mistake) => ({
        id: mistake.questionId,
        sourceQuestionId: mistake.questionId,
        prompt: mistake.prompt,
        choices: mistake.choices,
        correctAnswer: mistake.correctAnswer,
        explanation: mistake.explanation,
      })),
    [quizMistakes],
  );
  const visibleMarkers = activeMarkers.filter(
    (marker) =>
      !activeMap?.hiddenMarkerKinds?.includes(marker.kind) &&
      (!readyTopicFilter || marker.topic === readyTopicFilter),
  );
  const activeSetQuizMarkers = useMemo(
    () =>
      activeReadySet
        ? visibleMarkers.map((marker) => ({
            ...marker,
            presetItemId: `${activeReadySet.id}:${marker.presetItemId ?? marker.id}`,
          }))
        : undefined,
    [activeReadySet, visibleMarkers],
  );
  const selectedRecord = selectedCity
    ? activeRecords.find(
        (record) => record.provinceCode === selectedCity.plateNumber,
      )
    : undefined;
  const selectedMarkers = selectedCity
    ? activeMarkers.filter(
        (marker) => marker.provinceCode === selectedCity.plateNumber,
      )
    : [];
  const matchingProvinceCodes = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("tr-TR");
    if (!search) return null;

    return new Set(
      turkeyCities
        .filter((city) => {
          const record = activeRecords.find(
            (entry) => entry.provinceCode === city.plateNumber,
          );
          const markers = activeMarkers.filter(
            (marker) => marker.provinceCode === city.plateNumber,
          );
          const searchable = [
            city.name,
            record?.title,
            record?.note,
            ...(record?.items.flatMap((item) => [item.text, item.category]) ??
              []),
            ...markers.flatMap((marker) => [
              marker.label,
              marker.description,
              marker.topic,
              marker.place,
              marker.relation,
              marker.sourceLabel,
              getMarkerVisual(marker).label,
            ]),
          ]
            .filter(Boolean)
            .join(" ")
            .toLocaleLowerCase("tr-TR");
          return searchable.includes(search);
        })
        .map((city) => city.plateNumber),
    );
  }, [query, activeRecords, activeMarkers]);

  const recordCounts = useMemo(
    () => {
      const provinceSets = new Map<string, Set<number>>();

      (allRecords ?? []).forEach((record) => {
        const set = provinceSets.get(record.mapId) ?? new Set<number>();
        set.add(record.provinceCode);
        provinceSets.set(record.mapId, set);
      });
      (allMarkers ?? []).forEach((marker) => {
        const set = provinceSets.get(marker.mapId) ?? new Set<number>();
        set.add(marker.provinceCode);
        provinceSets.set(marker.mapId, set);
      });

      return [...provinceSets.entries()].reduce<Record<string, number>>(
        (counts, [mapId, provinces]) => {
          counts[mapId] = provinces.size;
          return counts;
        },
        {},
      );
    },
    [allRecords, allMarkers],
  );

  useEffect(() => {
    let cancelled = false;

    const initializeAtlas = async () => {
      try {
        await db.transaction("rw", db.studyMaps, async () => {
          if ((await db.studyMaps.count()) === 0) {
            const starterMap = createBlankMap("Türkiye Coğrafya Notlarım");
            await db.studyMaps.add(starterMap);
            if (!cancelled) {
              pendingMapActivationRef.current = starterMap.id;
              setActiveMapId(starterMap.id);
            }
          }
        });
      } catch (error) {
        console.error("Atlas başlatılamadı", error);
        if (!cancelled) {
          setInitializationError(
            error instanceof Error
              ? error.message
              : "Tarayıcıdaki yerel kayıt alanı açılamadı.",
          );
        }
      }
    };

    void initializeAtlas();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!maps?.length) return;

    const pendingMapId = pendingMapActivationRef.current;
    if (pendingMapId && maps.some((map) => map.id === pendingMapId)) {
      pendingMapActivationRef.current = null;
    }

    if (!activeMapId) {
      setActiveMapId(maps[0].id);
      return;
    }

    if (maps.some((map) => map.id === activeMapId)) return;
    if (pendingMapId === activeMapId) return;

    setActiveMapId(maps[0].id);
  }, [maps, activeMapId]);

  useEffect(() => {
    if (activeMapId) localStorage.setItem(ACTIVE_MAP_KEY, activeMapId);
  }, [activeMapId]);

  useEffect(() => {
    const syncNotesPage = () => {
      setNotesPageOpen(window.location.hash === STUDY_NOTES_HASH);
    };

    window.addEventListener("hashchange", syncNotesPage);
    window.addEventListener("popstate", syncNotesPage);
    return () => {
      window.removeEventListener("hashchange", syncNotesPage);
      window.removeEventListener("popstate", syncNotesPage);
    };
  }, []);

  useEffect(() => {
    setMapName(activeMap?.name ?? "");
  }, [activeMap?.id, activeMap?.name]);

  useEffect(() => {
    setReadyTopicFilter(
      activeReadySet?.items.find((entry) => entry.topic)?.topic ?? null,
    );
  }, [activeReadySet?.id]);

  useEffect(() => {
    if (!activeReadySet || !activeMap) return;
    void refreshReadySetContent(activeReadySet, activeMap.id);
  }, [activeMap?.id, activeReadySet?.id]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!mobileActionsOpen) return;

    const closeMenu = (event: PointerEvent) => {
      if (!mobileActionsRef.current?.contains(event.target as Node)) {
        setMobileActionsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeMenu);
    return () => document.removeEventListener("pointerdown", closeMenu);
  }, [mobileActionsOpen]);

  const selectMap = (mapId: string) => {
    setActiveMapId(mapId);
    setSelectedCity(null);
    setPendingMarker(null);
    setDrawingTool(null);
    setQuery("");
    setReadyTopicFilter(null);
  };

  const createMap = async (name: string, color: string) => {
    const map = createBlankMap(name, color);
    await db.studyMaps.add(map);
    pendingMapActivationRef.current = map.id;
    setActiveMapId(map.id);
    setSelectedCity(null);
    setPendingMarker(null);
    setDrawingTool(null);
    setToast(`“${name}” oluşturuldu`);
  };

  const createMapFolder = async (name: string) => {
    const now = new Date().toISOString();
    const folder: MapFolder = {
      id: createId(),
      name,
      createdAt: now,
      updatedAt: now,
    };
    await db.mapFolders.add(folder);
    setToast(`“${name}” klasörü oluşturuldu`);
  };

  const renameMapFolder = async (folder: MapFolder, name: string) => {
    await db.mapFolders.update(folder.id, {
      name,
      updatedAt: new Date().toISOString(),
    });
    setToast(`Klasörün adı “${name}” oldu`);
  };

  const deleteMapFolder = async (folder: MapFolder) => {
    const approved = window.confirm(
      `“${folder.name}” klasörünü silmek istiyor musun? İçindeki haritalar silinmeyecek.`,
    );
    if (!approved) return;

    const now = new Date().toISOString();
    await db.transaction("rw", db.studyMaps, db.mapFolders, async () => {
      await db.studyMaps
        .where("folderId")
        .equals(folder.id)
        .modify((map) => {
          delete map.folderId;
          map.updatedAt = now;
        });
      await db.mapFolders.delete(folder.id);
    });
    setToast(`“${folder.name}” klasörü silindi; haritalar Klasörsüz alanına taşındı`);
  };

  const moveMapToFolder = async (
    map: StudyMap,
    folderId: string | undefined,
  ) => {
    const updatedMap = { ...map, updatedAt: new Date().toISOString() };
    if (folderId) {
      updatedMap.folderId = folderId;
    } else {
      delete updatedMap.folderId;
    }
    await db.studyMaps.put(updatedMap);
    const folderName = mapFolders?.find((folder) => folder.id === folderId)?.name;
    setToast(
      folderName
        ? `“${map.name}”, “${folderName}” klasörüne taşındı`
        : `“${map.name}” Klasörsüz alanına taşındı`,
    );
  };

  const duplicateMap = async (map: StudyMap) => {
    const now = new Date().toISOString();
    const copy: StudyMap = {
      ...map,
      id: createId(),
      sourceSetId: undefined,
      name: `${map.name} — Kopya`,
      createdAt: now,
      updatedAt: now,
    };
    const sourceRecords = await db.provinceRecords
      .where("mapId")
      .equals(map.id)
      .toArray();
    const sourceMarkers = await db.mapMarkers
      .where("mapId")
      .equals(map.id)
      .toArray();
    const sourceDrawings = await db.mapDrawings
      .where("mapId")
      .equals(map.id)
      .toArray();
    const copiedRecords = sourceRecords.map((record) => ({
      ...record,
      id: `${copy.id}-${record.provinceCode}`,
      mapId: copy.id,
      items: record.items.map((item) => ({
        ...item,
        id: createId(),
      })),
      updatedAt: now,
    }));
    const copiedMarkers = sourceMarkers.map((marker) => ({
      ...marker,
      id: createId(),
      mapId: copy.id,
      createdAt: now,
    }));
    const copiedDrawings = sourceDrawings.map((drawing) => ({
      ...drawing,
      id: createId(),
      mapId: copy.id,
      createdAt: now,
    }));

    await db.transaction(
      "rw",
      db.studyMaps,
      db.provinceRecords,
      db.mapMarkers,
      db.mapDrawings,
      async () => {
        await db.studyMaps.add(copy);
        await db.provinceRecords.bulkAdd(copiedRecords);
        await db.mapMarkers.bulkAdd(copiedMarkers);
        await db.mapDrawings.bulkAdd(copiedDrawings);
      },
    );

    pendingMapActivationRef.current = copy.id;
    setActiveMapId(copy.id);
    setSelectedCity(null);
    setPendingMarker(null);
    setDrawingTool(null);
    setToast("Harita bütün notlarıyla çoğaltıldı");
  };

  const openReadySet = async (set: ReadyStudySet) => {
    const existing = maps?.find((map) => map.sourceSetId === set.id);
    if (existing) {
      const needsContentRefresh = await refreshReadySetContent(
        set,
        existing.id,
      );
      selectMap(existing.id);
      setToast(
        needsContentRefresh
          ? `“${set.shortTitle}” ayrıntılı MEB içeriğiyle güncellendi`
          : `“${set.shortTitle}” hazır seti açıldı`,
      );
      return;
    }

    const map: StudyMap = {
      ...createBlankMap(set.title, set.color),
      sourceSetId: set.id,
      description: set.description,
    };
    const markers = buildReadySetMarkers(set, map.id);

    await db.transaction("rw", db.studyMaps, db.mapMarkers, async () => {
      await db.studyMaps.add(map);
      await db.mapMarkers.bulkAdd(markers);
    });
    pendingMapActivationRef.current = map.id;
    selectMap(map.id);
    setToast(`${set.items.length} bilgiyle “${set.shortTitle}” seti hazır`);
  };

  const deleteMap = async (map: StudyMap) => {
    const approved = window.confirm(
      `“${map.name}” haritasını ve içindeki bütün notları silmek istiyor musun?`,
    );
    if (!approved) return;

    await db.transaction(
      "rw",
      [
        db.studyMaps,
        db.provinceRecords,
        db.mapMarkers,
        db.mapDrawings,
        db.quizStats,
        db.quizMistakes,
      ],
      async () => {
        await db.provinceRecords.where("mapId").equals(map.id).delete();
        await db.mapMarkers.where("mapId").equals(map.id).delete();
        await db.mapDrawings.where("mapId").equals(map.id).delete();
        await db.quizStats.where("mapId").equals(map.id).delete();
        await db.quizMistakes.where("mapId").equals(map.id).delete();
        await db.studyMaps.delete(map.id);
      },
    );

    const remainingMap = maps?.find((candidate) => candidate.id !== map.id);
    setActiveMapId(remainingMap?.id ?? null);
    setSelectedCity(null);
    setPendingMarker(null);
    setDrawingTool(null);
    setToast("Harita silindi");
  };

  const updateActiveMap = async (patch: Partial<StudyMap>) => {
    if (!activeMap) return;
    await db.studyMaps.update(activeMap.id, {
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  };

  const saveProvince = async (record: ProvinceRecord) => {
    if (activeReadySet) {
      setToast("Hazır seti düzenlemek için önce kişisel kopyasını oluştur");
      return;
    }
    await db.transaction("rw", db.studyMaps, db.provinceRecords, async () => {
      await db.provinceRecords.put(record);
      await db.studyMaps.update(record.mapId, {
        updatedAt: new Date().toISOString(),
      });
    });
    setToast(`${record.provinceName} notları kaydedildi`);
  };

  const deleteProvince = async (record: ProvinceRecord) => {
    if (activeReadySet) return;
    const approved = window.confirm(
      `${record.provinceName} için eklediğin notları silmek istiyor musun?`,
    );
    if (!approved) return;
    await db.provinceRecords.delete(record.id);
    setProvinceColorPreview(null);
    setToast(`${record.provinceName} notları silindi`);
  };

  const placeMarker = async (
    city: City,
    point: { x: number; y: number },
  ) => {
    if (!activeMap || !pendingMarker || activeReadySet) return;

    const marker: MapMarker = {
      id: createId(),
      mapId: activeMap.id,
      provinceCode: city.plateNumber,
      provinceName: city.name,
      x: point.x,
      y: point.y,
      ...pendingMarker.draft,
      createdAt: new Date().toISOString(),
    };

    await db.transaction("rw", db.studyMaps, db.mapMarkers, async () => {
      await db.mapMarkers.add(marker);
      await db.studyMaps.update(activeMap.id, {
        updatedAt: new Date().toISOString(),
      });
    });
    setPendingMarker(null);
    setToast(`${marker.label}, ${city.name} haritasına yerleştirildi`);
  };

  const deleteMarker = async (marker: MapMarker) => {
    if (activeReadySet) return;
    const approved = window.confirm(
      `“${marker.label}” işaretini haritadan silmek istiyor musun?`,
    );
    if (!approved) return;
    await db.mapMarkers.delete(marker.id);
    setToast(`${marker.label} işareti silindi`);
  };

  const updateMarkerPresentation = async (marker: MapMarker) => {
    if (!activeMap || marker.mapId !== activeMap.id) return;
    await db.transaction("rw", db.studyMaps, db.mapMarkers, async () => {
      await db.mapMarkers.put(marker);
      await db.studyMaps.update(activeMap.id, {
        updatedAt: new Date().toISOString(),
      });
    });
  };

  const addDrawing = async (
    tool: DrawingTool,
    points: { x: number; y: number }[],
    text?: string,
    size?: number,
  ) => {
    if (!activeMap || activeReadySet) return;
    const drawing: MapDrawing = {
      id: createId(),
      mapId: activeMap.id,
      tool,
      color: drawingColor,
      size: tool === "pen" || tool === "text" ? size : undefined,
      points,
      text,
      createdAt: new Date().toISOString(),
    };
    await db.mapDrawings.add(drawing);
  };

  const updateDrawing = async (drawing: MapDrawing) => {
    if (!activeMap || activeReadySet || drawing.mapId !== activeMap.id) return;
    await db.transaction("rw", db.studyMaps, db.mapDrawings, async () => {
      await db.mapDrawings.put(drawing);
      await db.studyMaps.update(activeMap.id, {
        updatedAt: new Date().toISOString(),
      });
    });
  };

  const replaceDrawings = async (
    removedIds: string[],
    replacements: MapDrawing[],
  ) => {
    if (!activeMap || activeReadySet || removedIds.length === 0) return;
    await db.transaction("rw", db.studyMaps, db.mapDrawings, async () => {
      await db.mapDrawings.bulkDelete(removedIds);
      if (replacements.length > 0) {
        await db.mapDrawings.bulkPut(replacements);
      }
      await db.studyMaps.update(activeMap.id, {
        updatedAt: new Date().toISOString(),
      });
    });
  };

  const undoDrawing = async () => {
    const latest = [...activeDrawings].sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    )[0];
    if (latest) await db.mapDrawings.delete(latest.id);
  };

  const clearDrawings = async () => {
    if (!activeMap || activeDrawings.length === 0) return;
    const approved = window.confirm(
      "Bu haritadaki bütün çizimleri silmek istiyor musun?",
    );
    if (approved) {
      await db.mapDrawings.where("mapId").equals(activeMap.id).delete();
      setDrawingTool(null);
      setToast("Harita çizimleri temizlendi");
    }
  };

  const startQuiz = async (mode: QuizMode = "standard") => {
    if (!activeMap) return;
    const existing = activeQuizStats;
    const stats: QuizStats = {
      id: activeMap.id,
      mapId: activeMap.id,
      sessions: (existing?.sessions ?? 0) + 1,
      totalAnswered: existing?.totalAnswered ?? 0,
      correctAnswers: existing?.correctAnswers ?? 0,
      bestStreak: existing?.bestStreak ?? 0,
      updatedAt: new Date().toISOString(),
    };
    await db.quizStats.put(stats);
    setQuizMode(mode);
    setStudyCenterOpen(false);
    setQuizOpen(true);
  };

  const saveQuizAnswer = async (result: QuizAnswerResult) => {
    if (!activeMap) return;
    const now = new Date().toISOString();
    const existing =
      (await db.quizStats.get(activeMap.id)) ??
      ({
        id: activeMap.id,
        mapId: activeMap.id,
        sessions: 1,
        totalAnswered: 0,
        correctAnswers: 0,
        bestStreak: 0,
        updatedAt: now,
      } satisfies QuizStats);
    await db.quizStats.put({
      ...existing,
      totalAnswered: existing.totalAnswered + 1,
      correctAnswers: existing.correctAnswers + (result.correct ? 1 : 0),
      bestStreak: Math.max(existing.bestStreak, result.streak),
      updatedAt: now,
    });

    if (result.correct) {
      await db.quizMistakes.delete(result.questionId);
    } else {
      const currentMistake = await db.quizMistakes.get(result.questionId);
      await db.quizMistakes.put({
        id: result.questionId,
        questionId: result.questionId,
        mapId: activeMap.id,
        prompt: result.prompt,
        choices: result.choices,
        correctAnswer: result.correctAnswer,
        selectedAnswer: result.selectedAnswer,
        explanation: result.explanation,
        mistakeCount: (currentMistake?.mistakeCount ?? 0) + 1,
        lastAnsweredAt: now,
      });
    }

    if (quizMode === "daily") {
      const today = dateKey();
      const currentProgress = await db.dailyProgress.get(today);
      if ((currentProgress?.answered ?? 0) < 10) {
        const answered = (currentProgress?.answered ?? 0) + 1;
        await db.dailyProgress.put({
          date: today,
          answered,
          correct:
            (currentProgress?.correct ?? 0) + (result.correct ? 1 : 0),
          completed: answered >= 10,
          updatedAt: now,
        });
      }
    }
  };

  const openStudyCenter = (
    tab: "overview" | "mistakes" = "overview",
  ) => {
    setStudyCenterTab(tab);
    setStudyCenterOpen(true);
  };

  const openNotesPage = () => {
    if (window.location.hash !== STUDY_NOTES_HASH) {
      window.history.pushState(
        { ...window.history.state, notesPage: true },
        "",
        STUDY_NOTES_HASH,
      );
    }
    setNotesPageOpen(true);
  };

  const closeNotesPage = () => {
    if (window.history.state?.notesPage) {
      window.history.back();
      return;
    }

    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
    setNotesPageOpen(false);
  };

  const openStudyCenterFromNotes = () => {
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
    setNotesPageOpen(false);
    openStudyCenter("overview");
  };

  const startMistakeQuiz = () => {
    if (!quizMistakes?.length) {
      setToast("Yanlışlar defterin şu an tertemiz");
      return;
    }
    void startQuiz("mistakes");
  };

  const clearMistakes = async () => {
    const approved = window.confirm(
      "Yanlışlar defterindeki bütün sorular temizlensin mi?",
    );
    if (!approved) return;
    await db.quizMistakes.clear();
    setToast("Yanlışlar defteri temizlendi");
  };

  const toggleMarkerKind = async (kind: MarkerKind) => {
    if (!activeMap) return;
    const hidden = activeMap.hiddenMarkerKinds ?? [];
    await updateActiveMap({
      hiddenMarkerKinds: hidden.includes(kind)
        ? hidden.filter((entry) => entry !== kind)
        : [...hidden, kind],
    });
  };

  const exportMap = async () => {
    if (!activeMap) return;
    const records = await db.provinceRecords
      .where("mapId")
      .equals(activeMap.id)
      .toArray();
    const markers = await db.mapMarkers
      .where("mapId")
      .equals(activeMap.id)
      .toArray();
    const drawings = await db.mapDrawings
      .where("mapId")
      .equals(activeMap.id)
      .toArray();
    const backup: MapBackup = {
      version: 3,
      exportedAt: new Date().toISOString(),
      map: activeMap,
      records,
      markers,
      drawings,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${safeFileName(activeMap.name) || "cografya-haritasi"}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setToast("Harita yedeği indirildi");
  };

  const printMap = () => {
    document.body.classList.add("printing-poster");
    window.setTimeout(() => {
      window.print();
      document.body.classList.remove("printing-poster");
    }, 100);
  };

  const shareMap = async () => {
    if (!activeMap) return;
    const backup: MapBackup = {
      version: 3,
      exportedAt: new Date().toISOString(),
      map: activeMap,
      records: activeRecords,
      markers: activeMarkers,
      drawings: activeDrawings,
    };
    const file = new File(
      [JSON.stringify(backup, null, 2)],
      `${safeFileName(activeMap.name) || "cografya-haritasi"}.json`,
      { type: "application/json" },
    );

    try {
      if (
        navigator.share &&
        (!navigator.canShare || navigator.canShare({ files: [file] }))
      ) {
        await navigator.share({
          title: activeMap.name,
          text: "Coğrafya Atlasım çalışma haritası",
          files: [file],
        });
        setToast("Harita paylaşım menüsüne gönderildi");
        return;
      }

      const url = URL.createObjectURL(file);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.name;
      anchor.click();
      URL.revokeObjectURL(url);
      setToast("Paylaşılabilir harita dosyası indirildi");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      window.alert("Harita paylaşılırken bir hata oluştu.");
    }
  };

  const exportMapImage = async () => {
    if (!activeMap || !exportPosterRef.current) return;

    setIsExportingImage(true);
    let restoreSvgStyles: () => void = () => undefined;
    try {
      await document.fonts.ready;
      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() =>
          window.requestAnimationFrame(() => resolve()),
        );
      });

      restoreSvgStyles = freezeExportSvgStyles(exportPosterRef.current);
      const imageBlob = await toBlob(exportPosterRef.current, {
        backgroundColor: "#f2eee5",
        cacheBust: true,
        pixelRatio: 2,
        style: {
          position: "static",
          top: "0",
          left: "0",
          zIndex: "0",
        },
      });
      if (!imageBlob) {
        throw new Error("PNG verisi oluşturulamadı.");
      }
      downloadImageBlob(
        imageBlob,
        `${safeFileName(activeMap.name) || "cografya-haritasi"}-harita.png`,
      );
      setToast("Harita görseli PNG olarak indirildi");
    } catch (error) {
      console.error("Harita görseli oluşturulamadı", error);
      window.alert(
        "Görsel hazırlanırken bir hata oluştu. Lütfen tekrar deneyin.",
      );
    } finally {
      restoreSvgStyles();
      setIsExportingImage(false);
    }
  };

  const importMap = async (file: File) => {
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!isMapBackup(parsed)) {
        throw new Error("Bu dosya geçerli bir Coğrafya Atlasım yedeği değil.");
      }

      const now = new Date().toISOString();
      const importedMap: StudyMap = {
        ...parsed.map,
        id: createId(),
        folderId: undefined,
        name: `${parsed.map.name} — İçe aktarıldı`,
        createdAt: now,
        updatedAt: now,
      };
      const importedRecords: ProvinceRecord[] = parsed.records
        .filter(
          (record) =>
            record &&
            Number.isInteger(record.provinceCode) &&
            record.provinceCode >= 1 &&
            record.provinceCode <= 81,
        )
        .map((record) => ({
          ...record,
          id: `${importedMap.id}-${record.provinceCode}`,
          mapId: importedMap.id,
          items: Array.isArray(record.items)
            ? record.items.map((item) => ({
                ...item,
                id: createId(),
              }))
            : [],
          updatedAt: now,
        }));
      const importedMarkers: MapMarker[] = (parsed.markers ?? [])
        .filter(
          (marker) =>
            marker &&
            Number.isInteger(marker.provinceCode) &&
            marker.provinceCode >= 1 &&
            marker.provinceCode <= 81 &&
            Number.isFinite(marker.x) &&
            Number.isFinite(marker.y) &&
            typeof marker.label === "string",
        )
        .map((marker) => ({
          ...marker,
          id: createId(),
          mapId: importedMap.id,
          createdAt: now,
        }));
      const importedDrawings: MapDrawing[] = (parsed.drawings ?? [])
        .filter(
          (drawing) =>
            drawing &&
            Array.isArray(drawing.points) &&
            drawing.points.every(
              (point) => Number.isFinite(point.x) && Number.isFinite(point.y),
            ),
        )
        .map((drawing) => ({
          ...drawing,
          id: createId(),
          mapId: importedMap.id,
          createdAt: now,
        }));

      await db.transaction(
        "rw",
        db.studyMaps,
        db.provinceRecords,
        db.mapMarkers,
        db.mapDrawings,
        async () => {
          await db.studyMaps.add(importedMap);
          await db.provinceRecords.bulkPut(importedRecords);
          await db.mapMarkers.bulkPut(importedMarkers);
          await db.mapDrawings.bulkPut(importedDrawings);
        },
      );
      pendingMapActivationRef.current = importedMap.id;
      setActiveMapId(importedMap.id);
      setSelectedCity(null);
      setPendingMarker(null);
      setToast("Harita yedeği başarıyla içe aktarıldı");
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Dosya içe aktarılırken bir hata oluştu.",
      );
    } finally {
      if (importInputRef.current) importInputRef.current.value = "";
    }
  };

  if (initializationError) {
    return (
      <div className="app-loading app-loading--error" role="alert">
        <div className="loading-mark"><MapPinned size={29} /></div>
        <strong>Atlas başlatılamadı</strong>
        <span>{initializationError}</span>
        <button type="button" onClick={() => window.location.reload()}>
          Tekrar dene
        </button>
      </div>
    );
  }

  if (
    !maps ||
    !mapFolders ||
    !allRecords ||
    !allMarkers ||
    !allDrawings ||
    !allQuizStats ||
    !quizMistakes ||
    !dailyProgressEntries ||
    !activeMap
  ) {
    return (
      <div className="app-loading">
        <div className="loading-mark"><MapPinned size={29} /></div>
        <strong>Atlasın hazırlanıyor</strong>
        <span>81 il çalışma alanına yerleştiriliyor…</span>
      </div>
    );
  }

  if (notesPageOpen) {
    return (
      <StudyNotesPage
        onBack={closeNotesPage}
        onOpenStudyCenter={openStudyCenterFromNotes}
      />
    );
  }

  return (
    <div className="app-shell">
      <MapSidebar
        maps={personalMaps}
        folders={mapFolders}
        activeMapId={activeMapId}
        activeReadySetId={activeReadySet?.id}
        recordCounts={recordCounts}
        onSelect={selectMap}
        onCreate={createMap}
        onCreateFolder={createMapFolder}
        onRenameFolder={renameMapFolder}
        onDeleteFolder={deleteMapFolder}
        onMoveMap={moveMapToFolder}
        onDuplicate={duplicateMap}
        onDelete={deleteMap}
        onOpenReadySet={openReadySet}
        onOpenNotes={openNotesPage}
      />

      <main className="workspace" id="map-workspace">
        <header className="workspace-header">
          <div className="map-title">
            <span
              className="map-title__accent"
              style={{ backgroundColor: activeMap.themeColor }}
            />
            <div>
              <span className="eyebrow">
                {activeReadySet ? "SALT OKUNUR DERS SETİ" : "AÇIK HARİTA"}
              </span>
              <div
                className={`editable-title ${activeReadySet ? "editable-title--locked" : ""}`}
              >
                <input
                  value={mapName}
                  readOnly={Boolean(activeReadySet)}
                  maxLength={60}
                  aria-label="Harita adı"
                  onChange={(event) => setMapName(event.target.value)}
                  onBlur={() => {
                    if (activeReadySet) return;
                    const name = mapName.trim();
                    if (name && name !== activeMap.name) {
                      void updateActiveMap({ name });
                    } else {
                      setMapName(activeMap.name);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.currentTarget.blur();
                  }}
                />
                {activeReadySet ? (
                  <LockKeyhole size={15} aria-label="Salt okunur hazır set" />
                ) : (
                  <PencilLine size={15} />
                )}
              </div>
            </div>
          </div>

          <div
            className={`workspace-actions ${
              mobileActionsOpen ? "is-menu-open" : ""
            }`}
            ref={mobileActionsRef}
          >
            <label className="province-search">
              <Search size={16} />
              <select
                value={selectedCity?.plateNumber ?? ""}
                aria-label="İl ara ve seç"
                onChange={(event) => {
                  const city = turkeyCities.find(
                    (candidate) =>
                      candidate.plateNumber === Number(event.target.value),
                  );
                  setSelectedCity(city ?? null);
                  setPendingMarker(null);
                }}
              >
                <option value="">İl seç veya ara</option>
                {turkeyCities.map((city) => (
                  <option key={city.plateNumber} value={city.plateNumber}>
                    {city.plateNumber.toString().padStart(2, "0")} · {city.name}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="mobile-actions-trigger"
              type="button"
              aria-label={
                mobileActionsOpen
                  ? "Harita işlemlerini kapat"
                  : "Harita işlemlerini aç"
              }
              aria-expanded={mobileActionsOpen}
              onClick={() => setMobileActionsOpen((open) => !open)}
            >
              <EllipsisVertical size={21} />
            </button>

            <div className="workspace-actions__menu">
              <button
                className="header-button"
                type="button"
                onClick={() => {
                  void updateActiveMap({
                    showLabels: !activeMap.showLabels,
                  });
                  setMobileActionsOpen(false);
                }}
                title={
                  activeMap.showLabels
                    ? "Harita yazılarını gizle"
                    : "Harita yazılarını göster"
                }
              >
                {activeMap.showLabels ? (
                  <Eye size={17} />
                ) : (
                  <EyeOff size={17} />
                )}
                <span>Yazılar</span>
              </button>

              <button
                className="header-button"
                type="button"
                onClick={() => {
                  importInputRef.current?.click();
                  setMobileActionsOpen(false);
                }}
              >
                <FileUp size={17} />
                <span>İçe aktar</span>
              </button>
              <input
                ref={importInputRef}
                className="visually-hidden"
                type="file"
                accept="application/json,.json"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void importMap(file);
                }}
              />

              <button
                className="header-button header-button--image"
                type="button"
                disabled={isExportingImage}
                onClick={() => {
                  void exportMapImage();
                  setMobileActionsOpen(false);
                }}
              >
                {isExportingImage ? (
                  <LoaderCircle className="spin" size={17} />
                ) : (
                  <ImageDown size={17} />
                )}
                <span>{isExportingImage ? "Hazırlanıyor" : "Görsel al"}</span>
              </button>

              <button
                className="header-button header-button--dark"
                type="button"
                onClick={() => {
                  void exportMap();
                  setMobileActionsOpen(false);
                }}
              >
                <Download size={17} />
                <span>Yedekle</span>
              </button>
            </div>
          </div>
        </header>

        <FeatureBar
          query={query}
          markers={activeMarkers}
          hiddenKinds={activeMap.hiddenMarkerKinds ?? []}
          onQueryChange={setQuery}
          onToggleKind={(kind) => void toggleMarkerKind(kind)}
          onQuiz={() => openStudyCenter("overview")}
          onStats={() => setStatsOpen(true)}
          onPrint={printMap}
          onShare={() => void shareMap()}
        />

        <div className="workspace-body">
          <TurkeyMap
            selectedCode={selectedCity?.plateNumber ?? null}
            records={activeRecords}
            markers={visibleMarkers}
            drawings={activeDrawings}
            themeColor={activeMap.themeColor}
            showLabels={activeMap.showLabels}
            showProvinceNames={
              activeReadySet !== undefined &&
              activeReadySet.id !== "rivers" &&
              activeMap.showLabels
            }
            readOnly={Boolean(activeReadySet)}
            matchingProvinceCodes={matchingProvinceCodes}
            provinceColorPreview={provinceColorPreview}
            drawingTool={drawingTool}
            drawingColor={drawingColor}
            drawingSize={
              drawingTool === "text" ? drawingSizes.text : drawingSizes.pen
            }
            onDrawingToolChange={(tool) => {
              setDrawingTool(tool);
              if (tool) setPendingMarker(null);
            }}
            onDrawingColorChange={setDrawingColor}
            onDrawingSizeChange={(size) => {
              const sizeTool = drawingTool === "text" ? "text" : "pen";
              setDrawingSizes((current) => ({
                ...current,
                [sizeTool]: size,
              }));
            }}
            onAddDrawing={(tool, points, text, size) =>
              void addDrawing(tool, points, text, size)
            }
            onUpdateDrawing={(drawing) => void updateDrawing(drawing)}
            onUpdateMarker={(marker) => void updateMarkerPresentation(marker)}
            onReplaceDrawings={(removedIds, replacements) =>
              void replaceDrawings(removedIds, replacements)
            }
            onUndoDrawing={() => void undoDrawing()}
            onClearDrawings={() => void clearDrawings()}
            onSelect={(city) => {
              setSelectedCity(city);
              setPendingMarker(null);
            }}
            placementProvinceCode={pendingMarker?.provinceCode}
            onPlaceMarker={(city, point) => void placeMarker(city, point)}
            onPlacementMismatch={(city) =>
              setToast(
                `İşaret ${selectedCity?.name} için hazırlandı; ${city.name} içine bırakılamaz`,
              )
            }
          />

          {activeReadySet ? (
            <ReadySetOverview
              set={activeReadySet}
              selectedCity={selectedCity}
              selectedTopic={readyTopicFilter}
              onSelectCity={(city) => {
                setSelectedCity(city);
                setPendingMarker(null);
              }}
              onTopicChange={(topic) => {
                setReadyTopicFilter(topic);
                setSelectedCity(null);
              }}
              onBack={() => setSelectedCity(null)}
              onCopy={() => void duplicateMap(activeMap)}
              onQuiz={() => void startQuiz("standard")}
            />
          ) : (
            <ProvinceEditor
              city={selectedCity}
              record={selectedRecord}
              markers={selectedMarkers}
              themeColor={activeMap.themeColor}
              mapId={activeMap.id}
              placementActive={Boolean(pendingMarker)}
              onClose={() => {
                setSelectedCity(null);
                setPendingMarker(null);
              }}
              onSave={saveProvince}
              onDelete={deleteProvince}
              onColorPreview={(color) => {
                if (!selectedCity) return;
                setProvinceColorPreview({
                  provinceCode: selectedCity.plateNumber,
                  color,
                });
              }}
              onStartPlacement={(draft) => {
                if (!selectedCity) return;
                setPendingMarker({
                  provinceCode: selectedCity.plateNumber,
                  draft,
                });
                setToast(`${selectedCity.name} içinde konum seç`);
              }}
              onCancelPlacement={() => setPendingMarker(null)}
              onDeleteMarker={deleteMarker}
            />
          )}
        </div>
      </main>

      <ExportPoster
        ref={exportPosterRef}
        map={activeMap}
        records={activeRecords}
        markers={visibleMarkers}
        drawings={activeDrawings}
      />

      <QuizModal
        open={quizOpen}
        markers={
          quizMode === "daily" || quizMode === "mixed"
            ? mixedQuizMarkers
            : quizMode === "mistakes"
              ? undefined
              : activeSetQuizMarkers
        }
        factQuestions={
          quizMode === "daily" || quizMode === "mixed"
            ? mixedQuizQuestions
            : quizMode === "mistakes"
              ? mistakeQuizQuestions
              : activeSetQuizQuestions
        }
        setTitle={quizMode === "standard" ? activeReadySet?.shortTitle : undefined}
        mode={quizMode}
        onClose={() => setQuizOpen(false)}
        onAnswer={(result) => void saveQuizAnswer(result)}
      />

      <StudyCenterModal
        open={studyCenterOpen}
        initialTab={studyCenterTab}
        dailyProgress={todayProgress}
        dailyStreak={currentDailyStreak}
        mistakes={quizMistakes}
        onClose={() => setStudyCenterOpen(false)}
        onStartDaily={() => void startQuiz("daily")}
        onStartMixed={() => void startQuiz("mixed")}
        onStartMistakes={startMistakeQuiz}
        onClearMistakes={() => void clearMistakes()}
      />

      <StatsModal
        open={statsOpen}
        mapName={activeMap.name}
        records={activeRecords}
        markers={activeMarkers}
        drawings={activeDrawings}
        quizStats={activeQuizStats}
        onClose={() => setStatsOpen(false)}
      />

      <MobileBottomNav
        mistakeCount={quizMistakes.length}
        dailyCompleted={Boolean(todayProgress?.completed)}
        onMap={() =>
          document
            .querySelector("#map-workspace")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        onSets={() =>
          document
            .querySelector("#ready-library")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        onDaily={() => void startQuiz("daily")}
        onMistakes={() => openStudyCenter("mistakes")}
      />

      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}
