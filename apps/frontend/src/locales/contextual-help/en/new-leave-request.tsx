import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const newLeaveRequestHelp: HelpSection = {
  title: "New Leave Request",
  description: (
    <>
      Submit a new leave request for approval. Specify the type of leave,
      duration, and any additional information required by your team's leave
      policy.
    </>
  ),
  features: [
    {
      title: "Leave Type Selection",
      description:
        "Choose from available leave types based on your team's policy",
    },
    {
      title: "Date Range",
      description: "Select start and end dates for your leave period",
    },
    {
      title: "Additional Information",
      description:
        "Provide any required details or documentation for your request",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="new-leave-request" />,
  roles: <RoleBasedHelp context="new-leave-request" />,
};
