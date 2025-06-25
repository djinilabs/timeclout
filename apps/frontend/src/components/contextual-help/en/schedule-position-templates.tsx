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
    {
      title: "Setting Up Schedule Position Templates and Day Templates",
      content: (
        <>
          <p>
            <strong>Schedule Position Templates</strong> allow you to define
            reusable roles or positions (e.g., "Nurse", "Receptionist",
            "Supervisor") with their own color, required skills, and default
            shift times. Create these in the "Add Position" dialog in the Shifts
            Calendar. Use clear names and distinct colors for easy
            identification.
          </p>
          <p className="mt-2">
            <strong>Schedule Day Templates</strong> are collections of position
            templates that represent a typical workday (e.g., "Standard
            Weekday", "Weekend Coverage"). You can create and manage day
            templates in the Day Templates section. Drag and drop position
            templates to build a day template, then drag day templates onto the
            calendar to quickly fill out a week or month.
          </p>
          <p className="mt-2">
            <strong>Best Practices:</strong> Regularly review your templates to
            ensure they match your team's needs. Use day templates to speed up
            scheduling and maintain consistency.
          </p>
        </>
      ),
    },
  ],
  dependencies: (
    <FeatureDependenciesHelp context="schedule-position-templates" />
  ),
  roles: <RoleBasedHelp context="schedule-position-templates" />,
};
