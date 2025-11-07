import { ReactElement } from "react";

export interface RoleBasedHelpProps {
  context?: string;
}

export const RoleBasedHelp = ({
  context,
}: RoleBasedHelpProps): ReactElement => {
  const getRoleBasedContent = () => {
    switch (context) {
      case "shifts-calendar":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Role-Based Access</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Different roles have different permissions and capabilities in
                the shifts calendar:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Team Admin</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Create and manage shifts</li>
                      <li>• Assign team members to shifts</li>
                      <li>• Use auto-fill functionality</li>
                      <li>• View and manage all team schedules</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Team Member</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• View assigned shifts</li>
                      <li>• Request shift changes</li>
                      <li>• View team schedule</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "new-leave-request":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Role-Based Access</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Different roles have different permissions for leave requests:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Team Member</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Submit leave requests</li>
                      <li>• View own leave balance</li>
                      <li>• Track request status</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Team Admin</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Approve/reject requests</li>
                      <li>• View all team requests</li>
                      <li>• Manage leave quotas</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "leave-request-management":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Role-Based Access</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Different roles have different permissions for managing leave
                requests:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Team Admin</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Approve/reject requests</li>
                      <li>• View all team requests</li>
                      <li>• Manage leave quotas</li>
                      <li>• Configure approval workflows</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Team Member</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• View own requests</li>
                      <li>• Track request status</li>
                      <li>• View leave balance</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "work-schedule-settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Role-Based Access</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Different roles have different permissions for work schedule
                settings:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Team Admin</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Configure work schedules</li>
                      <li>• Set up shift patterns</li>
                      <li>• Manage team hours</li>
                      <li>• Define working days</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Team Member</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• View work schedule</li>
                      <li>• View shift patterns</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "yearly-quota-settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Role-Based Access</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Different roles have different permissions for yearly quota
                settings:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Team Admin</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Set yearly quotas</li>
                      <li>• Configure leave types</li>
                      <li>• Manage team quotas</li>
                      <li>• View quota usage</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Team Member</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• View own quota</li>
                      <li>• Track quota usage</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "company-settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Role-Based Access</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Different roles have different permissions for company settings:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Company Admin</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Configure company settings</li>
                      <li>• Manage company policies</li>
                      <li>• Set up company-wide rules</li>
                      <li>• Manage company units</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Unit Admin</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• View company settings</li>
                      <li>• Apply company policies</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "leave-approval-dashboard":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Role-Based Access</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Different roles have different permissions for leave approval:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Team Admin</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Approve/reject requests</li>
                      <li>• View all requests</li>
                      <li>• Manage approval workflows</li>
                      <li>• Configure approval rules</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Team Member</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• View own requests</li>
                      <li>• Track approval status</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "unit-settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Role-Based Access</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Different roles have different permissions for unit settings:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Unit Admin</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Configure unit settings</li>
                      <li>• Manage unit teams</li>
                      <li>• Set unit policies</li>
                      <li>• View unit metrics</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Team Admin</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• View unit settings</li>
                      <li>• Apply unit policies</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "team-invitations":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Role-Based Access</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Different roles have different permissions for team invitations:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Team Admin</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Send invitations</li>
                      <li>• Manage invitations</li>
                      <li>• Assign roles</li>
                      <li>• View invitation status</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Team Member</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Accept invitations</li>
                      <li>• View own invitations</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "team-settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Role-Based Access</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Different roles have different permissions for team settings:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ul className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">Team Admin</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Configure team settings</li>
                      <li>• Manage team members</li>
                      <li>• Set team policies</li>
                      <li>• View team metrics</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">Team Member</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• View team settings</li>
                      <li>• Apply team policies</li>
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
            <h3 className="text-lg font-semibold">Role-Based Access</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Different roles have different permissions and capabilities.
                Please ensure you have the appropriate role to access this
                feature.
              </p>
            </div>
          </div>
        );
    }
  };

  return getRoleBasedContent();
};
