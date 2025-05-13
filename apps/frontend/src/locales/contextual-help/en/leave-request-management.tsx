import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const leaveRequestManagementHelp: HelpSection = {
  title: "Leave Request Management",
  description: (
    <>
      Manage your leave requests and track their status. View your request
      history, check approval status, and monitor your remaining leave balance.
      This interface helps you plan and manage your time off effectively while
      staying compliant with company policies.
    </>
  ),
  features: [
    {
      title: "Request History",
      description:
        "View all your submitted leave requests and their status. Filter and sort requests by date, type, and status. Access detailed information about each request including approval comments and supporting documents.",
    },
    {
      title: "Balance Overview",
      description:
        "Check your remaining leave balance and quota usage. View breakdowns by leave type, track accrual rates, and monitor upcoming leave entitlements. Get alerts when your balance is running low.",
    },
    {
      title: "Request Status",
      description:
        "Track the approval status of your leave requests in real-time. Receive notifications for status changes and view approval/rejection reasons. See the complete approval workflow history.",
    },
    {
      title: "Leave Calendar",
      description:
        "Visualize your approved leave periods on an interactive calendar. See overlapping requests from team members and identify potential conflicts. Plan your leave around team schedules.",
    },
  ],
  sections: [
    {
      title: "Making a Leave Request",
      content: (
        <>
          <p>To submit a new leave request:</p>
          <ol>
            <li>Select the leave type and duration</li>
            <li>Check your available balance</li>
            <li>Add any required documentation</li>
            <li>Review team coverage and impact</li>
            <li>Submit for approval</li>
          </ol>
        </>
      ),
    },
    {
      title: "Best Practices",
      content: (
        <>
          <ul>
            <li>Submit requests well in advance when possible</li>
            <li>Check team calendar for potential conflicts</li>
            <li>Keep documentation up to date</li>
            <li>Monitor your leave balance regularly</li>
            <li>Follow up on pending requests appropriately</li>
          </ul>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="leave-request-management" />,
  roles: <RoleBasedHelp context="leave-request-management" />,
};
