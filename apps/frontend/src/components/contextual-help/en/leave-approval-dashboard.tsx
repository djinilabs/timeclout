import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";
import { HelpSection } from "../types";

export const leaveApprovalDashboardHelp: HelpSection = {
  title: "Leave Approval Dashboard",
  description: (
    <>
      Review and manage pending leave requests. Approve or reject requests based
      on team coverage and policy compliance.
    </>
  ),
  features: [
    {
      title: "Request Review",
      description: "Review pending leave requests and their details",
    },
    {
      title: "Coverage Check",
      description: "Check team coverage during requested leave periods",
    },
    {
      title: "Policy Compliance",
      description: "Verify requests against team leave policies",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="leave-approval-dashboard" />,
  roles: <RoleBasedHelp context="leave-approval-dashboard" />,
};
