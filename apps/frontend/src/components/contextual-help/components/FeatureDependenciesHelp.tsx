import { ReactElement } from "react";

export interface FeatureDependenciesHelpProperties {
  context?: string;
}

export const FeatureDependenciesHelp = ({
  context,
}: FeatureDependenciesHelpProperties): ReactElement => {
  const getDependenciesContent = () => {
    switch (context) {
      case "shifts-calendar": {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Setup Steps</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Before managing shifts, ensure these prerequisites are
                completed:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Team Configuration</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Set up team name and basic information</li>
                      <li>• Configure team working hours and timezone</li>
                      <li>• Define team member roles and permissions</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Member Management</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Add team members with their contact information</li>
                      <li>• Assign appropriate roles to team members</li>
                      <li>• Set up member qualifications and skills</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">3. Leave Types</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Configure available leave types</li>
                      <li>• Set up leave quotas and policies</li>
                      <li>• Define leave approval workflows</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">4. Shift Templates</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Create shift position templates</li>
                      <li>• Define required qualifications</li>
                      <li>• Set up shift schedules and durations</li>
                    </ul>
                  </li>
                </ol>
              </div>
              <div className="mt-4 pl-4 border-l-2 border-gray-200">
                <h4 className="font-medium">Next Steps:</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Create individual shift positions</li>
                  <li>• Assign team members to shifts</li>
                  <li>• Use auto-fill for optimal scheduling</li>
                  <li>• Review and publish the schedule</li>
                </ul>
              </div>
            </div>
          </div>
        );
      }
      case "new-leave-request": {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Setup Steps</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Before submitting a leave request, ensure these prerequisites
                are completed:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Team Membership</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Be an active team member</li>
                      <li>• Have appropriate permissions</li>
                      <li>• Be assigned to a team</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Leave Policy</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Team has defined leave types</li>
                      <li>• Leave quotas are set up</li>
                      <li>• Approval workflow is configured</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      }
      case "leave-request-management": {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Setup Steps</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                To manage leave requests, ensure these prerequisites are
                completed:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Team Setup</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Team is properly configured</li>
                      <li>• Leave policies are defined</li>
                      <li>• Approval workflows are set up</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Member Access</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Member has appropriate permissions</li>
                      <li>• Member is assigned to a team</li>
                      <li>• Member has leave quota assigned</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      }
      case "work-schedule-settings": {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Setup Steps</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Before configuring work schedule settings, ensure these
                prerequisites are completed:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Team Configuration</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Team is created and active</li>
                      <li>• Basic team information is set up</li>
                      <li>• Team members are assigned</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Permissions</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• User has admin permissions</li>
                      <li>• User can modify team settings</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      }
      case "yearly-quota-settings": {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Setup Steps</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Before configuring yearly quotas, ensure these prerequisites are
                completed:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Team Setup</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Team is properly configured</li>
                      <li>• Team members are assigned</li>
                      <li>• Basic team settings are defined</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Leave Types</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Leave types are defined</li>
                      <li>• Leave policies are set up</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      }
      case "company-settings": {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Setup Steps</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Before configuring company settings, ensure these prerequisites
                are completed:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Company Setup</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Company is created and active</li>
                      <li>• Basic company information is set up</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Permissions</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• User has company admin permissions</li>
                      <li>• User can modify company settings</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      }
      case "leave-approval-dashboard": {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Setup Steps</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Before managing leave approvals, ensure these prerequisites are
                completed:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Team Setup</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Team is properly configured</li>
                      <li>• Leave policies are defined</li>
                      <li>• Approval workflows are set up</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Permissions</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• User has admin permissions</li>
                      <li>• User can approve leave requests</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      }
      case "unit-settings": {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Setup Steps</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Before configuring unit settings, ensure these prerequisites are
                completed:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Unit Setup</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Unit is created and active</li>
                      <li>• Basic unit information is set up</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Permissions</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• User has unit admin permissions</li>
                      <li>• User can modify unit settings</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      }
      case "team-invitations": {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Setup Steps</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Before managing team invitations, ensure these prerequisites are
                completed:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Team Setup</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Team is properly configured</li>
                      <li>• Team roles are defined</li>
                      <li>• Team permissions are set up</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Permissions</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• User has admin permissions</li>
                      <li>• User can invite team members</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      }
      case "team-settings": {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Setup Steps</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Before configuring team settings, ensure these prerequisites are
                completed:
              </p>
              <div className="pl-4 border-l-2 border-gray-200">
                <ol className="space-y-4 text-sm">
                  <li>
                    <h4 className="font-medium">1. Team Setup</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• Team is created and active</li>
                      <li>• Basic team information is set up</li>
                      <li>• Team members are assigned</li>
                    </ul>
                  </li>
                  <li>
                    <h4 className="font-medium">2. Permissions</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>• User has admin permissions</li>
                      <li>• User can modify team settings</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        );
      }
      default: {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Feature Dependencies</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                This feature requires proper team setup and configuration.
                Please ensure all prerequisites are completed before proceeding.
              </p>
            </div>
          </div>
        );
      }
    }
  };

  return getDependenciesContent();
};
