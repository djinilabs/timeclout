// Import language-specific components (keeping these static for now)
import { FeatureDependenciesHelp as FeatureDependenciesHelpEn } from "./components/FeatureDependenciesHelp";
import { FeatureDependenciesHelp as FeatureDependenciesHelpPt } from "./components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp as RoleBasedHelpEn } from "./components/RoleBasedHelp";
import { RoleBasedHelp as RoleBasedHelpPt } from "./components/RoleBasedHelp.pt";
// Static imports for English help content
import { autoFillHelp as autoFillHelpEn } from "./en/auto-fill";
import { companyDashboardHelp as companyDashboardHelpEn } from "./en/company-dashboard";
import { companySettingsHelp as companySettingsHelpEn } from "./en/company-settings";
import { createShiftHelp as createShiftHelpEn } from "./en/create-shift";
import { defaultHelp as defaultHelpEn } from "./en/default";
import { leaveApprovalDashboardHelp as leaveApprovalDashboardHelpEn } from "./en/leave-approval-dashboard";
import { leaveRequestManagementHelp as leaveRequestManagementHelpEn } from "./en/leave-request-management";
import { memberManagementHelp as memberManagementHelpEn } from "./en/member-management";
import { newLeaveRequestHelp as newLeaveRequestHelpEn } from "./en/new-leave-request";
import { qualificationsSettingsHelp as qualificationsSettingsHelpEn } from "./en/qualifications-settings";
import { schedulePositionTemplatesHelp as schedulePositionTemplatesHelpEn } from "./en/schedule-position-templates";
import { shiftsCalendarHelp as shiftsCalendarHelpEn } from "./en/shifts-calendar";
import { teamInvitationsHelp as teamInvitationsHelpEn } from "./en/team-invitations";
import { teamLeaveCalendarHelp as teamLeaveCalendarHelpEn } from "./en/team-leave-calendar";
import { teamManagementHelp as teamManagementHelpEn } from "./en/team-management";
import { teamSettingsHelp as teamSettingsHelpEn } from "./en/team-settings";
import { timeOffDashboardHelp as timeOffDashboardHelpEn } from "./en/time-off-dashboard";
import { unassignShiftHelp as unassignShiftHelpEn } from "./en/unassign-shift";
import { unitManagementHelp as unitManagementHelpEn } from "./en/unit-management";
import { unitSettingsHelp as unitSettingsHelpEn } from "./en/unit-settings";
import { workScheduleSettingsHelp as workScheduleSettingsHelpEn } from "./en/work-schedule-settings";
import { yearlyQuotaSettingsHelp as yearlyQuotaSettingsHelpEn } from "./en/yearly-quota-settings";
// Static imports for Portuguese help content
import { autoFillHelp as autoFillHelpPt } from "./pt/auto-fill";
import { companyDashboardHelp as companyDashboardHelpPt } from "./pt/company-dashboard";
import { companySettingsHelp as companySettingsHelpPt } from "./pt/company-settings";
import { createShiftHelp as createShiftHelpPt } from "./pt/create-shift";
import { defaultHelp as defaultHelpPt } from "./pt/default";
import { leaveApprovalDashboardHelp as leaveApprovalDashboardHelpPt } from "./pt/leave-approval-dashboard";
import { leaveRequestManagementHelp as leaveRequestManagementHelpPt } from "./pt/leave-request-management";
import { memberManagementHelp as memberManagementHelpPt } from "./pt/member-management";
import { newLeaveRequestHelp as newLeaveRequestHelpPt } from "./pt/new-leave-request";
import { qualificationsSettingsHelp as qualificationsSettingsHelpPt } from "./pt/qualifications-settings";
import { schedulePositionTemplatesHelp as schedulePositionTemplatesHelpPt } from "./pt/schedule-position-templates";
import { shiftsCalendarHelp as shiftsCalendarHelpPt } from "./pt/shifts-calendar";
import { teamInvitationsHelp as teamInvitationsHelpPt } from "./pt/team-invitations";
import { teamLeaveCalendarHelp as teamLeaveCalendarHelpPt } from "./pt/team-leave-calendar";
import { teamManagementHelp as teamManagementHelpPt } from "./pt/team-management";
import { teamSettingsHelp as teamSettingsHelpPt } from "./pt/team-settings";
import { timeOffDashboardHelp as timeOffDashboardHelpPt } from "./pt/time-off-dashboard";
import { unassignShiftHelp as unassignShiftHelpPt } from "./pt/unassign-shift";
import { unitManagementHelp as unitManagementHelpPt } from "./pt/unit-management";
import { unitSettingsHelp as unitSettingsHelpPt } from "./pt/unit-settings";
import { workScheduleSettingsHelp as workScheduleSettingsHelpPt } from "./pt/work-schedule-settings";
import { yearlyQuotaSettingsHelp as yearlyQuotaSettingsHelpPt } from "./pt/yearly-quota-settings";
import { HelpSection, HelpComponentName, LanguageComponentsMap } from "./types";
import { getHelpSection } from "./utils";

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

