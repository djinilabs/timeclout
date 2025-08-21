import { i18n } from "@lingui/core";
import { FC, memo } from "react";
import {
  DateRange,
  DayPicker as DayPickerComponent,
  DayPickerProps,
  Mode,
  TZDate,
  type Locale,
} from "react-day-picker";
import { enUS, pt } from "react-day-picker/locale";
import defaultClassNames from "react-day-picker/style.module.css";

import { LabeledSwitch } from "../particles/LabeledSwitch";

const locales: Record<string, Partial<Locale>> = {
  en: enUS,
  pt: pt,
};

interface DayPickerSelectModeChoiceProps {
  modes: Mode[];
  selected: Mode;
  setMode: (mode: Mode) => unknown;
}

const DayPickerSelectModeChoice: FC<DayPickerSelectModeChoiceProps> = memo(
  ({ modes, selected, setMode }) => {
    return (
      <div
        className="flex gap-4"
        role="radiogroup"
        aria-label="Date selection mode"
      >
        {modes.map((mode) => (
          <LabeledSwitch
            key={mode}
            label={mode}
            checked={selected === mode}
            onChange={(checked) => {
              if (checked) {
                setMode(mode);
              }
            }}
            aria-label={`Select ${mode} mode`}
          />
        ))}
      </div>
    );
  }
);

DayPickerSelectModeChoice.displayName = "DayPickerSelectModeChoice";

const fixDate = (date: Date): Date => {
  const isUTCMidnight =
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0;

  return isUTCMidnight
    ? new TZDate(date, "UTC")
    : new TZDate(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
        "UTC"
      );
};

export type OurDayPickerProps = Omit<
  DayPickerProps & {
    modes?: Mode[];
    mode: Mode;
    onSelectSingle?: (selected: Date) => unknown;
    onSelectMultiple?: (selected: Date[]) => unknown;
    onSelectRange?: (selected: DateRange) => unknown;
    onChangeMode?: (mode: Mode) => unknown;
  },
  "onSelect"
>;

export const DayPicker: FC<OurDayPickerProps> = memo(
  ({ modes, mode, onChangeMode, ...props }) => {
    const locale = locales[i18n.locale];
    const dayPickerProps = {
      ...props,
      mode,
      onSelect: (arg: unknown) => {
        if (!arg) {
          return;
        }
        if (props.onSelectSingle) {
          props.onSelectSingle(fixDate(arg as Date));
        } else if (props.onSelectMultiple) {
          props.onSelectMultiple((arg as Date[]).map(fixDate));
        } else if (props.onSelectRange) {
          const range = arg as DateRange;
          props.onSelectRange({
            from: fixDate(range.from as Date),
            to: range.to ? fixDate(range.to as Date) : undefined,
          });
        }
      },
    } as DayPickerProps;
    return (
      <div role="group" aria-label="Date picker">
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
          timeZone="UTC"
          ISOWeek
          weekStartsOn={1}
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
          aria-label={`Calendar for ${mode} date selection`}
          aria-selected={true}
          animate
        />
      </div>
    );
  }
);

DayPicker.displayName = "DayPicker";
