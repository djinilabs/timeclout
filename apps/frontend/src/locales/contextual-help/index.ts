import { HelpSection } from "./types";
import { getHelpSection } from "./utils";

// Import all help sections
import { shiftsCalendarHelp } from "./en/shifts-calendar";
import { companyDashboardHelp } from "./en/company-dashboard";
import { unitManagementHelp } from "./en/unit-management";
import { teamManagementHelp } from "./en/team-management";
import { memberManagementHelp } from "./en/member-management";
import { createShiftHelp } from "./en/create-shift";
import { autoFillHelp } from "./en/auto-fill";
import { teamLeaveCalendarHelp } from "./en/team-leave-calendar";
import { newLeaveRequestHelp } from "./en/new-leave-request";
import { timeOffDashboardHelp } from "./en/time-off-dashboard";
import { leaveRequestManagementHelp } from "./en/leave-request-management";
import { workScheduleSettingsHelp } from "./en/work-schedule-settings";
import { yearlyQuotaSettingsHelp } from "./en/yearly-quota-settings";
import { companySettingsHelp } from "./en/company-settings";
import { leaveApprovalDashboardHelp } from "./en/leave-approval-dashboard";
import { unitSettingsHelp } from "./en/unit-settings";
import { teamInvitationsHelp } from "./en/team-invitations";
import { teamSettingsHelp } from "./en/team-settings";
import { unassignShiftHelp } from "./en/unassign-shift";
import defaultHelp from "./en/default";

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
  default: defaultHelp,
};

export const getContextualHelp = (
  company?: string,
  unit?: string,
  team?: string,
  tab?: string,
  settingsTab?: string,
  dialog?: string,
  teamShiftScheduleDialog?: string
): HelpSection => {
  console.log("getContextualHelp", {
    company,
    unit,
    team,
    tab,
    settingsTab,
    dialog,
    teamShiftScheduleDialog,
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
