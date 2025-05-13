import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const shiftsCalendarHelp: HelpSection = {
  title: "Shift Management",
  description: (
    <>
      Organize team work schedules effectively. Create and manage shift
      positions while ensuring adequate coverage. The calendar shows shifts for
      the selected month, with automatic polling to stay up-to-date.
    </>
  ),
  features: [
    {
      title: "Date range filtering",
      description: "View shifts within specific start and end dates",
    },
    {
      title: "Real-time updates",
      description: "Automatic polling keeps the schedule current",
    },
    {
      title: "Position management",
      description: "Create and edit shift positions with custom details",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="shifts-calendar" />,
  roles: <RoleBasedHelp />,
};
