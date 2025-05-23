import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const memberManagementHelp: HelpSection = {
  title: "Member Management",
  description: (
    <>
      Manage your team members effectively. Add new members, assign roles, and
      configure individual settings. Each member can have specific
      qualifications, preferences, and availability.
    </>
  ),
  features: [
    {
      title: "Member Addition",
      description:
        "Add new members to the team with their details and preferences",
    },
    {
      title: "Role Assignment",
      description: "Assign and manage member roles and permissions",
    },
    {
      title: "Member Settings",
      description: "Configure individual member settings and preferences",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="member-management" />,
  roles: <RoleBasedHelp context="member-management" />,
};
