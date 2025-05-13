import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const createShiftHelp: HelpSection = {
  title: "Create Shift",
  description: (
    <>
      Create a new shift position for your team. Define the position details,
      required qualifications, and schedule. This will help ensure proper
      coverage for your team's operations.
    </>
  ),
  features: [
    {
      title: "Position Details",
      description:
        "Define the shift position name, description, and requirements",
    },
    {
      title: "Schedule Configuration",
      description: "Set up the shift schedule, duration, and frequency",
    },
    {
      title: "Qualification Requirements",
      description:
        "Specify required qualifications and skills for the position",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="create-shift" />,
  roles: <RoleBasedHelp context="create-shift" />,
};
