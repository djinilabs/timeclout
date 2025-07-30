import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const autoFillHelp: HelpSection = {
  title: "Auto-Fill Scheduling",
  description: (
    <>
      <strong>Automatically assign team members</strong> to shifts using
      intelligent algorithms. The system matches qualifications, balances
      workload, and resolves conflicts.
    </>
  ),
  features: [
    {
      title: "Smart Assignment",
      description:
        "Automatically matches qualified members to shifts based on skills and availability",
    },
    {
      title: "Conflict Resolution",
      description:
        "Resolves scheduling conflicts like double-bookings and rest period violations",
    },
    {
      title: "Workload Balance",
      description:
        "Distributes shifts fairly across team members to prevent overloading",
    },
  ],
  sections: [
    {
      title: "How to Use Auto-Fill",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            1. Click the <strong>"Auto-Fill"</strong> button in the calendar
          </p>
          <p className="text-xs text-gray-600">
            2. Select the <strong>date range</strong> you want to fill
          </p>
          <p className="text-xs text-gray-600">
            3. Choose your <strong>optimization preferences</strong>:
          </p>
          <div className="pl-4 space-y-1">
            <p className="text-xs text-gray-600">
              • <strong>Balance:</strong> Equal distribution of shifts
            </p>
            <p className="text-xs text-gray-600">
              • <strong>Efficiency:</strong> Minimize total inconvenience
            </p>
            <p className="text-xs text-gray-600">
              • <strong>Preferences:</strong> Respect member preferences
            </p>
          </div>
          <p className="text-xs text-gray-600">
            4. Click <strong>"Run Auto-Fill"</strong> to generate assignments
          </p>
          <p className="text-xs text-gray-600">
            5. <strong>Review</strong> the results and publish if satisfied
          </p>
        </div>
      ),
    },
    {
      title: "What Auto-Fill Considers",
      content: (
        <div className="space-y-2">
          <div className="flex items-start text-xs">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
            <div>
              <strong>Qualifications:</strong> Only assigns members with
              required skills
            </div>
          </div>
          <div className="flex items-start text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
            <div>
              <strong>Availability:</strong> Checks for conflicts with existing
              assignments
            </div>
          </div>
          <div className="flex items-start text-xs">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
            <div>
              <strong>Rest Periods:</strong> Ensures minimum rest between shifts
            </div>
          </div>
          <div className="flex items-start text-xs">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
            <div>
              <strong>Workload:</strong> Balances shift distribution across team
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "After Auto-Fill",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            • <strong>Review assignments</strong> before publishing
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Manual adjustments</strong> can be made if needed
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Publish</strong> when satisfied with the results
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Revert</strong> to previous state if not satisfied
          </p>
        </div>
      ),
    },
  ],
  screenshots: [
    {
      caption: "Auto-fill dialog with optimization options",
      alt: "Auto-fill configuration",
      src: "/images/help/auto-fill-dialog.png",
    },
    {
      caption: "Results view showing assigned members",
      alt: "Auto-fill results",
      src: "/images/help/auto-fill-results.png",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="auto-fill" />,
  roles: <RoleBasedHelp context="auto-fill" />,
};
