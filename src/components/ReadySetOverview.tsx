import {
  ArrowLeft,
  ArrowUpRight,
  BookOpenCheck,
  Copy,
  Images,
  Lightbulb,
  LockKeyhole,
  MapPin,
} from "lucide-react";
import { getMarkerVisual } from "../markerKinds";
import type { ReadyStudySet, ReadySetItem } from "../readySets";
import type { City } from "../types";
import { CatalogIcon } from "./CatalogIcon";
import { turkeyCities } from "./TurkeyMap";

type ReadySetOverviewProps = {
  set: ReadyStudySet;
  selectedCity: City | null;
  selectedTopic: string | null;
  onSelectCity: (city: City) => void;
  onTopicChange: (topic: string | null) => void;
  onBack: () => void;
  onCopy: () => void;
  onQuiz: () => void;
};

function cityFor(item: ReadySetItem) {
  return turkeyCities.find((city) => city.plateNumber === item.provinceCode);
}

function visualFor(item: ReadySetItem, color: string) {
  return getMarkerVisual({
    kind: item.kind,
    subtype: item.subtype,
    color,
  });
}

export function ReadySetOverview({
  set,
  selectedCity,
  selectedTopic,
  onSelectCity,
  onTopicChange,
  onBack,
  onCopy,
  onQuiz,
}: ReadySetOverviewProps) {
  const topics = [...new Set(set.items.flatMap((entry) => entry.topic ?? []))];
  const visibleItems = selectedTopic
    ? set.items.filter((entry) => entry.topic === selectedTopic)
    : set.items;
  const images = visibleItems.filter((item) => item.image);
  const groups = new Map<string, ReadySetItem[]>();

  visibleItems.forEach((entry) => {
    const visual = visualFor(entry, set.color);
    const group = entry.topic ?? `${visual.group}: ${visual.label}`;
    groups.set(group, [...(groups.get(group) ?? []), entry]);
  });
  const selectedEntries = selectedCity
    ? visibleItems.filter(
        (entry) => entry.provinceCode === selectedCity.plateNumber,
      )
    : [];

  if (selectedCity) {
    return (
      <aside className="province-panel ready-set-panel">
        <button className="ready-set-back" type="button" onClick={onBack}>
          <ArrowLeft size={15} /> Setin genel görünümüne dön
        </button>

        <div
          className="ready-city-header"
          style={{ "--set-color": set.color } as React.CSSProperties}
        >
          <span>{selectedCity.plateNumber.toString().padStart(2, "0")}</span>
          <div>
            <small>SEÇİLİ İL · {set.shortTitle}</small>
            <h2>{selectedCity.name}</h2>
          </div>
          <LockKeyhole size={17} />
        </div>

        {topics.length > 0 && (
          <section className="ready-topic-picker ready-topic-picker--detail">
            <label>
              <span>Konu / kaynak</span>
              <select
                value={selectedTopic ?? ""}
                onChange={(event) =>
                  onTopicChange(event.target.value || null)
                }
              >
                <option value="">Bütün konular</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </label>
          </section>
        )}

        <section className="ready-city-content">
          <div className="ready-set-section-title">
            <MapPin size={15} />
            <div>
              <small>BU İLDEKİ HAZIR BİLGİLER</small>
              <strong>
                {selectedEntries.length
                  ? `${selectedEntries.length} önemli içerik`
                  : "Bu sette işaret bulunmuyor"}
              </strong>
            </div>
          </div>

          {selectedEntries.length > 0 ? (
            <div className="ready-city-items">
              {selectedEntries.map((entry) => {
                const visual = visualFor(entry, set.color);
                return (
                  <article className="ready-city-item" key={entry.id}>
                    <header>
                      <i style={{ backgroundColor: visual.color }}>
                        <CatalogIcon
                          name={visual.icon}
                          size={17}
                          color="#fff"
                        />
                      </i>
                      <div>
                        <small>
                          {entry.relation ?? visual.group} · {visual.label}
                        </small>
                        <h3>{entry.label}</h3>
                      </div>
                    </header>
                    <p>{entry.description}</p>
                    {entry.sourceLabel && (
                      <a
                        className="ready-source-badge"
                        href={entry.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <BookOpenCheck size={11} />
                        {entry.sourceLabel}
                      </a>
                    )}
                    {entry.branches?.length && (
                      <div>
                        <strong>Önemli kolları</strong>
                        <span>{entry.branches.join(" · ")}</span>
                      </div>
                    )}
                    {entry.image && (
                      <img src={entry.image} alt={`${entry.label} görünümü`} />
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="ready-city-empty">
              {selectedCity.name} bu hazır setin temel işaretleri arasında
              değil. Aşağıdaki genel sınav notlarını çalışabilirsin.
            </p>
          )}
        </section>

        <section className="ready-set-facts">
          <div className="ready-set-section-title">
            <Lightbulb size={15} />
            <div>
              <small>KPSS · TYT HIZLI NOTLAR</small>
              <strong>MEB&apos;de öne çıkan bilgiler</strong>
            </div>
          </div>
          <ul>
            {set.keyFacts.map((fact) => (
              <li key={fact}><span />{fact}</li>
            ))}
          </ul>
        </section>

        <div className="ready-set-readonly">
          <LockKeyhole size={18} />
          <div>
            <strong>Bu ders seti salt okunur</strong>
            <span>
              Not eklemek, çizmek veya içerikleri değiştirmek için kişisel
              kopyasını oluştur.
            </span>
          </div>
          <button type="button" onClick={onCopy}>
            <Copy size={14} /> Kopyala ve düzenle
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="province-panel ready-set-panel">
      <div
        className="ready-set-hero"
        style={{ "--set-color": set.color } as React.CSSProperties}
      >
        <span className="ready-set-hero__icon">
          <CatalogIcon name={set.icon} size={24} color="#fff" />
        </span>
        <small>{set.subject}</small>
        <h2>{set.title}</h2>
        <p>{set.description}</p>
        <div className="ready-set-hero__stats">
          <span><MapPin size={13} /> {set.items.length} işaret</span>
          <span>
            <BookOpenCheck size={13} /> {set.quizQuestions.length} bilgi sorusu
          </span>
          <span><LockKeyhole size={13} /> Salt okunur</span>
        </div>
        <button type="button" onClick={onQuiz}>
          <BookOpenCheck size={15} />
          Bilgi + harita quizini çöz
        </button>
        <button
          className="ready-set-hero__copy"
          type="button"
          onClick={onCopy}
        >
          <Copy size={15} />
          Kopyala ve kendi notlarını ekle
        </button>
      </div>

      {topics.length > 0 && (
        <section className="ready-topic-picker">
          <div className="ready-set-section-title">
            <MapPin size={15} />
            <div>
              <small>KONU / SINIFLANDIRMA</small>
              <strong>Haritada görmek istediğin grubu seç</strong>
            </div>
          </div>
          <div>
            <button
              type="button"
              className={!selectedTopic ? "is-active" : ""}
              onClick={() => onTopicChange(null)}
            >
              Tümü <small>{set.items.length}</small>
            </button>
            {topics.map((topic) => (
              <button
                type="button"
                key={topic}
                className={selectedTopic === topic ? "is-active" : ""}
                onClick={() => onTopicChange(topic)}
              >
                {topic}
                <small>
                  {set.items.filter((entry) => entry.topic === topic).length}
                </small>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="ready-set-facts">
        <div className="ready-set-section-title">
          <Lightbulb size={15} />
          <div>
            <small>KPSS · TYT HIZLI NOTLAR</small>
            <strong>MEB&apos;de öne çıkan bilgiler</strong>
          </div>
        </div>
        <ul>
          {set.keyFacts.map((fact) => (
            <li key={fact}><span />{fact}</li>
          ))}
        </ul>
      </section>

      {images.length > 0 && (
        <section className="ready-set-gallery">
          <div className="ready-set-section-title">
            <Images size={15} />
            <div>
              <small>GÖRSEL HAFIZA</small>
              <strong>Örnek dağlar</strong>
            </div>
          </div>
          <div>
            {images.map((entry) => (
              <button
                type="button"
                key={entry.id}
                onClick={() => {
                  const city = cityFor(entry);
                  if (city) onSelectCity(city);
                }}
              >
                <img src={entry.image} alt={`${entry.label} görünümü`} />
                <span>
                  <strong>{entry.label}</strong>
                  <small>{visualFor(entry, set.color).label}</small>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="ready-set-catalog">
        <div className="ready-set-section-title">
          <BookOpenCheck size={15} />
          <div>
            <small>HAZIR İÇERİK</small>
            <strong>İsim, tür ve sınav notu</strong>
          </div>
        </div>

        {[...groups.entries()].map(([group, entries]) => (
          <div className="ready-set-group" key={group}>
            <h3>{group}</h3>
            <div>
              {entries.map((entry) => {
                const city = cityFor(entry);
                const visual = visualFor(entry, set.color);
                return (
                  <button
                    className="ready-set-item"
                    type="button"
                    key={entry.id}
                    onClick={() => city && onSelectCity(city)}
                  >
                    <i style={{ backgroundColor: visual.color }}>
                      <CatalogIcon
                        name={visual.icon}
                        size={15}
                        color="#fff"
                      />
                    </i>
                    <span>
                      <strong>{entry.label}</strong>
                      <small>
                        {entry.place ?? city?.name ?? "Türkiye"} ·{" "}
                        {city?.name ?? visual.label}
                      </small>
                      {entry.relation && <em>{entry.relation}</em>}
                      {entry.sourceLabel && (
                        <span className="ready-source-badge">
                          <BookOpenCheck size={10} />
                          {entry.sourceLabel}
                        </span>
                      )}
                      <p>{entry.description}</p>
                      {entry.branches?.length && (
                        <em>
                          Kolları: {entry.branches.join(", ")}
                        </em>
                      )}
                    </span>
                    <ArrowUpRight size={14} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </aside>
  );
}
