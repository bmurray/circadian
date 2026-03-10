import { useCallback, useMemo, useState } from "react";
import { DaySlider } from "./components/DaySlider";
import { DstToggle } from "./components/DstToggle";
import { CitySelector } from "./components/CitySelector";
import { Timeline } from "./components/Timeline";
import { useSunTimes } from "./hooks/useSunTimes";
import { dayOfYear } from "./lib/sun";
import { ALL_CITIES, DEFAULT_CITY_IDS, type CityData, type DstMode } from "./lib/cities";
import "./App.css";

const now = new Date();
const currentYear = now.getFullYear();
const currentDay = dayOfYear(now);

export default function App() {
  const [day, setDay] = useState(currentDay);
  const [dstMode, setDstMode] = useState<DstMode>("auto");
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_CITY_IDS);

  const selectedCities = useMemo(
    () =>
      selectedIds
        .map((id) => ALL_CITIES.find((c) => c.id === id))
        .filter((c): c is CityData => c !== undefined),
    [selectedIds],
  );

  const sunTimes = useSunTimes(selectedCities, day, dstMode);

  const handleAddCity = useCallback((city: CityData) => {
    setSelectedIds((prev) => [...prev, city.id]);
  }, []);

  const handleRemoveCity = useCallback((id: string) => {
    setSelectedIds((prev) => prev.filter((cid) => cid !== id));
  }, []);

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Timezoner</h1>
        <p className="app__subtitle">Compare sunrise & sunset across cities</p>
      </header>
      <div className="app__controls">
        <DaySlider dayOfYear={day} onChange={setDay} year={currentYear} />
        <DstToggle mode={dstMode} onChange={setDstMode} />
      </div>
      <CitySelector
        selectedIds={selectedIds}
        onAdd={handleAddCity}
        onRemove={handleRemoveCity}
      />
      <Timeline sunTimes={sunTimes} />
    </div>
  );
}
