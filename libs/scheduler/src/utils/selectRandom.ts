import { i18n } from "@/locales";

export const selectRandom = <T>(from: Array<T>): T => {
  if (from.length === 0) {
    throw new TypeError(i18n._("No elements to select from"));
  }
  return from[Math.floor(Math.random() * from.length)]!;
};
