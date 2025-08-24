export const getHelpSection = (
  company?: string,
  unit?: string,
  team?: string,
  tab?: string,
  settingsTab?: string,
  dialog?: string,
  teamShiftScheduleDialog?: string
): string => {
  // First check for team-shift-schedule-dialog parameter
  if (teamShiftScheduleDialog) {
    switch (teamShiftScheduleDialog) {
      case "create": {
        return "create-shift";
      }
      case "autoFill": {
        return "auto-fill";
      }
      case "unassign": {
        return "unassign-shift";
      }
      default: {
        break;
      }
    }
  }

  // Then check for dialog parameter
  if (dialog) {
    switch (dialog) {
      case "new-leave-request": {
        return "new-leave-request";
      }
      case "team-invitations": {
        return "team-invitations";
      }
      default: {
        break;
      }
    }
  }

  // Then check for specific pages
  if (tab) {
    switch (tab) {
      case "shifts-calendar": {
        return "shifts-calendar";
      }
      case "leave-schedule": {
        return "team-leave-calendar";
      }
      case "members": {
        return "member-management";
      }
      case "invitations": {
        return "team-invitations";
      }
      case "time-off": {
        return "time-off-dashboard";
      }
      case "my-leave-requests": {
        return "leave-request-management";
      }
      case "pending-leave-requests": {
        return "leave-approval-dashboard";
      }
      case "units": {
        return "unit-management";
      }
      case "teams": {
        return "team-management";
      }
      default: {
        break;
      }
    }
  }

  // Then check for settings pages
  if (settingsTab) {
    switch (settingsTab) {
      case "work-schedule": {
        return "work-schedule-settings";
      }
      case "yearly-quota": {
        return "yearly-quota-settings";
      }
      case "qualifications": {
        return "qualifications-settings";
      }
      case "schedule-position-templates": {
        return "schedule-position-templates";
      }
      default: {
        break;
      }
    }
  }

  // Then check for company/unit/team level
  if (company) {
    if (unit) {
      if (team) {
        return "team-management";
      }
      return "unit-management";
    }
    return "company-dashboard";
  }

  // Default to shifts calendar if no specific context is found
  return "shifts-calendar";
};
