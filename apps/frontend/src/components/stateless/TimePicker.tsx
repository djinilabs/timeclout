import { FC } from "react";

export interface TimePickerProps {
  min?: [number, number];
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const changeTime = (time: string, change: "increase" | "decrease") => {
  const [hours, minutes] = time.split(":");
  let newMinutes = parseInt(minutes) + (change === "increase" ? 15 : -15);
  let newHours = parseInt(hours);
  if (newMinutes < 0) {
    newMinutes = 45;
    newHours = newHours - 1;
  } else if (newMinutes >= 60) {
    newMinutes = 0;
    newHours = newHours + 1;
  }
  return `${newHours.toString().padStart(2, "0")}:${newMinutes
    .toString()
    .padStart(2, "0")}`;
};

const parseTime = (time: string): [number, number] => {
  const [hours, minutes] = time.split(":");
  return [parseInt(hours), parseInt(minutes)];
};

const encodeTime = (time: [number, number]): string => {
  return `${time[0].toString().padStart(2, "0")}:${time[1]
    .toString()
    .padStart(2, "0")}`;
};

export const TimePicker: FC<TimePickerProps> = ({ value, min, onChange }) => {
  const isNextDay = value[0] >= 24;
  const displayValue: [number, number] = isNextDay
    ? [value[0] - 24, value[1]]
    : value;

  return (
    <div className="flex items-center">
      <div className="relative">
        <input
          type="time"
          required
          className="h-9"
          value={encodeTime(displayValue)}
          min={min ? encodeTime(min) : undefined}
          onChange={(ev) => {
            const newTime = parseTime(ev.target.value);
            const adjustedTime: [number, number] = isNextDay
              ? [newTime[0] + 24, newTime[1]]
              : newTime;
            if (min) {
              const minMinutes = min[0] * 60 + min[1];
              const newMinutes = adjustedTime[0] * 60 + adjustedTime[1];
              if (newMinutes < minMinutes) {
                return;
              }
            }
            onChange(adjustedTime);
          }}
        />
        {isNextDay && (
          <span className="-right-14 top-1/2 -translate-y-1/2 text-xs text-gray-500">
            next day
          </span>
        )}
      </div>
      <button
        type="button"
        className="h-9 px-1 text-gray-400 hover:text-gray-500"
        onClick={() => {
          const newTime = parseTime(
            changeTime(encodeTime(displayValue), "increase")
          );
          const adjustedTime: [number, number] = isNextDay
            ? [newTime[0] + 24, newTime[1]]
            : newTime;
          if (min) {
            const minMinutes = min[0] * 60 + min[1];
            const newMinutes = adjustedTime[0] * 60 + adjustedTime[1];
            if (newMinutes < minMinutes) {
              return;
            }
          }
          onChange(adjustedTime);
        }}
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <button
        type="button"
        className="h-9 px-1 text-gray-400 hover:text-gray-500"
        onClick={() => {
          const newTime = parseTime(
            changeTime(encodeTime(displayValue), "decrease")
          );
          const adjustedTime: [number, number] = isNextDay
            ? [newTime[0] + 24, newTime[1]]
            : newTime;
          if (min) {
            const minMinutes = min[0] * 60 + min[1];
            const newMinutes = adjustedTime[0] * 60 + adjustedTime[1];
            if (newMinutes < minMinutes) {
              return;
            }
          }
          onChange(adjustedTime);
        }}
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};
