import { FC, memo } from "react";

export interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label?: string; // Optional label for the slider
}

export const RangeSlider: FC<RangeSliderProps> = memo(
  ({ min, max, value, onChange, label = "Range slider" }) => {
    return (
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #008080 0%, #008080 ${value}%, #e0e0e0 ${value}%, #e0e0e0 100%)`,
        }}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value} out of ${max}`}
      />
    );
  }
);
