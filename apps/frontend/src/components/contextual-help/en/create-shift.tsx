import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const createShiftHelp: HelpSection = {
  title: "Create Shift",
  description: (
    <>
      <strong>Add a new shift position</strong> to your team's schedule. Use
      templates for consistency or create from scratch.
    </>
  ),
  features: [
    {
      title: "Use Templates",
      description:
        "Select from existing templates to quickly create consistent shifts",
    },
    {
      title: "Custom Details",
      description:
        "Define position name, requirements, and schedule for this specific shift",
    },
    {
      title: "Qualification Matching",
      description: "Set required skills and qualifications for the position",
    },
  ],
  sections: [
    {
      title: "How to Create a Shift",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            1. Click <strong>"Add Position"</strong> in the calendar
          </p>
          <p className="text-xs text-gray-600">
            2. Choose a <strong>template</strong> or create from scratch
          </p>
          <p className="text-xs text-gray-600">
            3. Set the <strong>position name</strong> and description
          </p>
          <p className="text-xs text-gray-600">
            4. Configure <strong>start/end times</strong> and duration
          </p>
          <p className="text-xs text-gray-600">
            5. Add <strong>required qualifications</strong>
          </p>
          <p className="text-xs text-gray-600">
            6. Click <strong>"Save"</strong> to create the shift
          </p>
        </div>
      ),
    },
    {
      title: "Templates vs Custom",
      content: (
        <div className="space-y-2">
          <div className="flex items-start text-xs">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
            <div>
              <strong>Templates:</strong> Pre-filled with common settings, good
              for consistency
            </div>
          </div>
          <div className="flex items-start text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
            <div>
              <strong>Custom:</strong> Start from scratch, good for unique
              positions
            </div>
          </div>
        </div>
      ),
    },
  ],
  screenshots: [
    {
      caption: "Create shift dialog with template selection",
      alt: "Shift creation form",
    },
    {
      caption: "Position details and qualification requirements",
      alt: "Shift configuration",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="create-shift" />,
  roles: <RoleBasedHelp context="create-shift" />,
};
