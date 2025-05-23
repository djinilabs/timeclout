import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const yearlyQuotaSettingsHelp: HelpSection = {
  title: "Yearly Quota Settings",
  description: (
    <>
      Configure yearly leave quotas for your team. Set up different types of
      leave, their durations, and any specific rules or restrictions that apply.
    </>
  ),
  features: [
    {
      title: "Leave Types",
      description: "Define different types of leave and their quotas",
    },
    {
      title: "Quota Rules",
      description: "Set up rules for quota usage and carryover",
    },
    {
      title: "Restrictions",
      description: "Configure any restrictions or special conditions for leave",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="yearly-quota-settings" />,
  roles: <RoleBasedHelp context="yearly-quota-settings" />,
};
