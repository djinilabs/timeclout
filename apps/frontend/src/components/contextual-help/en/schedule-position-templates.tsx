import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const schedulePositionTemplatesHelp: HelpSection = {
  title: "Schedule Position Templates",
  description: (
    <>
      View and manage templates for schedule positions. These templates are
      created in the "Add Position" dialog of the Shifts Calendar section and
      are used to maintain consistency in shift creation. Each template includes
      a name and color for easy identification, making it easier to fill
      positions with qualified team members.
    </>
  ),
  features: [
    {
      title: "Template Overview",
      description:
        "View all position templates created in the Shifts Calendar. These templates serve as the foundation for creating shifts and assigning team members.",
    },
    {
      title: "Color Coding",
      description:
        "Each position type has a distinct color for quick identification in the schedule. Colors are assigned when creating positions in the Shifts Calendar.",
    },
    {
      title: "Template Management",
      description:
        "Review and manage existing position templates. Note that new templates must be created in the 'Add Position' dialog of the Shifts Calendar section.",
    },
    {
      title: "Visual Preview",
      description:
        "See how each position template appears in the schedule with its assigned color and name. This helps maintain consistency across the team's schedule.",
    },
  ],
  sections: [
    {
      title: "Creating New Position Templates",
      content: (
        <>
          <p>To create new position templates:</p>
          <ol>
            <li>Navigate to the Shifts Calendar section</li>
            <li>Click on "Add Position" in the calendar view</li>
            <li>Enter a descriptive name for the position</li>
            <li>Select a color from the color picker</li>
            <li>Save the new position template</li>
          </ol>
          <p className="mt-2">
            The new template will automatically appear in this settings page and
            be available for use in future shift creation.
          </p>
        </>
      ),
    },
    {
      title: "Best Practices",
      content: (
        <>
          <ul>
            <li>Use clear, descriptive names for position templates</li>
            <li>Choose distinct colors for different position types</li>
            <li>Keep template names consistent with team terminology</li>
            <li>Regularly review and update templates as team needs change</li>
            <li>Consider creating templates for all common position types</li>
          </ul>
        </>
      ),
    },
  ],
  dependencies: (
    <FeatureDependenciesHelp context="schedule-position-templates" />
  ),
  roles: <RoleBasedHelp context="schedule-position-templates" />,
};
