import { ChatBubbleLeftIcon } from "@heroicons/react/20/solid";
import { useParams, useSearchParams } from "react-router-dom";

const ContextualHelpContent = () => {
  const { company, unit, team } = useParams();
  console.log({ company, unit, team });
  const [params] = useSearchParams();
  const tab = params.get("tab") ?? "";

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
          </div>
        );

      default:
        return null;
    }
  }
};

export const ContextualHelp = () => {
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
