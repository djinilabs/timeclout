import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const unitManagementHelp: HelpSection = {
  title: "Unit Management",
  description: (
    <>
      Manage your business units effectively. Create, organize, and maintain
      units to structure your company's operations. Each unit can have multiple
      teams with specific roles and responsibilities.
    </>
  ),
  features: [
    {
      title: "Unit Creation",
      description:
        "Create new business units with specific configurations and settings",
    },
    {
      title: "Team Organization",
      description: "Organize teams within units and manage their relationships",
    },
    {
      title: "Unit Settings",
      description: "Configure unit-specific policies and preferences",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="unit-management" />,
  roles: <RoleBasedHelp context="unit-management" />,
};
