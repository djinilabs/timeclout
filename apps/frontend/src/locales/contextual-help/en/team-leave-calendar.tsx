import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const teamLeaveCalendarHelp: HelpSection = {
  title: "Team Leave Calendar",
  description: (
    <>
      View and manage team member leave requests in a calendar format. Track
      approved and pending leave requests, and ensure proper coverage during
      team members' absences.
    </>
  ),
  features: [
    {
      title: "Leave Overview",
      description: "View all team members' leave requests in a calendar view",
    },
    {
      title: "Request Management",
      description: "Approve or reject leave requests and manage conflicts",
    },
    {
      title: "Coverage Planning",
      description: "Plan for team coverage during member absences",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="team-leave-calendar" />,
  roles: <RoleBasedHelp context="team-leave-calendar" />,
};
