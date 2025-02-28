import { i18n } from "@lingui/core";

export const locales = {
  en: "English",
  pt: "Português",
};

export async function dynamicActivate(locale: string) {
  const { messages } = await import(`./locales/${locale}/messages.mjs`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}
