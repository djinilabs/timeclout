import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const leaveRequestManagementHelp: HelpSection = {
  title: "Leave Request Management",
  description: (
    <>
      Manage your leave requests and track their status. View your request
      history, check approval status, and monitor your remaining leave balance.
    </>
  ),
  features: [
    {
      title: "Request History",
      description: "View all your submitted leave requests and their status",
    },
    {
      title: "Balance Overview",
      description: "Check your remaining leave balance and quota usage",
    },
    {
      title: "Request Status",
      description: "Track the approval status of your leave requests",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="leave-request-management" />,
  roles: <RoleBasedHelp context="leave-request-management" />,
};
