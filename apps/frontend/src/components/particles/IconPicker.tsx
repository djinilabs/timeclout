import { FC, memo } from "react";
import { leaveTypeIcons } from "../../settings/leaveTypes";

export interface IconPickerProps {
  value?: string;
  onChange: (value: keyof typeof leaveTypeIcons) => void;
}
export const IconPicker: FC<IconPickerProps> = memo(({ value, onChange }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(leaveTypeIcons).map(([key, icon]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              onChange(key as keyof typeof leaveTypeIcons);
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-md text-2xl ${
              value === key
                ? "bg-white text-gray-900 outline-2 outline-teal-600"
                : "bg-white text-gray-900 hover:bg-gray-50"
            }`}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
});
