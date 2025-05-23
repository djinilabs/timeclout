import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const workScheduleSettingsHelp: HelpSection = {
  title: "Work Schedule Settings",
  description: (
    <>
      Configure your team's work schedule settings. Define working hours,
      timezone, and other schedule-related preferences to ensure proper shift
      management.
    </>
  ),
  features: [
    {
      title: "Working Hours",
      description: "Set up standard working hours and break times",
    },
    {
      title: "Timezone Configuration",
      description: "Configure the team's timezone for accurate scheduling",
    },
    {
      title: "Schedule Preferences",
      description: "Define schedule-related preferences and constraints",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="work-schedule-settings" />,
  roles: <RoleBasedHelp context="work-schedule-settings" />,
};
