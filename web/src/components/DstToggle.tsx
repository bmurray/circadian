import { useCallback } from "react";
import type { DstMode } from "../lib/cities";

type DstToggleProps = {
  mode: DstMode;
  onChange: (mode: DstMode) => void;
};

const OPTIONS: { value: DstMode; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "dst", label: "DST" },
  { value: "standard", label: "Standard" },
];

export function DstToggle({ mode, onChange }: DstToggleProps) {
  const handleClick = useCallback(
    (value: DstMode) => () => {
      onChange(value);
    },
    [onChange],
  );

  return (
    <div className="dst-toggle">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`dst-toggle__btn ${mode === opt.value ? "dst-toggle__btn--active" : ""}`}
          onClick={handleClick(opt.value)}
          type="button"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
