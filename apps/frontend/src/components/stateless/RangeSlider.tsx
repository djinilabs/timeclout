import { FC } from "react";

export interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

export const RangeSlider: FC<RangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
}) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
    />
  );
};
