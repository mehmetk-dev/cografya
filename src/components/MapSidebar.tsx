import { useEffect, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  CloudAlert,
  Copy,
  Layers3,
  LoaderCircle,
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
import type { StudyMap } from "../types";
import { CatalogIcon } from "./CatalogIcon";

type MapSidebarProps = {
  maps: StudyMap[];
  activeMapId: string | null;
  activeReadySetId?: string;
  recordCounts: Record<string, number>;
  onSelect: (mapId: string) => void;
  onCreate: (name: string, color: string) => Promise<void>;
  onDuplicate: (map: StudyMap) => Promise<void>;
  onDelete: (map: StudyMap) => Promise<void>;
  onOpenReadySet: (set: ReadyStudySet) => Promise<void>;
  onOpenNotes: () => void;
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

export function MapSidebar({
  maps,
  activeMapId,
  activeReadySetId,
  recordCounts,
  onSelect,
  onCreate,
  onDuplicate,
  onDelete,
  onOpenReadySet,
  onOpenNotes,
}: MapSidebarProps) {
  const cloudAccount = useCloudAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [isMobileSidebar, setIsMobileSidebar] = useState(() =>
    window.matchMedia(MOBILE_SIDEBAR_QUERY).matches
  );
  const [isMapsExpanded, setIsMapsExpanded] = useState(
    () => !window.matchMedia(MOBILE_SIDEBAR_QUERY).matches,
  );
  const [isReadySetsExpanded, setIsReadySetsExpanded] = useState(
    () => !window.matchMedia(MOBILE_SIDEBAR_QUERY).matches,
  );
  const [name, setName] = useState("");
  const [color, setColor] = useState("#e9a23b");

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_SIDEBAR_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobileSidebar(event.matches);
      setIsMapsExpanded(!event.matches);
      setIsReadySetsExpanded(!event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const isMapsSectionOpen = !isMobileSidebar || isMapsExpanded;
  const isReadySetsSectionOpen =
    !isMobileSidebar || isReadySetsExpanded;
  const readyNoteTopics = STUDY_NOTE_TOPICS.filter(
    (topic) => topic.status === "ready",
  );
  const readyNoteSectionCount = readyNoteTopics.reduce(
    (count, topic) => count + topic.sections.length,
    0,
  );

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    await onCreate(name.trim(), color);
    setName("");
    setColor("#e9a23b");
    setIsCreating(false);
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
        disabled={!isMobileSidebar}
        aria-expanded={isMobileSidebar ? isMapsExpanded : undefined}
        aria-controls={isMobileSidebar ? "my-maps-content" : undefined}
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
        <div className="map-list">
          {maps.map((map) => {
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
                    <small>
                      {map.sourceSetId
                        ? `Salt okunur · ${recordCounts[map.id] ?? 0} il`
                        : `${recordCounts[map.id] ?? 0} ilde not`}
                    </small>
                  </span>
                  {active && <Check className="map-card__check" size={16} />}
                </button>

                {active && (
                  <div className="map-card__actions">
                    <button
                      type="button"
                      onClick={() => onDuplicate(map)}
                      title="Haritayı çoğalt"
                      aria-label={`${map.name} haritasını çoğalt`}
                    >
                      <Copy size={14} />{" "}
                      {map.sourceSetId ? "Kopyala ve düzenle" : "Çoğalt"}
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
          })}
        </div>

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
        ) : (
          <button
            className="new-map-button"
            type="button"
            onClick={() => setIsCreating(true)}
          >
            <Plus size={18} />
            Yeni çalışma haritası
          </button>
        )}
      </div>

      <div className="ready-library" id="ready-library">
        <button
          className="ready-library__heading ready-library__heading--toggle"
          type="button"
          disabled={!isMobileSidebar}
          aria-expanded={isMobileSidebar ? isReadySetsExpanded : undefined}
          aria-controls={
            isMobileSidebar ? "ready-library-content" : undefined
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
                    if (isMobileSidebar) setIsReadySetsExpanded(false);
                  }}
                >
                  <i>
                    <CatalogIcon name={set.icon} size={16} color="#fff" />
                  </i>
                  <span>
                    <strong>{set.shortTitle}</strong>
                    <small>{set.items.length} hazır bilgi</small>
                  </span>
                  <BookOpen size={14} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="autosave-indicator">
          <span />
          <div>
            <strong>Çevrimdışı çalışır</strong>
            <small>Notların bu cihazda saklanır</small>
          </div>
        </div>
        {cloudAccount && (
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
        )}
      </div>
    </aside>
  );
}
