import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";
import { HelpSection } from "../types";

export const leaveRequestManagementHelp: HelpSection = {
  title: "Comprehensive Leave Request Management",
  description: (
    <>
      Streamline and optimize your team&apos;s{" "}
      <strong>leave management process</strong>. This comprehensive system
      allows you to submit, track, approve, and manage leave requests
      efficiently while ensuring <em>compliance with company policies</em>
      and <u>labor regulations</u>. From individual requests to team-wide leave
      planning, TT3 provides all the tools needed for effective{" "}
      <strong>time-off management</strong>.
    </>
  ),
  features: [
    {
      title: "Intelligent Request Submission",
      description: (
        <>
          Submit leave requests with <strong>detailed information</strong>{" "}
          including leave type, dates, duration, and reasons. The system
          automatically validates requests against <em>available quotas</em>,
          team policies, and <u>scheduling conflicts</u> to ensure smooth
          processing.
        </>
      ),
    },
    {
      title: "Automated Approval Workflows",
      description: (
        <>
          Streamlined approval processes with <strong>automatic routing</strong>{" "}
          to appropriate managers based on team structure and leave policies.
          The system tracks <em>approval status</em>, sends notifications, and
          ensures <u>timely processing</u> of all requests.
        </>
      ),
    },
    {
      title: "Comprehensive Request Tracking",
      description: (
        <>
          Track the status of all leave requests from{" "}
          <strong>submission to approval/rejection</strong>. View request
          history, <em>approval timelines</em>, and any modifications made
          during the process. Maintain complete <u>audit trails</u> for
          compliance and transparency.
        </>
      ),
    },
    {
      title: "Quota Management & Validation",
      description: (
        <>
          Automatic validation of leave requests against{" "}
          <strong>individual and team quotas</strong>. The system prevents{" "}
          <em>over-allocation</em>, tracks quota usage, and provides clear
          visibility into <u>available leave balances</u> for all team members.
        </>
      ),
    },
    {
      title: "Conflict Detection & Resolution",
      description: (
        <>
          Identify and resolve <strong>scheduling conflicts</strong> between
          leave requests and work assignments. The system alerts managers to{" "}
          <em>potential coverage issues</em> and suggests solutions to maintain{" "}
          <u>operational continuity</u>.
        </>
      ),
    },
    {
      title: "Policy Compliance & Reporting",
      description: (
        <>
          Ensure all leave requests comply with{" "}
          <strong>company policies</strong>, labor regulations, and
          team-specific rules. Generate comprehensive reports on{" "}
          <em>leave patterns</em>, approval rates, and <u>policy compliance</u>{" "}
          for management review.
        </>
      ),
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
              with all <em>required information</em> including dates, leave
              type, and reason for the request
            </li>
            <li>
              <strong>System Validation:</strong> The system automatically
              validates the request against <strong>quotas, policies</strong>,
              and scheduling conflicts
            </li>
            <li>
              <strong>Manager Review:</strong> Appropriate managers review the
              request based on <em>team structure</em> and approval workflows
            </li>
            <li>
              <strong>Approval/Rejection:</strong> Managers approve or reject
              requests with <u>comments and reasoning</u> for transparency
            </li>
            <li>
              <strong>Notification & Updates:</strong> All parties receive
              notifications about <em>request status changes</em> and any
              required actions
            </li>
            <li>
              <strong>Schedule Integration:</strong> Approved requests are
              automatically integrated into <strong>team schedules</strong> and
              leave calendars
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
              <strong>Early Submission:</strong> Submit leave requests{" "}
              <u>well in advance</u> to allow for proper planning and approval
              processing
            </li>
            <li>
              <strong>Clear Communication:</strong> Provide{" "}
              <em>detailed reasons</em> and context for leave requests to
              facilitate informed decision-making
            </li>
            <li>
              <strong>Policy Awareness:</strong> Familiarize yourself with{" "}
              <strong>team and company leave policies</strong> to ensure
              requests meet all requirements
            </li>
            <li>
              <strong>Quota Monitoring:</strong> Regularly check your{" "}
              <em>leave balance</em> and quota usage to plan time-off
              effectively
            </li>
            <li>
              <strong>Timely Responses:</strong> Managers should respond to
              leave requests <u>promptly</u> to maintain team planning and
              morale
            </li>
            <li>
              <strong>Documentation:</strong> Keep records of all{" "}
              <strong>leave requests and approvals</strong> for compliance and
              future reference
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
                Submit requests <em>early</em>, provide{" "}
                <strong>clear reasons</strong>, and monitor your quota balance.
                Communicate with your manager about any{" "}
                <u>special circumstances</u> or urgent requests.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">For Managers</h5>
              <p className="text-sm text-gray-600">
                Review requests <strong>promptly</strong>, consider{" "}
                <em>team coverage needs</em>, and provide clear feedback.
                Balance individual needs with
                <u>operational requirements</u>.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">For Administrators</h5>
              <p className="text-sm text-gray-600">
                Monitor <em>leave patterns</em>, ensure{" "}
                <strong>policy compliance</strong>, and optimize approval
                workflows. Use analytics to identify trends and improve
                processes.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">Conflict Resolution</h5>
              <p className="text-sm text-gray-600">
                Address <strong>scheduling conflicts</strong> proactively by
                working with team members to find <em>alternative solutions</em>{" "}
                or adjust request timing.
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
