import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";
import { HelpSection } from "../types";

export const workScheduleSettingsHelp: HelpSection = {
  title: "Work Schedule Settings",
  description: (
    <>
      Configure your team&apos;s{" "}
      <strong>working hours, timezone, and schedule preferences</strong>. These
      settings affect how shifts are displayed and scheduled.
    </>
  ),
  features: [
    {
      title: "Working Hours",
      description: "Set standard work days, start/end times, and break periods",
    },
    {
      title: "Timezone",
      description: "Configure team timezone for accurate shift scheduling",
    },
    {
      title: "Schedule Rules",
      description:
        "Define rest periods, overtime rules, and scheduling constraints",
    },
  ],
  sections: [
    {
      title: "Setting Up Working Hours",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            • <strong>Work Days:</strong> Select which days of the week are
            working days
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Start/End Times:</strong> Define standard shift start and
            end times
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Break Times:</strong> Set mandatory break periods during
            shifts
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Overtime Rules:</strong> Configure when shifts count as
            overtime
          </p>
        </div>
      ),
    },
    {
      title: "Timezone Configuration",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            • Choose your team&apos;s <strong>primary timezone</strong> for all
            scheduling
          </p>
          <p className="text-xs text-gray-600">
            • All shift times will be displayed in this timezone
          </p>
          <p className="text-xs text-gray-600">
            • Consider daylight saving time changes when setting up schedules
          </p>
        </div>
      ),
    },
  ],
  screenshots: [],
  dependencies: <FeatureDependenciesHelp context="work-schedule-settings" />,
  roles: <RoleBasedHelp context="work-schedule-settings" />,
};
