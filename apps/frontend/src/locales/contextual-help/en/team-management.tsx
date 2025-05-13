import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const teamManagementHelp: HelpSection = {
  title: "Team Management",
  description: (
    <>
      Manage your teams within this unit. Create new teams, assign members, and
      configure team settings. Each team can have its own schedule, leave
      policies, and shift templates.
    </>
  ),
  features: [
    {
      title: "Team Creation",
      description:
        "Create new teams with specific configurations and member assignments",
    },
    {
      title: "Member Management",
      description: "Add, remove, and manage team members and their roles",
    },
    {
      title: "Team Settings",
      description:
        "Configure team-specific policies, schedules, and preferences",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="team-management" />,
  roles: <RoleBasedHelp context="team-management" />,
};
