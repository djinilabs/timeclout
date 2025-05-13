import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const companyDashboardHelp: HelpSection = {
  title: "Company Dashboard",
  description: (
    <>
      Welcome to your company dashboard. Here you can manage your company's
      units, teams, and overall settings. This is the central hub for all
      company-wide operations.
    </>
  ),
  features: [
    {
      title: "Unit Management",
      description: "Create and manage business units within your company",
    },
    {
      title: "Team Overview",
      description:
        "View all teams across different units and their current status",
    },
    {
      title: "Company Settings",
      description: "Configure company-wide policies and preferences",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="company-dashboard" />,
  roles: <RoleBasedHelp context="company-dashboard" />,
};
