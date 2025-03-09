import { i18n } from "@lingui/core";
import { FC } from "react";
import { DayPicker as DayPickerComponent, type Locale } from "react-day-picker";
import { enUS, pt } from "react-day-picker/locale";

const locales: Record<string, Partial<Locale>> = {
  en: enUS,
  pt: pt,
};

export type DayPickerProps = Parameters<typeof DayPickerComponent>[0];

export const DayPicker: FC<DayPickerProps> = (props) => {
  const locale = locales[i18n.locale];
  return <DayPickerComponent {...props} locale={locale} />;
};
