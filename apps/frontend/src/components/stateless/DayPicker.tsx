import { i18n } from "@lingui/core";
import { FC } from "react";
import { DayPicker as DayPickerComponent, type Locale } from "react-day-picker";
import { enUS, pt } from "react-day-picker/locale";
import defaultClassNames from "react-day-picker/style.module.css";

const locales: Record<string, Partial<Locale>> = {
  en: enUS,
  pt: pt,
};

export type DayPickerProps = Parameters<typeof DayPickerComponent>[0];

export const DayPicker: FC<DayPickerProps> = (props) => {
  const locale = locales[i18n.locale];
  console.log(defaultClassNames);
  return (
    <DayPickerComponent
      {...props}
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
  );
};
