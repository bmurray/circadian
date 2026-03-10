import { useMemo } from "react";
import { calculateSunTimes } from "../lib/sun";
import { type CityData, type DstMode, getEffectiveOffset } from "../lib/cities";

export type SunTimesResult = {
  city: CityData;
  sunrise: number | null;
  sunset: number | null;
};

export function useSunTimes(
  cities: CityData[],
  dayOfYear: number,
  dstMode: DstMode,
): SunTimesResult[] {
  return useMemo(() => {
    return cities.map((city) => {
      const offset = getEffectiveOffset(city, dstMode, dayOfYear);
      const result = calculateSunTimes(
        dayOfYear,
        city.latitude,
        city.longitude,
        offset,
      );
      return {
        city,
        sunrise: result?.sunrise ?? null,
        sunset: result?.sunset ?? null,
      };
    });
  }, [cities, dayOfYear, dstMode]);
}
