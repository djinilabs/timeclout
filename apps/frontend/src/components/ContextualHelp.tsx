import { ChatBubbleLeftIcon } from "@heroicons/react/20/solid";
import { useParams, useSearchParams } from "react-router-dom";
import { Trans } from "@lingui/react/macro";
import { ReactElement } from "react";

const RoleBasedHelp = ({ context }: { context?: string }): ReactElement => {
  const getRelevantRoles = () => {
    switch (context) {
      case "autoFill":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Permissions</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <Trans>
                  The auto-fill feature requires specific permissions to manage
                  team schedules:
                </Trans>
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Team Admin</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Full access to auto-fill functionality</li>
                      <li>• Can configure all auto-fill parameters</li>
                      <li>• Can apply generated solutions</li>
                      <li>• Can reset and restart the process</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Team Member</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Can view auto-fill solutions</li>
                      <li>• Can provide feedback on assignments</li>
                      <li>• Cannot modify or apply solutions</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "create":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Permissions</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <Trans>
                  Creating and editing shift positions requires specific
                  permissions:
                </Trans>
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Team Admin</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Can create new shift positions</li>
                      <li>• Can edit existing positions</li>
                      <li>• Can assign team members</li>
                      <li>• Can modify shift schedules</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Team Member</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Can view shift positions</li>
                      <li>• Can see assigned team members</li>
                      <li>• Cannot modify positions</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "unassign":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Permissions</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <Trans>
                  Unassigning shift positions requires specific permissions:
                </Trans>
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Team Admin</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Can unassign team members from shifts</li>
                      <li>• Can bulk unassign multiple positions</li>
                      <li>• Can manage team assignments</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Team Member</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Can view unassigned positions</li>
                      <li>• Cannot modify assignments</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              User Roles and Capabilities
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <Trans>
                  The system provides different roles to help manage team
                  operations effectively:
                </Trans>
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Member</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• View team information and schedules</li>
                      <li>• Submit leave requests</li>
                      <li>• View team calendar and shifts</li>
                      <li>• Access basic team features</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Admin</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• All Member capabilities</li>
                      <li>• Manage team members and invitations</li>
                      <li>• Configure team settings</li>
                      <li>• Approve leave requests</li>
                      <li>• Manage shifts and schedules</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Owner</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• All Admin capabilities</li>
                      <li>• Manage team permissions</li>
                      <li>• Delete team resources</li>
                      <li>• Transfer ownership</li>
                      <li>• Access advanced settings</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
    }
  };

  return getRelevantRoles();
};

