import { useEffect, useState } from "react";
import {
  Check,
  ChevronRight,
  Crosshair,
  LocateFixed,
  MapPin,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  getMarkerKind,
  getMarkerSubtypes,
  getMarkerVisual,
  MARKER_KINDS,
} from "../markerKinds";
import { createId } from "../id";
import { CatalogIcon } from "./CatalogIcon";
import type {
  City,
  MapMarker,
  MarkerDraft,
  MarkerKind,
  MarkerSubtype,
  ProvinceItem,
  ProvinceRecord,
} from "../types";

type ProvinceEditorProps = {
  city: City | null;
  record?: ProvinceRecord;
  themeColor: string;
  onClose: () => void;
  onSave: (record: ProvinceRecord) => Promise<void>;
  onDelete: (record: ProvinceRecord) => Promise<void>;
  markers: MapMarker[];
  placementActive: boolean;
  onStartPlacement: (draft: MarkerDraft) => void;
  onCancelPlacement: () => void;
  onDeleteMarker: (marker: MapMarker) => Promise<void>;
  mapId: string;
};

const CATEGORIES = [
  "Genel",
  "Dağ",
  "Ova",
  "Tarım",
  "Akarsu",
  "Göl",
  "Maden",
  "Enerji",
  "İklim",
  "Sanayi",
  "Turizm",
];

function emptyItem(): ProvinceItem {
  return {
    id: createId(),
    text: "",
    category: "Genel",
  };
}

