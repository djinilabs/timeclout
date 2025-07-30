import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const shiftsCalendarHelp: HelpSection = {
  title: "Shift Management & Scheduling",
  description: (
    <>
      The <strong>core scheduling interface</strong> for managing team work
      schedules. Create shifts, assign team members, and ensure optimal
      coverage.
    </>
  ),
  features: [
    {
      title: "Create & Edit Shifts",
      description:
        "Add new shift positions or modify existing ones with drag-and-drop",
    },
    {
      title: "Assign Team Members",
      description: "Assign qualified members to shifts using dropdown menus",
    },
    {
      title: "Auto-Fill Scheduling",
      description:
        "Let the system automatically assign members based on qualifications",
    },
  ],
  sections: [
    {
      title: "Quick Actions",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            • <strong>Create Shift:</strong> Click the "+" button or drag from
            the left panel
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Assign Member:</strong> Use the dropdown menu in the shift
            dialog or context menu
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Auto-Fill:</strong> Use the auto-fill button to
            automatically assign members
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Publish:</strong> Click "Publish" to make changes visible
            to the team
          </p>
        </div>
      ),
    },
    {
      title: "Understanding the Interface",
      content: (
        <div className="space-y-2">
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-gray-600">
              <strong>Available Members:</strong> Qualified team members ready
              to assign
            </span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-gray-600">
              <strong>Assigned Shifts:</strong> Members successfully assigned to
              shifts
            </span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className="text-gray-600">
              <strong>Conflicts:</strong> Scheduling conflicts that need
              resolution
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Publishing Changes",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            • Changes are <strong>unpublished</strong> until you click "Publish"
          </p>
          <p className="text-xs text-gray-600">
            • Published changes become visible to all team members
          </p>
          <p className="text-xs text-gray-600">
            • Use "Revert to Published" to undo unpublished changes
          </p>
        </div>
      ),
    },
    {
      title: "Display Options",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            Use the <strong>Options</strong> menu to customize what you see in
            the calendar:
          </p>
          <div className="space-y-1">
            <p className="text-xs text-gray-600">
              • <strong>Leaves:</strong> Show team member leave requests and
              time off
            </p>
            <p className="text-xs text-gray-600">
              • <strong>Details:</strong> Display additional shift information
              like start/end times and qualifications
            </p>
            <p className="text-xs text-gray-600">
              • <strong>Analyze:</strong> Highlight scheduling conflicts, rule
              violations, and optimization opportunities
            </p>
            <p className="text-xs text-gray-600">
              • <strong>Position Templates:</strong> Show draggable shift
              position models for quick creation
            </p>
            <p className="text-xs text-gray-600">
              • <strong>Day Templates:</strong> Display draggable day models to
              copy entire day schedules
            </p>
            <p className="text-xs text-gray-600">
              • <strong>Filters:</strong> Filter the calendar view by specific
              team members
            </p>
            <p className="text-xs text-gray-600">
              • <strong>Holidays:</strong> Show company holidays and non-working
              days
            </p>
          </div>
        </div>
      ),
    },
  ],
  screenshots: [
    {
      caption: "Main calendar view with shift positions and member assignments",
      alt: "Shift calendar interface",
      src: "/images/help/shifts-calendar-main.png",
    },
    {
      caption: "Shift position with context menu for member assignment",
      alt: "Member assignment interface",
      src: "/images/help/shifts-calendar-drag.png",
    },
    {
      caption: "Auto-fill dialog with assignment options",
      alt: "Auto-fill scheduling",
      src: "/images/help/shifts-calendar-autofill.png",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="shifts-calendar" />,
  roles: <RoleBasedHelp context="shifts-calendar" />,
};
