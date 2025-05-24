import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const autoFillHelp: HelpSection = {
  title: "Auto Fill Shifts",
  description: (
    <>
      Automatically assign team members to shifts based on their qualifications,
      preferences, and availability. The system will optimize the schedule to
      ensure fair distribution and proper coverage.
    </>
  ),
  features: [
    {
      title: "Smart Assignment",
      description:
        "Automatically assign members based on qualifications and preferences",
    },
    {
      title: "Conflict Resolution",
      description: "Handle scheduling conflicts and find optimal solutions",
    },
    {
      title: "Schedule Optimization",
      description: "Balance workload and ensure fair distribution of shifts",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="auto-fill" />,
  roles: <RoleBasedHelp context="autoFill" />,
};