export function ProvinceEditor({
  city,
  record,
  themeColor,
  onClose,
  onSave,
  onDelete,
  markers,
  placementActive,
  onStartPlacement,
  onCancelPlacement,
  onDeleteMarker,
  mapId,
}: ProvinceEditorProps) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [color, setColor] = useState(themeColor);
  const [items, setItems] = useState<ProvinceItem[]>([emptyItem()]);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [markerLabel, setMarkerLabel] = useState("");
  const [markerDescription, setMarkerDescription] = useState("");
  const [markerKind, setMarkerKind] = useState<MarkerKind>("mountain");
  const [markerSubtype, setMarkerSubtype] =
    useState<MarkerSubtype | undefined>("mountain-fold");
  const [markerColor, setMarkerColor] = useState(
    getMarkerKind("mountain").color,
  );
  const [markerError, setMarkerError] = useState("");
  const [subtypeSearch, setSubtypeSearch] = useState("");

  useEffect(() => {
    setTitle(record?.title ?? "");
    setNote(record?.note ?? "");
    setColor(record?.color ?? themeColor);
    setItems(record?.items.length ? record.items : [emptyItem()]);
    setSaved(false);
    setMarkerLabel("");
    setMarkerDescription("");
    setMarkerKind("mountain");
    setMarkerSubtype("mountain-fold");
    setMarkerColor(
      getMarkerSubtypes("mountain")[0]?.color ??
        getMarkerKind("mountain").color,
    );
    setMarkerError("");
    setSubtypeSearch("");
  }, [city?.plateNumber, record, themeColor]);

  if (!city) {
    return (
      <aside className="province-panel province-panel--empty">
        <div className="empty-compass">
          <span />
          <MapPin size={31} strokeWidth={1.7} />
        </div>
        <span className="eyebrow">İL BİLGİLERİ</span>
        <h2>Haritadan bir il seç</h2>
        <p>
          Dağları, tarım ürünlerini, akarsuları veya kendi ders notlarını
          seçtiğin ilin üzerine kaydet.
        </p>
        <div className="empty-steps">
          <span><b>1</b> Bir ile dokun <ChevronRight size={15} /></span>
          <span><b>2</b> Bilgini yaz <ChevronRight size={15} /></span>
          <span><b>3</b> Kaydet <Check size={15} /></span>
        </div>
      </aside>
    );
  }

  const updateItem = (
    itemId: string,
    key: "text" | "category",
    value: string,
  ) => {
    setSaved(false);
    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, [key]: value } : item,
      ),
    );
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const cleanItems = items
      .map((item) => ({ ...item, text: item.text.trim() }))
      .filter((item) => item.text);

    if (!title.trim() && !note.trim() && cleanItems.length === 0) return;

    setIsSaving(true);
    try {
      await onSave({
        id: `${mapId}-${city.plateNumber}`,
        mapId,
        provinceCode: city.plateNumber,
        provinceName: city.name,
        title: title.trim(),
        note: note.trim(),
        color,
        items: cleanItems,
        updatedAt: new Date().toISOString(),
      });
      setItems(cleanItems.length ? cleanItems : [emptyItem()]);
      setSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <aside className="province-panel">
      <div className="province-panel__header">
        <div className="province-identity">
          <span className="plate-number">
            {city.plateNumber.toString().padStart(2, "0")}
          </span>
          <div>
            <span className="eyebrow">SEÇİLİ İL</span>
            <h2>{city.name}</h2>
          </div>
        </div>
        <button
          className="icon-button"
          type="button"
          aria-label="İl panelini kapat"
          onClick={onClose}
        >
          <X size={19} />
        </button>
      </div>

      <form className="province-form" onSubmit={submit}>
        <label className="field">
          <span>Kısa başlık</span>
          <input
            value={title}
            maxLength={60}
            placeholder={`Örn. ${city.name} notlarım`}
            onChange={(event) => {
              setTitle(event.target.value);
              setSaved(false);
            }}
          />
        </label>

        <div className="field">
          <div className="field__label-row">
            <span>Bilgi maddeleri</span>
            <small>Haritada ilk madde görünür</small>
          </div>

          <div className="item-list">
            {items.map((item, index) => (
              <div className="item-row" key={item.id}>
                <span className="item-index">{index + 1}</span>
                <div className="item-inputs">
                  <input
                    value={item.text}
                    maxLength={80}
                    placeholder="Örn. Ağrı Dağı"
                    aria-label={`${index + 1}. bilgi maddesi`}
                    onChange={(event) =>
                      updateItem(item.id, "text", event.target.value)
                    }
                  />
                  <select
                    value={item.category}
                    aria-label={`${index + 1}. maddenin kategorisi`}
                    onChange={(event) =>
                      updateItem(item.id, "category", event.target.value)
                    }
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="remove-item"
                  type="button"
                  aria-label={`${index + 1}. maddeyi sil`}
                  onClick={() => {
                    setSaved(false);
                    setItems((current) =>
                      current.length === 1
                        ? [emptyItem()]
                        : current.filter((entry) => entry.id !== item.id),
                    );
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button
            className="add-item"
            type="button"
            onClick={() => {
              setItems((current) => [...current, emptyItem()]);
              setSaved(false);
            }}
          >
            <Plus size={16} /> Yeni madde ekle
          </button>
        </div>

        <label className="field">
          <span>Ayrıntılı not</span>
          <textarea
            value={note}
            rows={4}
            maxLength={800}
            placeholder="Bu ille ilgili hatırlamak istediğin açıklamaları yaz..."
            onChange={(event) => {
              setNote(event.target.value);
              setSaved(false);
            }}
          />
          <small className="character-count">{note.length}/800</small>
        </label>

        <section className="marker-editor">
          <div className="marker-editor__heading">
            <div>
              <span>Harita işaretleri</span>
              <small>İlin içinde tam konuma yerleştir</small>
            </div>
            <span className="marker-count">{markers.length}</span>
          </div>

          {markers.length > 0 && (
            <div className="saved-markers">
              {markers.map((marker) => {
                const visual = getMarkerVisual(marker);
                return (
                  <div className="saved-marker" key={marker.id}>
                    <i style={{ backgroundColor: marker.color }}>
                      <CatalogIcon name={visual.icon} size={14} color="#fff" />
                    </i>
                    <div>
                      <strong>{marker.label}</strong>
                      <small>
                        {visual.parentLabel} · {visual.label}
                      </small>
                    </div>
                    <button
                      type="button"
                      aria-label={`${marker.label} işaretini sil`}
                      onClick={() => onDeleteMarker(marker)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="marker-builder">
            <label>
              <span>İşaret adı</span>
              <input
                value={markerLabel}
                maxLength={60}
                placeholder="Örn. Ağrı Dağı"
                onChange={(event) => {
                  setMarkerLabel(event.target.value);
                  setMarkerError("");
                }}
              />
            </label>

            <label>
              <span>Kısa açıklama <small>(isteğe bağlı)</small></span>
              <input
                value={markerDescription}
                maxLength={140}
                placeholder="Örn. 5137 metre"
                onChange={(event) => setMarkerDescription(event.target.value)}
              />
            </label>

            <div className="marker-kinds" aria-label="İşaret simgesi">
              {MARKER_KINDS.map((kind) => (
                <button
                  key={kind.id}
                  type="button"
                  className={markerKind === kind.id ? "is-active" : ""}
                  aria-label={`${kind.label} simgesini seç`}
                  aria-pressed={markerKind === kind.id}
                  title={kind.label}
                  onClick={() => {
                    setMarkerKind(kind.id);
                    const firstSubtype = getMarkerSubtypes(kind.id)[0];
                    setMarkerSubtype(firstSubtype?.id);
                    setMarkerColor(firstSubtype?.color ?? kind.color);
                    setSubtypeSearch("");
                  }}
                >
                  <i style={{ color: kind.color }}>
                    <CatalogIcon name={kind.icon} size={17} />
                  </i>
                  <span>{kind.label}</span>
                </button>
              ))}
            </div>

            {getMarkerSubtypes(markerKind).length > 0 && (
              <div className="marker-subtypes">
                <div className="marker-subtypes__title">
                  <span>
                    {markerKind === "mountain"
                      ? "Dağın oluşum türü"
                      : markerKind === "plain"
                        ? "Ovanın sınıfı"
                        : `${getMarkerKind(markerKind).label} türü`}
                  </span>
                  {getMarkerSubtypes(markerKind).length > 8 && (
                    <input
                      value={subtypeSearch}
                      placeholder="Tür veya ürün ara..."
                      onChange={(event) => setSubtypeSearch(event.target.value)}
                    />
                  )}
                </div>
                <div className="marker-subtype-groups">
                  {[
                    ...new Set(
                      getMarkerSubtypes(markerKind)
                        .filter((entry) =>
                          `${entry.label} ${entry.group}`
                            .toLocaleLowerCase("tr-TR")
                            .includes(
                              subtypeSearch
                                .trim()
                                .toLocaleLowerCase("tr-TR"),
                            ),
                        )
                        .map((entry) => entry.group),
                    ),
                  ].map((group) => (
                    <section key={group}>
                      <strong>{group}</strong>
                      <div>
                        {getMarkerSubtypes(markerKind)
                          .filter(
                            (entry) =>
                              entry.group === group &&
                              `${entry.label} ${entry.group}`
                                .toLocaleLowerCase("tr-TR")
                                .includes(
                                  subtypeSearch
                                    .trim()
                                    .toLocaleLowerCase("tr-TR"),
                                ),
                          )
                          .map((subtype) => (
                            <button
                              key={subtype.id}
                              type="button"
                              className={
                                markerSubtype === subtype.id ? "is-active" : ""
                              }
                              onClick={() => {
                                setMarkerSubtype(subtype.id);
                                setMarkerColor(subtype.color);
                              }}
                              title={subtype.description}
                            >
                              <i style={{ color: subtype.color }}>
                                <CatalogIcon name={subtype.icon} size={18} />
                              </i>
                              <span>{subtype.shortLabel}</span>
                              <small>{subtype.description}</small>
                            </button>
                          ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            )}

            <div className="marker-builder__footer">
              <div className="marker-color">
                {["#a85d42", "#4f8b67", "#397ca8", "#80649b", "#d05f64"].map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      className={markerColor === option ? "is-active" : ""}
                      style={{ backgroundColor: option }}
                      aria-label={`${option} işaret rengini seç`}
                      onClick={() => setMarkerColor(option)}
                    />
                  ),
                )}
              </div>

              <button
                className={`place-marker-button ${placementActive ? "is-active" : ""}`}
                type="button"
                onClick={() => {
                  if (placementActive) {
                    onCancelPlacement();
                    return;
                  }
                  if (!markerLabel.trim()) {
                    setMarkerError("Önce işarete bir ad ver.");
                    return;
                  }
                  setMarkerError("");
                  onStartPlacement({
                    label: markerLabel.trim(),
                    description: markerDescription.trim(),
                    kind: markerKind,
                    subtype:
                      getMarkerSubtypes(markerKind).length > 0
                        ? markerSubtype
                        : undefined,
                    color: markerColor,
                  });
                }}
              >
                {placementActive ? (
                  <>
                    <X size={16} /> Konumu iptal et
                  </>
                ) : (
                  <>
                    <Crosshair size={16} /> Haritada konum seç
                  </>
                )}
              </button>
            </div>

            {markerError && <p className="marker-error">{markerError}</p>}
            {placementActive && (
              <div className="placement-help">
                <LocateFixed size={17} />
                Şimdi haritada {city.name} sınırları içinde gerçek konuma dokun.
              </div>
            )}
          </div>
        </section>

        <fieldset className="color-field">
          <legend>Harita rengi</legend>
          <div className="color-options">
            {["#e9a23b", "#d46a4c", "#558c79", "#4778a8", "#8a6ead"].map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  className={color === option ? "is-active" : ""}
                  aria-label={`${option} rengini seç`}
                  aria-pressed={color === option}
                  style={{ backgroundColor: option }}
                  onClick={() => {
                    setColor(option);
                    setSaved(false);
                  }}
                />
              ),
            )}
          </div>
        </fieldset>

        <div className="form-actions">
          {record && (
            <button
              className="button button--danger-ghost"
              type="button"
              onClick={() => onDelete(record)}
            >
              <Trash2 size={16} /> İl notunu sil
            </button>
          )}
          <button
            className="button button--primary"
            type="submit"
            disabled={isSaving}
          >
            {saved ? <Check size={17} /> : <Save size={17} />}
            {isSaving ? "Kaydediliyor..." : saved ? "Kaydedildi" : "İli kaydet"}
          </button>
        </div>
      </form>
    </aside>
  );
}
