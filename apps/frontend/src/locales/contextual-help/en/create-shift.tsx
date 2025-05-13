import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const createShiftHelp: HelpSection = {
  title: "Create Shift",
  description: (
    <>
      Create a new shift position for your team. You can either create a new
      position from scratch or reuse an existing position template. Templates
      help maintain consistency and save time when creating similar shifts.
      Define the position details, required qualifications, and schedule to
      ensure proper coverage for your team's operations.
    </>
  ),
  features: [
    {
      title: "Position Templates",
      description:
        "Select from existing position templates to quickly create consistent shifts. Templates include predefined names, colors, and qualification requirements.",
    },
    {
      title: "Position Details",
      description:
        "Define the shift position name, description, and requirements. When using a template, these fields will be pre-filled but can be modified as needed.",
    },
    {
      title: "Schedule Configuration",
      description:
        "Set up the shift schedule, duration, and frequency. This can be customized regardless of whether you're using a template or creating a new position.",
    },
    {
      title: "Qualification Requirements",
      description:
        "Specify required qualifications and skills for the position. Templates will include their predefined requirements, which you can adjust for this specific shift.",
    },
  ],
  sections: [
    {
      title: "Creating a Shift with Templates",
      content: (
        <>
          <p>To create a shift using a position template:</p>
          <ol>
            <li>Click "Add Position" in the calendar view</li>
            <li>Select an existing position template from the dropdown</li>
            <li>Review and adjust the pre-filled position details if needed</li>
            <li>Configure the specific schedule for this shift</li>
            <li>Modify qualification requirements if necessary</li>
            <li>Save the new shift position</li>
          </ol>
          <p className="mt-2">
            Using templates ensures consistency across similar shifts while
            allowing flexibility to adjust details for specific scheduling
            needs.
          </p>
        </>
      ),
    },
    {
      title: "Best Practices",
      content: (
        <>
          <ul>
            <li>
              Use templates for common position types to maintain consistency
            </li>
            <li>Review template details before creating the shift</li>
            <li>
              Adjust qualification requirements based on specific shift needs
            </li>
            <li>Consider creating new templates for unique position types</li>
            <li>Keep template names and requirements up to date</li>
          </ul>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="create-shift" />,
  roles: <RoleBasedHelp context="create-shift" />,
};
