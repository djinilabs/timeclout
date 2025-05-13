import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const companySettingsHelp: HelpSection = {
  title: "Company Settings",
  description: (
    <>
      Manage your company's settings and preferences. Configure company-wide
      policies, user roles, and other organizational settings.
    </>
  ),
  features: [
    {
      title: "Company Profile",
      description: "Update company information and branding",
    },
    {
      title: "User Management",
      description: "Manage user roles and permissions across the company",
    },
    {
      title: "Policy Settings",
      description: "Configure company-wide policies and preferences",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="company-settings" />,
  roles: <RoleBasedHelp context="company-settings" />,
};
