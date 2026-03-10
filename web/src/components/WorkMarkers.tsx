import { useCallback, useRef } from "react";

type WorkMarkersProps = {
  startHour: number;
  endHour: number;
  onStartChange: (hour: number) => void;
  onEndChange: (hour: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function WorkMarkers({
  startHour,
  endHour,
  onStartChange,
  onEndChange,
  containerRef,
}: WorkMarkersProps) {
  const dragging = useRef<"start" | "end" | null>(null);

  const getHourFromX = useCallback(
    (clientX: number): number => {
      const el = containerRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = x / rect.width;
      return clamp(Math.round(pct * 24 * 2) / 2, 0, 24);
    },
    [containerRef],
  );

  const handlePointerDown = useCallback(
    (which: "start" | "end") => (e: React.PointerEvent) => {
      dragging.current = which;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const hour = getHourFromX(e.clientX);
      if (dragging.current === "start") {
        onStartChange(Math.min(hour, endHour - 0.5));
      } else {
        onEndChange(Math.max(hour, startHour + 0.5));
      }
    },
    [getHourFromX, onStartChange, onEndChange, startHour, endHour],
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  const startPct = (startHour / 24) * 100;
  const endPct = (endHour / 24) * 100;

  const formatHour = (h: number) => {
    const hr = Math.floor(h);
    const min = (h - hr) * 60;
    const period = hr >= 12 ? "PM" : "AM";
    const h12 = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
    return min > 0
      ? `${h12}:${min.toString().padStart(2, "0")} ${period}`
      : `${h12} ${period}`;
  };

  return (
    <div
      className="work-markers"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        className="work-markers__line work-markers__line--start"
        style={{ left: `${startPct}%` }}
        onPointerDown={handlePointerDown("start")}
        title={`Work start: ${formatHour(startHour)}`}
      >
        <span className="work-markers__label">{formatHour(startHour)}</span>
      </div>
      <div
        className="work-markers__zone"
        style={{ left: `${startPct}%`, width: `${endPct - startPct}%` }}
      />
      <div
        className="work-markers__line work-markers__line--end"
        style={{ left: `${endPct}%` }}
        onPointerDown={handlePointerDown("end")}
        title={`Work end: ${formatHour(endHour)}`}
      >
        <span className="work-markers__label">{formatHour(endHour)}</span>
      </div>
    </div>
  );
}
