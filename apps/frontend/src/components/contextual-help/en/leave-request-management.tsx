import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const leaveRequestManagementHelp: HelpSection = {
  title: "Comprehensive Leave Request Management",
  description: (
    <>
      Streamline and optimize your team's leave management process. This
      comprehensive system allows you to submit, track, approve, and manage
      leave requests efficiently while ensuring compliance with company policies
      and labor regulations. From individual requests to team-wide leave
      planning, TT3 provides all the tools needed for effective time-off
      management.
    </>
  ),
  features: [
    {
      title: "Intelligent Request Submission",
      description:
        "Submit leave requests with detailed information including leave type, dates, duration, and reasons. The system automatically validates requests against available quotas, team policies, and scheduling conflicts to ensure smooth processing.",
    },
    {
      title: "Automated Approval Workflows",
      description:
        "Streamlined approval processes with automatic routing to appropriate managers based on team structure and leave policies. The system tracks approval status, sends notifications, and ensures timely processing of all requests.",
    },
    {
      title: "Comprehensive Request Tracking",
      description:
        "Track the status of all leave requests from submission to approval/rejection. View request history, approval timelines, and any modifications made during the process. Maintain complete audit trails for compliance and transparency.",
    },
    {
      title: "Quota Management & Validation",
      description:
        "Automatic validation of leave requests against individual and team quotas. The system prevents over-allocation, tracks quota usage, and provides clear visibility into available leave balances for all team members.",
    },
    {
      title: "Conflict Detection & Resolution",
      description:
        "Identify and resolve scheduling conflicts between leave requests and work assignments. The system alerts managers to potential coverage issues and suggests solutions to maintain operational continuity.",
    },
    {
      title: "Policy Compliance & Reporting",
      description:
        "Ensure all leave requests comply with company policies, labor regulations, and team-specific rules. Generate comprehensive reports on leave patterns, approval rates, and policy compliance for management review.",
    },
  ],
  sections: [
    {
      title: "Leave Request Process",
      content: (
        <>
          <p>
            Follow this streamlined process for effective leave request
            management:
          </p>
          <ol className="space-y-2">
            <li>
              <strong>Submit Request:</strong> Complete the leave request form
              with all required information including dates, leave type, and
              reason for the request
            </li>
            <li>
              <strong>System Validation:</strong> The system automatically
              validates the request against quotas, policies, and scheduling
              conflicts
            </li>
            <li>
              <strong>Manager Review:</strong> Appropriate managers review the
              request based on team structure and approval workflows
            </li>
            <li>
              <strong>Approval/Rejection:</strong> Managers approve or reject
              requests with comments and reasoning for transparency
            </li>
            <li>
              <strong>Notification & Updates:</strong> All parties receive
              notifications about request status changes and any required
              actions
            </li>
            <li>
              <strong>Schedule Integration:</strong> Approved requests are
              automatically integrated into team schedules and leave calendars
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Best Practices for Leave Management",
      content: (
        <>
          <ul className="space-y-2">
            <li>
              <strong>Early Submission:</strong> Submit leave requests well in
              advance to allow for proper planning and approval processing
            </li>
            <li>
              <strong>Clear Communication:</strong> Provide detailed reasons and
              context for leave requests to facilitate informed decision-making
            </li>
            <li>
              <strong>Policy Awareness:</strong> Familiarize yourself with team
              and company leave policies to ensure requests meet all
              requirements
            </li>
            <li>
              <strong>Quota Monitoring:</strong> Regularly check your leave
              balance and quota usage to plan time-off effectively
            </li>
            <li>
              <strong>Timely Responses:</strong> Managers should respond to
              leave requests promptly to maintain team planning and morale
            </li>
            <li>
              <strong>Documentation:</strong> Keep records of all leave requests
              and approvals for compliance and future reference
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Managing Leave Requests Effectively",
      content: (
        <>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-800">For Team Members</h5>
              <p className="text-sm text-gray-600">
                Submit requests early, provide clear reasons, and monitor your
                quota balance. Communicate with your manager about any special
                circumstances or urgent requests.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">For Managers</h5>
              <p className="text-sm text-gray-600">
                Review requests promptly, consider team coverage needs, and
                provide clear feedback. Balance individual needs with
                operational requirements.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">For Administrators</h5>
              <p className="text-sm text-gray-600">
                Monitor leave patterns, ensure policy compliance, and optimize
                approval workflows. Use analytics to identify trends and improve
                processes.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">Conflict Resolution</h5>
              <p className="text-sm text-gray-600">
                Address scheduling conflicts proactively by working with team
                members to find alternative solutions or adjust request timing.
              </p>
            </div>
          </div>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="leave-request-management" />,
  roles: <RoleBasedHelp context="leave-request-management" />,
};
