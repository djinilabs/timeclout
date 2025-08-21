import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";
import { HelpSection } from "../types";

export const timeOffDashboardHelp: HelpSection = {
  title: "Time Off Dashboard",
  description: (
    <>
      View and manage time off across your organization. Monitor leave balances,
      upcoming absences, and team coverage to ensure smooth operations.
    </>
  ),
  features: [
    {
      title: "Leave Overview",
      description: "View all approved and pending leave requests across teams",
    },
    {
      title: "Balance Tracking",
      description: "Monitor leave balances and quotas for team members",
    },
    {
      title: "Coverage Planning",
      description: "Plan for team coverage during member absences",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="time-off-dashboard" />,
  roles: <RoleBasedHelp context="time-off-dashboard" />,
};