// Help content maps
const helpContentMap: Record<string, Record<string, HelpSection>> = {
  en: {
    "shifts-calendar": shiftsCalendarHelpEn,
    "company-dashboard": companyDashboardHelpEn,
    "unit-management": unitManagementHelpEn,
    "team-management": teamManagementHelpEn,
    "member-management": memberManagementHelpEn,
    "create-shift": createShiftHelpEn,
    "auto-fill": autoFillHelpEn,
    "team-leave-calendar": teamLeaveCalendarHelpEn,
    "new-leave-request": newLeaveRequestHelpEn,
    "time-off-dashboard": timeOffDashboardHelpEn,
    "leave-request-management": leaveRequestManagementHelpEn,
    "work-schedule-settings": workScheduleSettingsHelpEn,
    "yearly-quota-settings": yearlyQuotaSettingsHelpEn,
    "company-settings": companySettingsHelpEn,
    "leave-approval-dashboard": leaveApprovalDashboardHelpEn,
    "unit-settings": unitSettingsHelpEn,
    "team-invitations": teamInvitationsHelpEn,
    "team-settings": teamSettingsHelpEn,
    "unassign-shift": unassignShiftHelpEn,
    "qualifications-settings": qualificationsSettingsHelpEn,
    "schedule-position-templates": schedulePositionTemplatesHelpEn,
    default: defaultHelpEn,
  },
  pt: {
    "shifts-calendar": shiftsCalendarHelpPt,
    "company-dashboard": companyDashboardHelpPt,
    "unit-management": unitManagementHelpPt,
    "team-management": teamManagementHelpPt,
    "member-management": memberManagementHelpPt,
    "create-shift": createShiftHelpPt,
    "auto-fill": autoFillHelpPt,
    "team-leave-calendar": teamLeaveCalendarHelpPt,
    "new-leave-request": newLeaveRequestHelpPt,
    "time-off-dashboard": timeOffDashboardHelpPt,
    "leave-request-management": leaveRequestManagementHelpPt,
    "work-schedule-settings": workScheduleSettingsHelpPt,
    "yearly-quota-settings": yearlyQuotaSettingsHelpPt,
    "company-settings": companySettingsHelpPt,
    "leave-approval-dashboard": leaveApprovalDashboardHelpPt,
    "unit-settings": unitSettingsHelpPt,
    "team-invitations": teamInvitationsHelpPt,
    "team-settings": teamSettingsHelpPt,
    "unassign-shift": unassignShiftHelpPt,
    "qualifications-settings": qualificationsSettingsHelpPt,
    "schedule-position-templates": schedulePositionTemplatesHelpPt,
    default: defaultHelpPt,
  },
};

// Function to get help content (now synchronous)
function getHelpContent(section: string, language: "en" | "pt"): HelpSection {
  const languageMap = helpContentMap[language];
  const helpContent = languageMap[section] || languageMap["default"];

  if (!helpContent) {
    console.warn(
      `Help content not found for section ${section} in language ${language}, falling back to default`
    );
    return (
      languageMap["default"] || {
        title: "Help",
        description: "Help content not available.",
      }
    );
  }

  return helpContent;
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
  return getHelpContent(section, language);
};

export const getLanguageComponent = (
  componentName: HelpComponentName,
  language: "en" | "pt" = "en"
) => {
  return languageComponents[language][componentName];
};
