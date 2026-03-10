import { useCallback, useMemo, useRef, useState } from "react";
import { CityRow } from "./CityRow";
import { WorkMarkers } from "./WorkMarkers";
import type { SunTimesResult } from "../hooks/useSunTimes";

type TimelineProps = {
  sunTimes: SunTimesResult[];
};

const HOUR_LABELS = Array.from({ length: 25 }, (_, i) => i);

export function Timeline({ sunTimes }: TimelineProps) {
  const [workStart, setWorkStart] = useState(9);
  const [workEnd, setWorkEnd] = useState(17);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStartChange = useCallback((h: number) => setWorkStart(h), []);
  const handleEndChange = useCallback((h: number) => setWorkEnd(h), []);

  const hourLabels = useMemo(
    () =>
      HOUR_LABELS.filter((h) => h % 3 === 0).map((h) => ({
        hour: h,
        pct: (h / 24) * 100,
        label: h === 0 ? "12a" : h === 12 ? "12p" : h === 24 ? "12a" : h > 12 ? `${h - 12}p` : `${h}a`,
      })),
    [],
  );

  return (
    <div className="timeline" ref={containerRef}>
      <div className="timeline__header">
        <div className="timeline__label-spacer" />
        <div className="timeline__hours">
          {hourLabels.map((h) => (
            <span
              key={h.hour}
              className="timeline__hour-label"
              style={{ left: `${h.pct}%` }}
            >
              {h.label}
            </span>
          ))}
        </div>
      </div>
      <div className="timeline__body">
        <WorkMarkers
          startHour={workStart}
          endHour={workEnd}
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
          containerRef={containerRef}
        />
        {sunTimes.map((st) => (
          <CityRow
            key={st.city.id}
            city={st.city}
            sunrise={st.sunrise}
            sunset={st.sunset}
          />
        ))}
      </div>
    </div>
  );
}
