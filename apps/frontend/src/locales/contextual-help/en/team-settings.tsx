import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const teamSettingsHelp: HelpSection = {
  title: "Team Settings",
  description: (
    <>
      Configure your team's settings and preferences. Manage team-specific
      policies, member roles, and operational settings.
    </>
  ),
  features: [
    {
      title: "Team Profile",
      description: "Update team information and configuration",
    },
    {
      title: "Member Management",
      description: "Manage team members and their roles",
    },
    {
      title: "Team Policies",
      description: "Configure team-specific policies and preferences",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="team-settings" />,
  roles: <RoleBasedHelp context="team-settings" />,
};
