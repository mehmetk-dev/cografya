import { useEffect, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  CloudAlert,
  Copy,
  Folder,
  FolderOpen,
  FolderPen,
  FolderPlus,
  GitBranch,
  Flame,
  Layers3,
  LoaderCircle,
  LogIn,
  LogOut,
  Map,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { useCloudAccount } from "../cloud/CloudAccountContext";
import { READY_STUDY_SETS, type ReadyStudySet } from "../readySets";
import { STUDY_NOTE_TOPICS } from "../studyNotes";
import type { MapFolder, StudyMap } from "../types";
import { CatalogIcon } from "./CatalogIcon";

type MapSidebarProps = {
  maps: StudyMap[];
  folders: MapFolder[];
  activeMapId: string | null;
  activeReadySetId?: string;
  recordCounts: Record<string, number>;
  onSelect: (mapId: string) => void;
  onCreate: (name: string, color: string) => Promise<void>;
  onCreateFolder: (name: string) => Promise<void>;
  onRenameFolder: (folder: MapFolder, name: string) => Promise<void>;
  onDeleteFolder: (folder: MapFolder) => Promise<void>;
  onMoveMap: (map: StudyMap, folderId: string | undefined) => Promise<void>;
  onDuplicate: (map: StudyMap) => Promise<void>;
  onDelete: (map: StudyMap) => Promise<void>;
  onOpenReadySet: (set: ReadyStudySet) => Promise<void>;
  onOpenNotes: () => void;
  onOpenHistory: () => void;
  onOpenAtaturk?: () => void;
};

const PRESETS = [
  { name: "Dağlar", color: "#d46a4c" },
  { name: "Tarım ürünleri", color: "#558c79" },
  { name: "Akarsular", color: "#4778a8" },
  { name: "Madenler", color: "#8a6ead" },
  { name: "Göller", color: "#4d91bd" },
  { name: "İklim tipleri", color: "#d08b35" },
  { name: "Sanayi ve ulaşım", color: "#5b6f69" },
  { name: "Turizm merkezleri", color: "#d05f64" },
];

const MOBILE_SIDEBAR_QUERY = "(max-width: 940px)";
const COLLAPSIBLE_SIDEBAR_QUERY =
  "(max-width: 940px), (min-width: 941px) and (max-height: 720px)";

export function MapSidebar({
  maps,
  folders,
  activeMapId,
  activeReadySetId,
  recordCounts,
  onSelect,
  onCreate,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onMoveMap,
  onDuplicate,
  onDelete,
  onOpenReadySet,
  onOpenNotes,
  onOpenHistory,
  onOpenAtaturk,
}: MapSidebarProps) {
  const cloudAccount = useCloudAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isCollapsibleSidebar, setIsCollapsibleSidebar] = useState(() =>
    window.matchMedia(COLLAPSIBLE_SIDEBAR_QUERY).matches
  );
  const [isMapsExpanded, setIsMapsExpanded] = useState(
    () => !window.matchMedia(COLLAPSIBLE_SIDEBAR_QUERY).matches,
  );
  const [isReadySetsExpanded, setIsReadySetsExpanded] = useState(
    () => !window.matchMedia(MOBILE_SIDEBAR_QUERY).matches,
  );
  const [name, setName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [color, setColor] = useState("#e9a23b");
  const [collapsedFolderIds, setCollapsedFolderIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(COLLAPSIBLE_SIDEBAR_QUERY);
    const mobileMediaQuery = window.matchMedia(MOBILE_SIDEBAR_QUERY);
    const handleChange = () => {
      setIsCollapsibleSidebar(mediaQuery.matches);
      setIsMapsExpanded(!mediaQuery.matches);
      setIsReadySetsExpanded(!mobileMediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    mobileMediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      mobileMediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const isMapsSectionOpen = !isCollapsibleSidebar || isMapsExpanded;
  const isReadySetsSectionOpen =
    !isCollapsibleSidebar || isReadySetsExpanded;
  const readyNoteTopics = STUDY_NOTE_TOPICS.filter(
    (topic) => topic.status === "ready",
  );
  const readyNoteSectionCount = readyNoteTopics.reduce(
    (count, topic) => count + topic.sections.length,
    0,
  );
  const cloudStatus = cloudAccount?.status ?? "synced";
  const cloudStatusTitle = !cloudAccount
    ? "Çevrimdışı / Yerel Mod"
    : cloudStatus === "error"
      ? "Bulut kaydı bekliyor"
      : cloudStatus === "syncing" || cloudStatus === "loading"
        ? "Buluta kaydediliyor"
        : "Buluta kaydedildi";
  const cloudStatusDetail = !cloudAccount
    ? "Veriler tarayıcında saklanıyor"
    : cloudStatus === "error"
      ? "Bu cihazdaki kopya korunuyor"
      : "Telefon ve bilgisayarda aynı";

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    await onCreate(name.trim(), color);
    setName("");
    setColor("#e9a23b");
    setIsCreating(false);
  };

  const createFolder = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanName = folderName.trim();
    if (!cleanName) return;
    await onCreateFolder(cleanName);
    setFolderName("");
    setIsCreatingFolder(false);
  };

  const toggleFolder = (folderId: string) => {
    setCollapsedFolderIds((current) => {
      const next = new Set(current);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const renameFolder = (folder: MapFolder) => {
    const nextName = window.prompt("Klasörün yeni adı:", folder.name)?.trim();
    if (!nextName || nextName === folder.name) return;
    void onRenameFolder(folder, nextName);
  };

  const moveMap = (map: StudyMap, folderId: string | undefined) => {
    if (folderId) {
      setCollapsedFolderIds((current) => {
        const next = new Set(current);
        next.delete(folderId);
        return next;
      });
    }
    void onMoveMap(map, folderId);
  };

  const knownFolderIds = new Set(folders.map((folder) => folder.id));
  const unfiledMaps = maps.filter(
    (map) => !map.folderId || !knownFolderIds.has(map.folderId),
  );

  const renderMapCard = (map: StudyMap) => {
    const active = map.id === activeMapId;
    return (
      <div
        className={`map-card ${active ? "map-card--active" : ""}`}
        key={map.id}
        style={{ "--map-color": map.themeColor } as React.CSSProperties}
      >
        <button
          className="map-card__main"
          type="button"
          onClick={() => onSelect(map.id)}
          aria-current={active ? "page" : undefined}
        >
          <span className="map-card__icon">
            {active ? <BookOpen size={18} /> : <Layers3 size={18} />}
          </span>
          <span className="map-card__copy">
            <strong>{map.name}</strong>
            <small>{recordCounts[map.id] ?? 0} ilde not</small>
          </span>
          {active && <Check className="map-card__check" size={16} />}
        </button>

        {active && (
          <div className="map-card__actions">
            <label className="map-card__folder-select">
              <Folder size={13} />
              <select
                value={
                  map.folderId && knownFolderIds.has(map.folderId)
                    ? map.folderId
                    : ""
                }
                aria-label={`${map.name} haritasının klasörü`}
                onChange={(event) =>
                  moveMap(map, event.target.value || undefined)
                }
              >
                <option value="">Klasörsüz</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => onDuplicate(map)}
              title="Haritayı çoğalt"
              aria-label={`${map.name} haritasını çoğalt`}
            >
              <Copy size={14} /> Çoğalt
            </button>
            {maps.length > 1 && (
              <button
                type="button"
                onClick={() => onDelete(map)}
                title="Haritayı sil"
                aria-label={`${map.name} haritasını sil`}
              >
                <Trash2 size={14} /> Sil
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="map-sidebar" id="study-library">
      <div className="brand">
        <div className="brand__mark">
          <Map size={23} />
          <span />
        </div>
        <div>
          <strong>Coğrafya</strong>
          <span>Atlasım</span>
        </div>
      </div>

      <div className="sidebar-subject-switcher" aria-label="Ders seç">
        <button className="is-active" type="button" aria-current="page">
          <Map size={15} />
          <span>Coğrafya</span>
        </button>
        <button type="button" onClick={onOpenHistory}>
          <GitBranch size={15} />
          <span>Osmanlı</span>
        </button>
        {onOpenAtaturk && (
          <button type="button" onClick={onOpenAtaturk}>
            <Flame size={15} />
            <span>Atatürk</span>
            <small>Yeni</small>
          </button>
        )}
      </div>

      <button
        className="sidebar-notes-button"
        type="button"
        onClick={onOpenNotes}
      >
        <span><BookOpen size={18} /></span>
        <span>
          <small>MEB / KPSS</small>
          <strong>Konu Notları</strong>
          <small>
            {readyNoteTopics.length} konu · {readyNoteSectionCount} bölüm
          </small>
        </span>
        <ChevronDown size={16} />
      </button>

      <button
        className="sidebar-heading sidebar-heading--toggle"
        type="button"
        disabled={!isCollapsibleSidebar}
        aria-expanded={isCollapsibleSidebar ? isMapsExpanded : undefined}
        aria-controls={isCollapsibleSidebar ? "my-maps-content" : undefined}
        onClick={() => setIsMapsExpanded((expanded) => !expanded)}
      >
        <div>
          <span className="eyebrow">KÜTÜPHANE</span>
          <h2>Haritalarım</h2>
        </div>
        <span className="sidebar-heading__meta">
          <span className="map-total">{maps.length}</span>
          <ChevronDown
            className={`sidebar-heading__chevron ${
              isMapsExpanded ? "is-open" : ""
            }`}
            size={18}
          />
        </span>
      </button>

      <div id="my-maps-content" hidden={!isMapsSectionOpen}>
        <div className="map-folder-library">
          {folders.map((folder) => {
            const folderMaps = maps.filter(
              (map) => map.folderId === folder.id,
            );
            const collapsed = collapsedFolderIds.has(folder.id);
            return (
              <section className="map-folder" key={folder.id}>
                <header className="map-folder__header">
                  <button
                    className="map-folder__toggle"
                    type="button"
                    aria-expanded={!collapsed}
                    onClick={() => toggleFolder(folder.id)}
                  >
                    {collapsed ? (
                      <Folder size={15} />
                    ) : (
                      <FolderOpen size={15} />
                    )}
                    <span>{folder.name}</span>
                    <small>{folderMaps.length}</small>
                    <ChevronDown
                      className={collapsed ? "" : "is-open"}
                      size={14}
                    />
                  </button>
                  <div className="map-folder__actions">
                    <button
                      type="button"
                      title="Klasörü yeniden adlandır"
                      aria-label={`${folder.name} klasörünü yeniden adlandır`}
                      onClick={() => renameFolder(folder)}
                    >
                      <FolderPen size={14} />
                    </button>
                    <button
                      type="button"
                      title="Klasörü sil"
                      aria-label={`${folder.name} klasörünü sil`}
                      onClick={() => void onDeleteFolder(folder)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </header>
                {!collapsed && (
                  <div className="map-list map-list--folder">
                    {folderMaps.length > 0 ? (
                      folderMaps.map(renderMapCard)
                    ) : (
                      <p className="map-folder__empty">
                        Bu klasörde henüz harita yok.
                      </p>
                    )}
                  </div>
                )}
              </section>
            );
          })}

          {(folders.length === 0 || unfiledMaps.length > 0) && (
            <section className="map-folder map-folder--unfiled">
              {folders.length > 0 && (
                <header className="map-folder__header">
                  <div className="map-folder__unfiled-title">
                    <Layers3 size={15} />
                    <span>Klasörsüz</span>
                    <small>{unfiledMaps.length}</small>
                  </div>
                </header>
              )}
              <div className="map-list map-list--folder">
                {unfiledMaps.map(renderMapCard)}
              </div>
            </section>
          )}
        </div>

        {isCreatingFolder && (
          <form className="create-folder-card" onSubmit={createFolder}>
            <FolderPlus size={17} />
            <input
              autoFocus
              value={folderName}
              maxLength={40}
              placeholder="Klasör adı"
              onChange={(event) => setFolderName(event.target.value)}
            />
            <button type="submit" aria-label="Klasörü oluştur">
              <Check size={15} />
            </button>
            <button
              type="button"
              aria-label="Klasör oluşturmayı iptal et"
              onClick={() => {
                setFolderName("");
                setIsCreatingFolder(false);
              }}
            >
              <X size={15} />
            </button>
          </form>
        )}

        {isCreating ? (
          <form className="create-map-card" onSubmit={create}>
            <div className="create-map-card__header">
              <strong>Yeni harita</strong>
              <button
                type="button"
                aria-label="Yeni harita formunu kapat"
                onClick={() => setIsCreating(false)}
              >
                <X size={17} />
              </button>
            </div>
            <input
              autoFocus
              value={name}
              maxLength={60}
              placeholder="Haritanın adı"
              onChange={(event) => setName(event.target.value)}
            />
            <div className="preset-list">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  className={name === preset.name ? "is-active" : ""}
                  onClick={() => {
                    setName(preset.name);
                    setColor(preset.color);
                  }}
                >
                  <i style={{ backgroundColor: preset.color }} />
                  {preset.name}
                </button>
              ))}
            </div>
            <button className="button button--primary button--full" type="submit">
              <Plus size={16} /> Haritayı oluştur
            </button>
          </form>
        ) : null}

        {!isCreating && !isCreatingFolder && (
          <div className="map-library-create-actions">
            <button
              className="new-map-button"
              type="button"
              onClick={() => setIsCreating(true)}
            >
              <Plus size={18} />
              Yeni harita
            </button>
            <button
              className="new-folder-button"
              type="button"
              onClick={() => setIsCreatingFolder(true)}
            >
              <FolderPlus size={17} />
              Yeni klasör
            </button>
          </div>
        )}
      </div>

      <div className="ready-library" id="ready-library">
        <button
          className="ready-library__heading ready-library__heading--toggle"
          type="button"
          disabled={!isCollapsibleSidebar}
          aria-expanded={
            isCollapsibleSidebar ? isReadySetsExpanded : undefined
          }
          aria-controls={
            isCollapsibleSidebar ? "ready-library-content" : undefined
          }
          onClick={() => setIsReadySetsExpanded((expanded) => !expanded)}
        >
          <div>
            <span className="eyebrow">DERS KÜTÜPHANESİ</span>
            <h2>Hazır setler</h2>
          </div>
          <span className="ready-library__heading-meta">
            <span>{READY_STUDY_SETS.length}</span>
            <ChevronDown
              className={`ready-library__heading-chevron ${
                isReadySetsExpanded ? "is-open" : ""
              }`}
              size={18}
            />
          </span>
        </button>
        <div
          className="ready-library__content"
          id="ready-library-content"
          hidden={!isReadySetsSectionOpen}
        >
          <div className="ready-library__list">
            {READY_STUDY_SETS.map((set) => {
              const active = activeReadySetId === set.id;
              return (
                <button
                  type="button"
                  key={set.id}
                  className={active ? "is-active" : ""}
                  style={{ "--set-color": set.color } as React.CSSProperties}
                  onClick={() => {
                    void onOpenReadySet(set);
                    if (isCollapsibleSidebar) setIsReadySetsExpanded(false);
                  }}
                >
                  <i>
                    <CatalogIcon name={set.icon} size={16} color="#fff" />
                  </i>
                  <span>
                    <strong>{set.shortTitle}</strong>
                    <small>
                      {set.workspaceMode === "manual"
                        ? "Simgeleri kendin ekle"
                        : `${set.items.length} hazır bilgi`}
                    </small>
                  </span>
                  <BookOpen size={14} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div
          className={`autosave-indicator autosave-indicator--${cloudStatus}`}
          aria-live="polite"
        >
          <span />
          <div>
            <strong>{cloudStatusTitle}</strong>
            <small>{cloudStatusDetail}</small>
          </div>
        </div>
        {cloudAccount ? (
          <div className="sidebar-account-actions">
            {cloudAccount.status === "error" && (
              <button
                className="sidebar-account-button sidebar-account-button--retry"
                type="button"
                title="Senkronizasyonu yeniden dene"
                aria-label="Senkronizasyonu yeniden dene"
                onClick={() => void cloudAccount.retrySync()}
              >
                <CloudAlert size={15} />
                <RefreshCw size={13} />
              </button>
            )}
            <button
              className="sidebar-account-button sidebar-account-button--signout"
              type="button"
              disabled={cloudAccount.signingOut}
              onClick={() => void cloudAccount.signOut()}
            >
              {cloudAccount.signingOut ? (
                <LoaderCircle className="spin" size={15} />
              ) : (
                <LogOut size={15} />
              )}
              <span>
                {cloudAccount.signingOut ? "Çıkış yapılıyor" : "Çıkış yap"}
              </span>
            </button>
          </div>
        ) : (
          <div className="sidebar-account-actions">
            <button
              className="sidebar-account-button"
              type="button"
              title="Giriş ekranına dön / Bulut hesabı bağla"
              onClick={() => {
                window.localStorage.removeItem("cografya_guest_mode_enabled");
                window.dispatchEvent(new Event("cografya_guest_mode_reset"));
              }}
            >
              <LogIn size={15} />
              <span>Giriş</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
