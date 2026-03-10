import { useCallback, useMemo, useState } from "react";
import { ALL_CITIES, type CityData } from "../lib/cities";

type CitySelectorProps = {
  selectedIds: string[];
  onAdd: (city: CityData) => void;
  onRemove: (id: string) => void;
};

export function CitySelector({ selectedIds, onAdd, onRemove }: CitySelectorProps) {
  const [search, setSearch] = useState("");

  const availableCities = useMemo(
    () => ALL_CITIES.filter((c) => !selectedIds.includes(c.id)),
    [selectedIds],
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return availableCities;
    const q = search.toLowerCase();
    return availableCities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q),
    );
  }, [availableCities, search]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [],
  );

  const handleAdd = useCallback(
    (city: CityData) => () => {
      onAdd(city);
      setSearch("");
    },
    [onAdd],
  );

  const handleRemove = useCallback(
    (id: string) => () => {
      onRemove(id);
    },
    [onRemove],
  );

  const selectedCities = useMemo(
    () => selectedIds.map((id) => ALL_CITIES.find((c) => c.id === id)!).filter(Boolean),
    [selectedIds],
  );

  return (
    <div className="city-selector">
      <div className="city-selector__selected">
        {selectedCities.map((city) => (
          <span key={city.id} className="city-selector__tag">
            {city.name}, {city.region}
            <button
              className="city-selector__remove"
              onClick={handleRemove(city.id)}
              type="button"
              aria-label={`Remove ${city.name}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="city-selector__search">
        <input
          type="text"
          placeholder="Add a city..."
          value={search}
          onChange={handleSearchChange}
          className="city-selector__input"
        />
        {search.trim() && filtered.length > 0 && (
          <ul className="city-selector__dropdown">
            {filtered.map((city) => (
              <li key={city.id}>
                <button
                  className="city-selector__option"
                  onClick={handleAdd(city)}
                  type="button"
                >
                  {city.name}, {city.region}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
