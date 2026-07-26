import { forwardRef } from "react";
import { TurkeyMap } from "./TurkeyMap";
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
    return (
      <div className="export-poster" ref={ref} aria-hidden="true">
        <TurkeyMap
          selectedCode={null}
          records={records}
          markers={markers}
          drawings={drawings}
          themeColor={map.themeColor}
          showLabels={map.showLabels}
          showProvinceNames={
            map.showProvinceNames ??
            (Boolean(map.sourceSetId) && map.sourceSetId !== "rivers")
          }
          onSelect={() => undefined}
          exportMode
        />
      </div>
    );
  },
);