const ContextualHelpContent = () => {
  const { company, unit, team } = useParams();
  const [params] = useSearchParams();
  const tab = params.get("tab") ?? "";
  const pathname = window.location.pathname;
  const dialog = params.get("team-shift-schedule-dialog");

  // Check if we're on the new leave request page
  if (pathname.includes("/leave-requests/new")) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Creating a Leave Request</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Submit a new leave request for your team. Follow these steps to
            ensure your request is processed smoothly.
          </p>
          <div className="pl-4 border-l-2 border-gray-200">
            <h4 className="font-medium">Steps to Submit:</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Select the type of leave you're requesting</li>
              <li>• Choose your start and end dates</li>
              <li>• Add any relevant notes or comments</li>
              <li>• Review your team's calendar for coverage</li>
              <li>• Submit your request for approval</li>
            </ul>
          </div>
          <div className="mt-4 pl-4 border-l-2 border-gray-200">
            <h4 className="font-medium">Leave Request Features:</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Single day or date range requests</li>
              <li>• Multiple leave types available</li>
              <li>• Automatic approval for certain leave types</li>
              <li>• Manager approval workflow for others</li>
              <li>• Real-time team calendar updates</li>
            </ul>
          </div>
          <div className="mt-4 pl-4 border-l-2 border-gray-200">
            <h4 className="font-medium">Tips for Success:</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Submit requests well in advance when possible</li>
              <li>• Check your remaining leave balance</li>
              <li>• Consider team coverage during your absence</li>
              <li>
                • Review your team's leave calendar for potential conflicts
              </li>
              <li>• Provide clear notes about your absence</li>
            </ul>
          </div>
          <div className="mt-4 pl-4 border-l-2 border-gray-200">
            <h4 className="font-medium">What Happens Next:</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Your request will be sent to your team's approvers</li>
              <li>• You'll receive notifications about the request status</li>
              <li>
                • Once approved, the leave will appear on the team calendar
              </li>
              <li>
                • You can track the status in your leave requests dashboard
              </li>
            </ul>
          </div>
        </div>
        <RoleBasedHelp context="leaveRequest" />
      </div>
    );
  }

  // Check if we're editing/creating a shift position
  if (params.get("team-shift-schedule-dialog") === "create") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Editing Shift Position</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Modify an existing shift position in your team's schedule. This
            allows you to adjust details like timing, assignments, and
            requirements.
          </p>
          <div className="pl-4 border-l-2 border-gray-200">
            <h4 className="font-medium">What You Can Edit:</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Position name and color for easy identification</li>
              <li>• Schedule timing and duration</li>
              <li>• Required qualifications and skills</li>
              <li>• Team member assignment</li>
              <li>• Day and date of the shift</li>
            </ul>
          </div>
          <div className="mt-4 pl-4 border-l-2 border-gray-200">
            <h4 className="font-medium">Best Practices:</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Check for scheduling conflicts before saving changes</li>
              <li>
                • Ensure assigned team members have required qualifications
              </li>
              <li>• Consider team member availability and preferences</li>
              <li>• Review the impact on team coverage</li>
              <li>• Update any related shift positions if needed</li>
            </ul>
          </div>
          <div className="mt-4 pl-4 border-l-2 border-gray-200">
            <h4 className="font-medium">After Saving:</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Changes are immediately reflected in the team calendar</li>
              <li>• Assigned team members are notified of updates</li>
              <li>• The shift position is updated across all views</li>
              <li>• Any conflicts are highlighted for review</li>
            </ul>
          </div>
        </div>
        <RoleBasedHelp context="create" />
      </div>
    );
  }

  // Check if we're auto-filling shifts
  if (dialog === "autoFill") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Auto-Fill Shift Positions</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Automatically assign team members to shifts based on your specified
            rules and preferences. The system will analyze team member
            availability, qualifications, and preferences to generate optimal
            shift assignments.
          </p>
          <div className="pl-4 border-l-2 border-gray-200">
            <h4 className="font-medium">Configuration Options:</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                • <strong>Date Range</strong> - Select the period for
                auto-filling shifts
              </li>
              <li>
                • <strong>Worker Inconvenience Equality</strong> - Balance
                workload distribution among team members
              </li>
              <li>
                • <strong>Worker Slot Equality</strong> - Ensure fair
                distribution of shift types
              </li>
              <li>
                • <strong>Worker Slot Proximity</strong> - Consider team
                members' preferred shift times
              </li>
              <li>
                • <strong>Respect Leave Schedule</strong> - Avoid scheduling
                during approved leave periods
              </li>
            </ul>
          </div>
          <div className="mt-4 pl-4 border-l-2 border-gray-200">
            <h4 className="font-medium">Advanced Settings:</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                • <strong>Maximum Interval Between Shifts</strong> - Set minimum
                rest periods between shifts
              </li>
              <li>
                • <strong>Minimum Shifts Per Week</strong> - Ensure team members
                get enough work hours
              </li>
              <li>
                • <strong>Rest Period Requirements</strong> - Configure minimum
                rest time after specific shifts
              </li>
            </ul>
          </div>
          <div className="mt-4 pl-4 border-l-2 border-gray-200">
            <h4 className="font-medium">How It Works:</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                • The system analyzes all available team members and shift
                positions
              </li>
              <li>
                • It considers leave schedules, qualifications, and preferences
              </li>
              <li>• Multiple solutions are generated and ranked by quality</li>
              <li>
                • The system maintains the top 10 best solutions for you to
                compare
              </li>
              <li>
                • You can review and select the solution that best fits your
                team's needs
              </li>
              <li>
                • Progress is shown in real-time as solutions are generated
              </li>
            </ul>
          </div>
          <div className="mt-4 pl-4 border-l-2 border-gray-200">
            <h4 className="font-medium">Solution Selection:</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• The system keeps track of the 10 best solutions found</li>
              <li>
                • Solutions are ranked based on your configured preferences
              </li>
              <li>• You can compare different solutions side by side</li>
              <li>• Each solution shows its quality score and key metrics</li>
              <li>
                • Choose the solution that best balances your team's needs
              </li>
            </ul>
          </div>
          <div className="mt-4 pl-4 border-l-2 border-gray-200">
            <h4 className="font-medium">After Auto-Fill:</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Review the generated solutions in the calendar view</li>
              <li>
                • Check for any conflicts or issues highlighted in the interface
              </li>
              <li>• Make manual adjustments if needed before applying</li>
              <li>• Apply the solution to update the team schedule</li>
              <li>• Team members will be notified of their new assignments</li>
            </ul>
          </div>
          <div className="mt-4 pl-4 border-l-2 border-gray-200">
            <h4 className="font-medium">Tips for Success:</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Start with a clear date range for the auto-fill period</li>
              <li>
                • Adjust the balance between equality and preferences based on
                your team's needs
              </li>
              <li>
                • Consider team members' leave schedules when setting parameters
              </li>
              <li>
                • Take time to compare the different solutions before choosing
                one
              </li>
              <li>• Use the reset button to start over if needed</li>
            </ul>
          </div>
        </div>
        <RoleBasedHelp context="autoFill" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Company Management Dashboard</h3>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Create and manage companies with customized organizational
            structures. Set up a hierarchical structure with units and teams
            that mirrors your organization. Each level can have its own
            policies, permissions and workflows.
          </p>

          <div className="pl-4 border-l-2 border-gray-200">
            <h4 className="font-medium">Key Features:</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                • Comprehensive leave policies - Define accrual rules,
                carry-over limits, and approval chains
              </li>
              <li>
                • Role-based permissions - Granular access control for managers,
                admins and employees
              </li>
              <li>
                • Intuitive approval workflows - Multi-level approvals with
                notifications
              </li>
              <li>
                • Flexible scheduling options - Support for shifts, rotations
                and custom work patterns
              </li>
              <li>
                • Custom calendar settings - Configure holidays, fiscal years
                and working days
              </li>
            </ul>
          </div>
        </div>
        <RoleBasedHelp />
      </div>
    );
  }

  if (company && !unit && !team) {
    switch (tab) {
      case "":
      case "units":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Unit Management</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Organize teams effectively through logical unit groupings. Units
                act as containers for teams and provide a middle management
                layer for larger organizations.
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-1 text-sm">
                  <li>
                    • Create and configure units - Set up new organizational
                    divisions with custom settings
                  </li>
                  <li>
                    • Assign unit managers - Delegate administrative
                    responsibilities at the unit level
                  </li>
                  <li>
                    • Set reporting hierarchies - Define clear chains of command
                    and approval flows
                  </li>
                  <li>
                    • Customize unit policies - Override company defaults with
                    unit-specific rules
                  </li>
                  <li>
                    • Monitor team activities - Track leave patterns and
                    resource utilization across teams
                  </li>
                </ul>
              </div>
            </div>
            <RoleBasedHelp />
          </div>
        );

      case "time-off":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Time Off Dashboard</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Track and manage your personal time off allowances. Get a
                comprehensive view of your leave entitlements, usage and
                upcoming time off.
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-1 text-sm">
                  <li>
                    • View leave balances - Check remaining days across
                    different leave types
                  </li>
                  <li>
                    • Track request history - See all past, current and future
                    leave requests
                  </li>
                  <li>
                    • Monitor accrual status - Watch your leave allowance grow
                    over time
                  </li>
                  <li>
                    • Check fiscal year settings - Understand carry-over and
                    expiry rules
                  </li>
                </ul>
              </div>
            </div>
            <RoleBasedHelp />
          </div>
        );

      case "my-leave-requests":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Leave Request Management</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Submit and track your leave requests in one place. Manage the
                entire leave request lifecycle from application to approval.
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-1 text-sm">
                  <li>
                    • Create new requests - Submit leave applications with date
                    ranges and types
                  </li>
                  <li>
                    • Track approval status - Monitor request progress through
                    approval chain
                  </li>
                  <li>
                    • View request history - Access complete record of past
                    leave requests
                  </li>
                  <li>
                    • Check team calendar - See team member availability before
                    planning leave
                  </li>
                </ul>
              </div>
            </div>
            <RoleBasedHelp />
          </div>
        );

      case "settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company Settings</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Configure company-wide leave management settings. Establish the
                foundation for how leave is handled across your organization.
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-1 text-sm">
                  <li>
                    • Leave policies - Define types of leave and their rules
                  </li>
                  <li>• Working hours - Set standard work days and hours</li>
                  <li>
                    • Leave Quotas - Set the number of days each employee can
                    take off and the month for when that quota resets.
                  </li>
                </ul>
              </div>
            </div>
            <RoleBasedHelp />
          </div>
        );

      case "pending-leave-requests":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Leave Approval Dashboard</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Review and process team leave requests. Make informed decisions
                about leave approvals while maintaining team coverage.
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-1 text-sm">
                  <li>
                    • View request details - See comprehensive leave request
                    information
                  </li>
                  <li>
                    • Check team coverage - Assess impact on team availability
                  </li>
                  <li>
                    • Process approvals - Approve or decline with comments
                  </li>
                </ul>
              </div>
            </div>
            <RoleBasedHelp />
          </div>
        );

      default:
        return null;
    }
  }

  if (company && unit && !team) {
    switch (tab) {
      case "":
      case "teams":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Team Management</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Oversee all teams within your organizational unit. Manage team
                structures and monitor their operations effectively.
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-1 text-sm">
                  <li>
                    • Create new teams - Set up teams with defined purposes and
                    roles
                  </li>
                  <li>
                    • Manage team roles - Assign leadership and member
                    responsibilities
                  </li>
                  <li>
                    • Monitor leave patterns - Track absence trends and coverage
                  </li>
                  <li>
                    • Track team capacity - Ensure balanced workload
                    distribution
                  </li>
                  <li>
                    • Configure notifications - Set up alerts for important
                    events
                  </li>
                </ul>
              </div>
            </div>
            <RoleBasedHelp />
          </div>
        );

      case "settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Unit Settings</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Configure unit-specific operational settings. Customize how the
                unit functions within the larger organization.
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-1 text-sm">
                  <li>
                    • Unit details - Manage basic information and descriptions
                  </li>
                  <li>
                    • Leave policies - Set unit-specific leave rules and quotas
                  </li>
                  <li>
                    • Permission hierarchy - Define approval chains and access
                    levels
                  </li>
                  <li>• Working hours - Configure unit operating schedules</li>
                  <li>
                    • Calendar settings - Manage unit-specific holidays and
                    events
                  </li>
                </ul>
              </div>
            </div>
            <RoleBasedHelp />
          </div>
        );

      default:
        return null;
    }
  }

  if (company && unit && team) {
    switch (tab) {
      case "":
      case "members":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Member Management</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Manage your team's composition and roles. Build and maintain an
                effective team structure with clear responsibilities.
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-1 text-sm">
                  <li>
                    • Add/remove members - Manage team composition dynamically
                  </li>
                  <li>
                    • Set permissions - Define member access and capabilities
                  </li>
                  <li>
                    • Define reporting lines - Establish clear management
                    structure
                  </li>
                  <li>
                    • Track schedules - Monitor work patterns and availability
                  </li>
                  <li>
                    • Monitor capacity - Ensure balanced workload distribution
                  </li>
                </ul>
              </div>
            </div>
            <RoleBasedHelp />
          </div>
        );

      case "leave-schedule":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Team Leave Calendar</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                View and manage team absences. Get a comprehensive view of team
                availability and leave patterns.
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-1 text-sm">
                  <li>• Coverage analysis - Ensure adequate team presence</li>
                  <li>
                    • Leave type indicators - Distinguish between leave
                    categories
                  </li>
                  <li>• Schedule planning - Coordinate time off effectively</li>
                  <li>
                    • Fair distribution tracking - Monitor leave allocation
                    equity
                  </li>
                </ul>
              </div>
            </div>
            <RoleBasedHelp />
          </div>
        );

      case "shifts-calendar":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shift Management</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Organize team work schedules effectively. Create and manage
                shift positions while ensuring adequate coverage. The calendar
                shows shifts for the selected month, with automatic polling to
                stay up-to-date.
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-1 text-sm">
                  <li>
                    • Date range filtering - View shifts within specific start
                    and end dates
                  </li>
                  <li>
                    • Real-time updates - Automatic polling keeps the schedule
                    current
                  </li>
                  <li>
                    • Position management - Create and edit shift positions with
                    custom details
                  </li>
                </ul>
              </div>
            </div>
            <RoleBasedHelp />
          </div>
        );

      case "invitations":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Team Invitations</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Manage team membership invitations. Control team growth through
                a structured invitation process.
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-1 text-sm">
                  <li>
                    • Send invites - Invite new members with specific roles
                  </li>
                  <li>• Track status - Monitor invitation acceptance</li>
                  <li>
                    • Manage expiration - Set and extend invitation validity
                  </li>
                </ul>
              </div>
            </div>
            <RoleBasedHelp />
          </div>
        );

      case "settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Team Settings</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Configure team-specific operations. Customize how your team
                functions within the unit structure.
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-1 text-sm">
                  <li>
                    • Team details - Manage basic information and description
                  </li>
                  <li>• Working patterns - Define team schedules and shifts</li>
                  <li>
                    • Role management - Configure team positions and permissions
                  </li>
                </ul>
              </div>
            </div>
            <RoleBasedHelp />
          </div>
        );

      default:
        return null;
    }
  }
};

const ContextualHelp = () => {
  return (
    <>
      <ContextualHelpContent />
      <div className="mt-16">
        <ChatBubbleLeftIcon className="w-4 h-4" />
        <p className="text-sm text-gray-600">
          Need help? Get in touch with our customer service team at{" "}
          <a href="mailto:team@tt3.app">team@tt3.app</a>
        </p>
      </div>
    </>
  );
};

export default ContextualHelp;
