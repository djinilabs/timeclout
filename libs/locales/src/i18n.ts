import { i18n } from "@lingui/core";

// Type definitions for messages
interface Messages {
  [key: string]: string | (string | unknown[])[];
}

// Messages will be loaded dynamically
const messages: Record<string, Messages> = {
  en: {},
  pt: {},
};

export async function initI18n(locale: string = "en"): Promise<void> {
  try {
    // Load messages dynamically if not already loaded
    if (!messages[locale] || Object.keys(messages[locale]).length === 0) {
      try {
        if (locale === "en") {
          const enModule = await import("./messages/en/messages.mjs");
          messages.en = enModule.messages;
        } else if (locale === "pt") {
          const ptModule = await import("./messages/pt/messages.mjs");
          messages.pt = ptModule.messages;
        }
      } catch (importError) {
        console.warn(
          `Failed to import messages for locale ${locale}:`,
          importError
        );
      }
    }

    // Try to load messages for the locale
    if (messages[locale] && Object.keys(messages[locale]).length > 0) {
      i18n.load(locale, messages[locale]);
      i18n.activate(locale);
    } else {
      // Fallback to English if locale not available
      if (Object.keys(messages.en).length === 0) {
        try {
          const enModule = await import("./messages/en/messages.mjs");
          messages.en = enModule.messages;
        } catch (importError) {
          console.warn("Failed to import English messages:", importError);
        }
      }
      i18n.load("en", messages.en);
      i18n.activate("en");
    }
  } catch (error) {
    console.warn(
      `Failed to load messages for locale ${locale}, falling back to English`,
      error
    );
    // Fallback to English
    i18n.load("en", messages.en);
    i18n.activate("en");
  }
}

export function getLocaleFromHeaders(acceptLanguage?: string): string {
  if (!acceptLanguage) return "en";

  // Parse accept-language header and return preferred locale
  // Format: "en-US,en;q=0.9,pt;q=0.8"
  const preferred = acceptLanguage.split(",")[0].split(";")[0].trim();

  // Check if it starts with 'pt' for Portuguese
  if (preferred.startsWith("pt")) {
    return "pt";
  }

  // Default to English for everything else
  return "en";
}
