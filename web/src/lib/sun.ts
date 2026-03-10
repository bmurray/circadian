const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

/** Calculate sunrise and sunset times for a given date and location.
 *  Returns hours (fractional, 0-24) in local solar time.
 *  Uses the NOAA solar calculator algorithm. */
export function calculateSunTimes(
  dayOfYear: number,
  latitude: number,
  longitude: number,
  utcOffsetHours: number,
): { sunrise: number; sunset: number } | null {
  // Solar declination (Spencer, 1971)
  const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1);
  const declination =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  // Equation of time (minutes)
  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.04089 * Math.sin(2 * gamma));

  // Hour angle at sunrise/sunset (solar zenith = 90.833 degrees for atmospheric refraction)
  const zenith = 90.833 * DEG;
  const latRad = latitude * DEG;

  const cosHourAngle =
    (Math.cos(zenith) - Math.sin(latRad) * Math.sin(declination)) /
    (Math.cos(latRad) * Math.cos(declination));

  // No sunrise/sunset (polar day or night)
  if (cosHourAngle > 1 || cosHourAngle < -1) {
    return null;
  }

  const hourAngle = Math.acos(cosHourAngle) * RAD;

  // Solar noon in minutes from midnight UTC
  const solarNoonMinutes = 720 - 4 * longitude - eqTime;

  const sunriseUTC = solarNoonMinutes - hourAngle * 4;
  const sunsetUTC = solarNoonMinutes + hourAngle * 4;

  // Convert to local time hours
  const sunrise = (sunriseUTC + utcOffsetHours * 60) / 60;
  const sunset = (sunsetUTC + utcOffsetHours * 60) / 60;

  return {
    sunrise: ((sunrise % 24) + 24) % 24,
    sunset: ((sunset % 24) + 24) % 24,
  };
}

/** Get day of year from a Date */
export function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/** Format fractional hours (e.g. 6.5) to "6:30 AM" */
export function formatTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}
