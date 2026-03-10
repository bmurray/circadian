import { useMemo } from "react";
import { formatTime } from "../lib/sun";
import type { CityData } from "../lib/cities";

type CityRowProps = {
  city: CityData;
  sunrise: number | null;
  sunset: number | null;
};

export function CityRow({ city, sunrise, sunset }: CityRowProps) {
  const sunrisePercent = useMemo(
    () => (sunrise !== null ? (sunrise / 24) * 100 : null),
    [sunrise],
  );
  const sunsetPercent = useMemo(
    () => (sunset !== null ? (sunset / 24) * 100 : null),
    [sunset],
  );

  const sunriseLabel = useMemo(
    () => (sunrise !== null ? formatTime(sunrise) : "—"),
    [sunrise],
  );
  const sunsetLabel = useMemo(
    () => (sunset !== null ? formatTime(sunset) : "—"),
    [sunset],
  );

  return (
    <div className="city-row">
      <div className="city-row__label">
        <span className="city-row__name">{city.name}</span>
        <span className="city-row__region">{city.region}</span>
        <span className="city-row__times">
          {sunriseLabel} – {sunsetLabel}
        </span>
      </div>
      <div className="city-row__bar">
        {/* Night background, daylight overlay */}
        <div className="city-row__night" />
        {sunrisePercent !== null && sunsetPercent !== null && (
          <div
            className="city-row__daylight"
            style={{
              left: `${sunrisePercent}%`,
              width: `${sunsetPercent - sunrisePercent}%`,
            }}
          />
        )}
      </div>
    </div>
  );
}
