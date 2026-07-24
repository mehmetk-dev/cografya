import { forwardRef } from "react";
import { BookOpen, Crosshair, MapPinned } from "lucide-react";
import { TurkeyMap } from "./TurkeyMap";
import { getMarkerVisual } from "../markerKinds";
import { CatalogIcon } from "./CatalogIcon";
import type {
  MapDrawing,
  MapMarker,
  ProvinceRecord,
  StudyMap,
} from "../types";

type ExportPosterProps = {
  map: StudyMap;
  records: ProvinceRecord[];
  markers: MapMarker[];
  drawings: MapDrawing[];
};

export const ExportPoster = forwardRef<HTMLDivElement, ExportPosterProps>(
  function ExportPoster({ map, records, markers, drawings }, ref) {
    const sortedRecords = [...records].sort(
      (left, right) => left.provinceCode - right.provinceCode,
    );
    const notedProvinceCount = new Set([
      ...records.map((record) => record.provinceCode),
      ...markers.map((marker) => marker.provinceCode),
    ]).size;

    return (
      <div className="export-poster" ref={ref} aria-hidden="true">
        <header className="export-poster__header">
          <div className="export-poster__brand">
            <span><MapPinned size={29} /></span>
            <div>
              <strong>Coğrafya Atlasım</strong>
              <small>TÜRKİYE ÇALIŞMA HARİTASI</small>
            </div>
          </div>
          <div className="export-poster__date">
            {new Intl.DateTimeFormat("tr-TR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(new Date())}
          </div>
        </header>

        <div className="export-poster__title">
          <span style={{ backgroundColor: map.themeColor }} />
          <div>
            <small>ÇALIŞMA HARİTASI</small>
            <h1>{map.name}</h1>
            {map.description && <p>{map.description}</p>}
          </div>
          <div className="export-poster__stat">
            <strong>{notedProvinceCount}</strong>
            <span>ilde not</span>
          </div>
        </div>

        <TurkeyMap
          selectedCode={null}
          records={records}
          markers={markers}
          drawings={drawings}
          themeColor={map.themeColor}
          showLabels
          showProvinceNames={Boolean(map.sourceSetId)}
          onSelect={() => undefined}
          exportMode
        />

        <section className="poster-notes">
          <div className="poster-notes__heading">
            <div>
              <small>HARİTA DEFTERİ</small>
              <h2>İllere eklenen bilgiler</h2>
            </div>
            <span><BookOpen size={18} /> {records.length} il</span>
          </div>

          {sortedRecords.length > 0 ? (
            <div className="poster-notes__grid">
              {sortedRecords.map((record) => (
                <article
                  className="poster-note"
                  key={record.id}
                  style={{ "--note-color": record.color } as React.CSSProperties}
                >
                  <header>
                    <span>
                      {record.provinceCode.toString().padStart(2, "0")}
                    </span>
                    <div>
                      <h3>{record.provinceName}</h3>
                      {record.title && <small>{record.title}</small>}
                    </div>
                  </header>

                  {record.items.length > 0 && (
                    <ul>
                      {record.items.map((item) => (
                        <li key={item.id}>
                          <i />
                          <span>{item.text}</span>
                          {item.category && item.category !== "Genel" && (
                            <small>{item.category}</small>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  {record.note && <p>{record.note}</p>}
                </article>
              ))}
            </div>
          ) : (
            <div className="poster-notes__empty">
              Bu çalışma haritasına henüz il notu eklenmedi.
            </div>
          )}
        </section>

        {markers.length > 0 && (
          <section className="poster-markers">
            <div className="poster-notes__heading">
              <div>
                <small>KONUM İŞARETLERİ</small>
                <h2>Haritaya yerleştirilen noktalar</h2>
              </div>
              <span><Crosshair size={18} /> {markers.length} işaret</span>
            </div>

            <div className="poster-markers__grid">
              {[...markers]
                .sort((left, right) => left.provinceCode - right.provinceCode)
                .map((marker) => {
                  const visual = getMarkerVisual(marker);
                  return (
                    <article className="poster-marker" key={marker.id}>
                      <i style={{ backgroundColor: marker.color }}>
                        <CatalogIcon
                          name={visual.icon}
                          size={16}
                          color="#fff"
                        />
                      </i>
                      <div>
                        <span>
                          {marker.provinceCode.toString().padStart(2, "0")} ·{" "}
                          {marker.provinceName} · {visual.label}
                        </span>
                        <strong>{marker.label}</strong>
                        {marker.description && <p>{marker.description}</p>}
                      </div>
                    </article>
                  );
                })}
            </div>
          </section>
        )}

        <footer className="export-poster__footer">
          <span>COĞRAFYA ATLASIM</span>
          <i />
          <span>81 İL · KİŞİSEL ÇALIŞMA HARİTASI</span>
        </footer>
      </div>
    );
  },
);
