import { useCallback, useEffect, useMemo, useRef } from "react";
import type { CityData } from "../lib/cities";
import { terminatorPoints, solarDeclination } from "../lib/sun";
import LAND_POLYGONS from "../lib/coastline";

type WorldMapProps = {
  dayOfYear: number;
  cities: CityData[];
};

const MAP_WIDTH = 960;
const MAP_HEIGHT = 480;
const PADDING = 0;

function lonToX(lon: number): number {
  return ((lon + 180) / 360) * MAP_WIDTH + PADDING;
}

function latToY(lat: number): number {
  return ((90 - lat) / 180) * MAP_HEIGHT + PADDING;
}

export function WorldMap({ dayOfYear, cities }: WorldMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const utcHours = useMemo(() => {
    const now = new Date();
    return now.getUTCHours() + now.getUTCMinutes() / 60;
  }, []);

  const terminator = useMemo(
    () => terminatorPoints(dayOfYear, utcHours, 360),
    [dayOfYear, utcHours],
  );

  const decl = useMemo(() => solarDeclination(dayOfYear), [dayOfYear]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const w = MAP_WIDTH + PADDING * 2;
      const h = MAP_HEIGHT + PADDING * 2;
      ctx.clearRect(0, 0, w, h);

      // Ocean background
      ctx.fillStyle = "#1a2a4a";
      ctx.fillRect(0, 0, w, h);

      // Draw land polygons
      ctx.fillStyle = "#2a3a50";
      ctx.strokeStyle = "#3a5070";
      ctx.lineWidth = 0.5;
      for (const polygon of LAND_POLYGONS) {
        if (polygon.length < 3) continue;
        ctx.beginPath();
        ctx.moveTo(lonToX(polygon[0][0]), latToY(polygon[0][1]));
        for (let i = 1; i < polygon.length; i++) {
          ctx.lineTo(lonToX(polygon[i][0]), latToY(polygon[i][1]));
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Draw night overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.beginPath();

      // The night side depends on declination sign
      // When decl > 0 (northern summer), night is below the terminator at noon
      const nightIsBelow = decl >= 0;

      if (nightIsBelow) {
        // Start at bottom-left
        ctx.moveTo(lonToX(-180), latToY(-90));
        // Trace terminator from left to right
        for (const pt of terminator) {
          ctx.lineTo(lonToX(pt.lon), latToY(pt.lat));
        }
        // Close along bottom
        ctx.lineTo(lonToX(180), latToY(-90));
        ctx.closePath();
      } else {
        // Start at top-left
        ctx.moveTo(lonToX(-180), latToY(90));
        // Trace terminator from left to right
        for (const pt of terminator) {
          ctx.lineTo(lonToX(pt.lon), latToY(pt.lat));
        }
        // Close along top
        ctx.lineTo(lonToX(180), latToY(90));
        ctx.closePath();
      }
      ctx.fill();

      // Draw grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 0.5;
      // Longitude lines every 30°
      for (let lon = -150; lon <= 180; lon += 30) {
        ctx.beginPath();
        ctx.moveTo(lonToX(lon), 0);
        ctx.lineTo(lonToX(lon), h);
        ctx.stroke();
      }
      // Latitude lines every 30°
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        ctx.moveTo(0, latToY(lat));
        ctx.lineTo(w, latToY(lat));
        ctx.stroke();
      }
      // Equator slightly brighter
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.moveTo(0, latToY(0));
      ctx.lineTo(w, latToY(0));
      ctx.stroke();

      // Draw city dots
      for (const city of cities) {
        const cx = lonToX(city.longitude);
        const cy = latToY(city.latitude);

        // Glow
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(77, 159, 255, 0.25)";
        ctx.fill();

        // Dot
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#4d9fff";
        ctx.fill();

        // Label
        ctx.fillStyle = "#c0d0e8";
        ctx.font = "10px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(city.name, cx, cy - 9);
      }
    },
    [terminator, decl, cities],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    draw(ctx);
  }, [draw]);

  return (
    <div className="world-map">
      <canvas
        ref={canvasRef}
        width={MAP_WIDTH + PADDING * 2}
        height={MAP_HEIGHT + PADDING * 2}
        className="world-map__canvas"
      />
    </div>
  );
}
