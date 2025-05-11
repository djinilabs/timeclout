import { i18n } from "@lingui/core";
import { FC } from "react";
import {
  DayPicker as DayPickerComponent,
  DayPickerProps,
  Mode,
  type Locale,
} from "react-day-picker";
import { enUS, pt } from "react-day-picker/locale";
import defaultClassNames from "react-day-picker/style.module.css";
import { LabeledSwitch } from "./LabeledSwitch";

const locales: Record<string, Partial<Locale>> = {
  en: enUS,
  pt: pt,
};

interface DayPickerSelectModeChoiceProps {
  modes: Mode[];
  selected: Mode;
  setMode: (mode: Mode) => unknown;
}

const DayPickerSelectModeChoice: FC<DayPickerSelectModeChoiceProps> = ({
  modes,
  selected,
  setMode,
}) => {
  return (
    <div className="flex gap-4">
      {modes.map((mode) => (
        <LabeledSwitch
          label={mode}
          checked={selected === mode}
          onChange={(checked) => {
            if (checked) {
              setMode(mode);
            }
          }}
        />
      ))}
    </div>
  );
};

export type OurDayPickerProps = DayPickerProps & {
  modes?: Mode[];
  mode: Mode;
  onChangeMode?: (mode: Mode) => unknown;
};

export const DayPicker: FC<OurDayPickerProps> = ({
  modes,
  mode,
  onChangeMode,
  ...props
}) => {
  const locale = locales[i18n.locale];
  const dayPickerProps = {
    ...props,
    mode,
  } as DayPickerProps;
  return (
    <div>
      {modes && onChangeMode ? (
        <DayPickerSelectModeChoice
          modes={modes}
          selected={mode}
          setMode={onChangeMode}
        />
      ) : null}
      <DayPickerComponent
        {...dayPickerProps}
        locale={locale}
        classNames={{
          ...defaultClassNames,
          today: `border-amber-500`, // Add a border to today's date
          selected: `bg-teal-500 border-teal-500 text-white`, // Highlight the selected day
          root: `${defaultClassNames.root} shadow-lg p-5`, // Add a shadow to the root element
          chevron: `${defaultClassNames.chevron} fill-amber-500`,
          range_start: `bg-teal-200 border-teal-200 text-white rounded-l-md`,
          range_end: `bg-teal-200 border-teal-200 text-white rounded-r-md`,
          range_middle: `bg-teal-500 border-teal-500 text-white`,
        }}
        animate
      />
    </div>
  );
};
