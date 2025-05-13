import { HelpSection, HelpComponentName, LanguageComponentsMap } from "./types";
import { getHelpSection } from "./utils";

// Import all help sections
import { shiftsCalendarHelp } from "./pt/shifts-calendar";
import { companyDashboardHelp } from "./pt/company-dashboard";
import { unitManagementHelp } from "./pt/unit-management";
import { teamManagementHelp } from "./pt/team-management";
import { memberManagementHelp } from "./pt/member-management";
import { createShiftHelp } from "./pt/create-shift";
import { autoFillHelp } from "./pt/auto-fill";
import { teamLeaveCalendarHelp } from "./pt/team-leave-calendar";
import { newLeaveRequestHelp } from "./pt/new-leave-request";
import { timeOffDashboardHelp } from "./pt/time-off-dashboard";
import { leaveRequestManagementHelp } from "./pt/leave-request-management";
import { workScheduleSettingsHelp } from "./pt/work-schedule-settings";
import { yearlyQuotaSettingsHelp } from "./pt/yearly-quota-settings";
import { companySettingsHelp } from "./pt/company-settings";
import { leaveApprovalDashboardHelp } from "./pt/leave-approval-dashboard";
import { unitSettingsHelp } from "./pt/unit-settings";
import { teamInvitationsHelp } from "./pt/team-invitations";
import { teamSettingsHelp } from "./pt/team-settings";
import { unassignShiftHelp } from "./pt/unassign-shift";
import { qualificationsSettingsHelp } from "./pt/qualifications-settings";
import { schedulePositionTemplatesHelp } from "./pt/schedule-position-templates";
import defaultHelp from "./pt/default";

// Import language-specific components
import { FeatureDependenciesHelp as FeatureDependenciesHelpEn } from "./components/FeatureDependenciesHelp";
import { RoleBasedHelp as RoleBasedHelpEn } from "./components/RoleBasedHelp";
import { FeatureDependenciesHelp as FeatureDependenciesHelpPt } from "./components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp as RoleBasedHelpPt } from "./components/RoleBasedHelp.pt";

// Map of all help sections
const helpContent: Record<string, HelpSection> = {
  "shifts-calendar": shiftsCalendarHelp,
  "company-dashboard": companyDashboardHelp,
  "unit-management": unitManagementHelp,
  "team-management": teamManagementHelp,
  "member-management": memberManagementHelp,
  "create-shift": createShiftHelp,
  "auto-fill": autoFillHelp,
  "team-leave-calendar": teamLeaveCalendarHelp,
  "new-leave-request": newLeaveRequestHelp,
  "time-off-dashboard": timeOffDashboardHelp,
  "leave-request-management": leaveRequestManagementHelp,
  "work-schedule-settings": workScheduleSettingsHelp,
  "yearly-quota-settings": yearlyQuotaSettingsHelp,
  "company-settings": companySettingsHelp,
  "leave-approval-dashboard": leaveApprovalDashboardHelp,
  "unit-settings": unitSettingsHelp,
  "team-invitations": teamInvitationsHelp,
  "team-settings": teamSettingsHelp,
  "unassign-shift": unassignShiftHelp,
  "qualifications-settings": qualificationsSettingsHelp,
  "schedule-position-templates": schedulePositionTemplatesHelp,
  default: defaultHelp,
};

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

export const getContextualHelp = (
  company?: string,
  unit?: string,
  team?: string,
  tab?: string,
  settingsTab?: string,
  dialog?: string,
  teamShiftScheduleDialog?: string,
  language: "en" | "pt" = "en"
): HelpSection => {
  console.log("getContextualHelp", {
    company,
    unit,
    team,
    tab,
    settingsTab,
    dialog,
    teamShiftScheduleDialog,
    language,
  });

  const section = getHelpSection(
    company,
    unit,
    team,
    tab,
    settingsTab,
    dialog,
    teamShiftScheduleDialog
  );
  console.log("section", section);
  return helpContent[section] || helpContent["default"];
};

export const getLanguageComponent = (
  componentName: HelpComponentName,
  language: "en" | "pt" = "en"
) => {
  return languageComponents[language][componentName];
};
