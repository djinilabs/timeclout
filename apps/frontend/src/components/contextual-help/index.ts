import { HelpSection, HelpComponentName, LanguageComponentsMap } from "./types";
import { getHelpSection } from "./utils";

// Import language-specific components (keeping these static for now)
import { FeatureDependenciesHelp as FeatureDependenciesHelpEn } from "./components/FeatureDependenciesHelp";
import { RoleBasedHelp as RoleBasedHelpEn } from "./components/RoleBasedHelp";
import { FeatureDependenciesHelp as FeatureDependenciesHelpPt } from "./components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp as RoleBasedHelpPt } from "./components/RoleBasedHelp.pt";

// Map of language-specific components
const languageComponents: LanguageComponentsMap = {
  en: {
    FeatureDependenciesHelp: FeatureDependenciesHelpEn,
    RoleBasedHelp: RoleBasedHelpEn,
  },
  pt: {
    FeatureDependenciesHelp: FeatureDependenciesHelpPt,
    RoleBasedHelp: RoleBasedHelpPt,
  },
};

// Cache for loaded help content
const helpContentCache: Record<string, Record<string, HelpSection>> = {
  en: {},
  pt: {},
};

// Dynamic import function for help content
async function loadHelpContent(
  section: string,
  language: "en" | "pt"
): Promise<HelpSection> {
  // Check cache first
  if (helpContentCache[language][section]) {
    return helpContentCache[language][section];
  }

  try {
    let helpModule;

    switch (section) {
      case "shifts-calendar":
        helpModule = await import(`./${language}/shifts-calendar`);
        break;
      case "company-dashboard":
        helpModule = await import(`./${language}/company-dashboard`);
        break;
      case "unit-management":
        helpModule = await import(`./${language}/unit-management`);
        break;
      case "team-management":
        helpModule = await import(`./${language}/team-management`);
        break;
      case "member-management":
        helpModule = await import(`./${language}/member-management`);
        break;
      case "create-shift":
        helpModule = await import(`./${language}/create-shift`);
        break;
      case "auto-fill":
        helpModule = await import(`./${language}/auto-fill`);
        break;
      case "team-leave-calendar":
        helpModule = await import(`./${language}/team-leave-calendar`);
        break;
      case "new-leave-request":
        helpModule = await import(`./${language}/new-leave-request`);
        break;
      case "time-off-dashboard":
        helpModule = await import(`./${language}/time-off-dashboard`);
        break;
      case "leave-request-management":
        helpModule = await import(`./${language}/leave-request-management`);
        break;
      case "work-schedule-settings":
        helpModule = await import(`./${language}/work-schedule-settings`);
        break;
      case "yearly-quota-settings":
        helpModule = await import(`./${language}/yearly-quota-settings`);
        break;
      case "company-settings":
        helpModule = await import(`./${language}/company-settings`);
        break;
      case "leave-approval-dashboard":
        helpModule = await import(`./${language}/leave-approval-dashboard`);
        break;
      case "unit-settings":
        helpModule = await import(`./${language}/unit-settings`);
        break;
      case "team-invitations":
        helpModule = await import(`./${language}/team-invitations`);
        break;
      case "team-settings":
        helpModule = await import(`./${language}/team-settings`);
        break;
      case "unassign-shift":
        helpModule = await import(`./${language}/unassign-shift`);
        break;
      case "qualifications-settings":
        helpModule = await import(`./${language}/qualifications-settings`);
        break;
      case "schedule-position-templates":
        helpModule = await import(`./${language}/schedule-position-templates`);
        break;
      default:
        helpModule = await import(`./${language}/default`);
        break;
    }

    // Extract the help content from the module
    const helpContent =
      helpModule.default ||
      helpModule[
        `${section.replace(/-([a-z])/g, (_, letter) =>
          letter.toUpperCase()
        )}Help`
      ];

    // Cache the result
    helpContentCache[language][section] = helpContent;

    return helpContent;
  } catch (error) {
    console.warn(
      `Failed to load help content for section ${section} in language ${language}:`,
      error
    );

    // Fallback to default help content
    try {
      const defaultModule = await import(`./${language}/default`);
      const defaultHelp = defaultModule.default;
      helpContentCache[language][section] = defaultHelp;
      return defaultHelp;
    } catch (fallbackError) {
      console.error(
        `Failed to load default help content for language ${language}:`,
        fallbackError
      );
      // Return a minimal fallback
      return {
        title: "Help",
        description: "Help content not available.",
      };
    }
  }
}

export const getContextualHelp = async (
  company?: string,
  unit?: string,
  team?: string,
  tab?: string,
  settingsTab?: string,
  dialog?: string,
  teamShiftScheduleDialog?: string,
  language: "en" | "pt" = "en"
): Promise<HelpSection> => {
  const section = getHelpSection(
    company,
    unit,
    team,
    tab,
    settingsTab,
    dialog,
    teamShiftScheduleDialog
  );
  console.log("section", section, "language", language);
  return await loadHelpContent(section, language);
};

export const getLanguageComponent = (
  componentName: HelpComponentName,
  language: "en" | "pt" = "en"
) => {
  return languageComponents[language][componentName];
};
