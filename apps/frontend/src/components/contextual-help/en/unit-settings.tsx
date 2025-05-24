import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const unitSettingsHelp: HelpSection = {
  title: "Unit Settings",
  description: (
    <>
      Configure settings for your business unit. Manage unit-specific
      preferences, team structures, and operational settings.
    </>
  ),
  features: [
    {
      title: "Unit Profile",
      description: "Update unit information and configuration",
    },
    {
      title: "Team Structure",
      description: "Manage team organization within the unit",
    },
    {
      title: "Unit Policies",
      description: "Configure unit-specific policies and preferences",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="unit-settings" />,
  roles: <RoleBasedHelp context="unit-settings" />,
};
