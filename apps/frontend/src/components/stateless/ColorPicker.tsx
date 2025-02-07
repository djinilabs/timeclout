import { FC } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { classNames } from "../../utils/classNames";
import { leaveTypeColors } from "../../settings/leaveTypes";

export type Color = keyof typeof leaveTypeColors;

export const ColorPicker: FC<{
  value: Color | undefined;
  onChange: (value: Color) => void;
}> = ({ value, onChange }) => {
  return (
    <RadioGroup
      value={value}
      onChange={onChange}
      className="mt-6 flex items-center space-x-3"
    >
      {Object.entries(leaveTypeColors).map(([key, color]) => (
        <Radio
          key={key}
          value={key}
          aria-label={key}
          className={classNames(
            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-current focus:outline-none data-[checked]:ring-2 data-[focus]:data-[checked]:ring data-[focus]:data-[checked]:ring-offset-1"
          )}
        >
          <span
            aria-hidden="true"
            style={{
              backgroundColor: color,
            }}
            className="size-8 rounded-full border border-black/10 bg-current"
          />
        </Radio>
      ))}
    </RadioGroup>
  );
};
