import { useCallback, useMemo } from "react";

type DaySliderProps = {
  dayOfYear: number;
  onChange: (day: number) => void;
  year: number;
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function dayToDateString(day: number, year: number): string {
  const date = new Date(year, 0, day);
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
}

export function DaySlider({ dayOfYear, onChange, year }: DaySliderProps) {
  const isLeapYear = useMemo(
    () => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0,
    [year],
  );
  const maxDay = isLeapYear ? 366 : 365;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseInt(e.target.value, 10));
    },
    [onChange],
  );

  const dateLabel = useMemo(
    () => dayToDateString(dayOfYear, year),
    [dayOfYear, year],
  );

  return (
    <div className="day-slider">
      <label className="day-slider__label">
        Date: <strong>{dateLabel}</strong>
      </label>
      <input
        type="range"
        className="day-slider__input"
        min={1}
        max={maxDay}
        value={dayOfYear}
        onChange={handleChange}
      />
    </div>
  );
}
