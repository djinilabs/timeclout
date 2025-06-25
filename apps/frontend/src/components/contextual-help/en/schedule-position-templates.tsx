import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const schedulePositionTemplatesHelp: HelpSection = {
  title: "Schedule Position Templates",
  description: (
    <>
      View and manage <strong>templates for schedule positions</strong>. These
      templates are created in the <em>"Add Position" dialog</em> of the Shifts
      Calendar section and are used to maintain{" "}
      <u>consistency in shift creation</u>. Each template includes a name and
      color for easy identification, making it easier to fill positions with{" "}
      <strong>qualified team members</strong>.
    </>
  ),
  features: [
    {
      title: "Template Overview",
      description: (
        <>
          View all position templates created in the{" "}
          <strong>Shifts Calendar</strong>. These templates serve as the{" "}
          <em>foundation for creating shifts</em> and assigning team members.
        </>
      ),
    },
    {
      title: "Color Coding",
      description: (
        <>
          Each position type has a <strong>distinct color</strong> for quick
          identification in the schedule. Colors are assigned when{" "}
          <em>creating positions</em> in the Shifts Calendar.
        </>
      ),
    },
    {
      title: "Template Management",
      description: (
        <>
          Review and manage <strong>existing position templates</strong>. Note
          that new templates must be created in the <u>'Add Position' dialog</u>{" "}
          of the Shifts Calendar section.
        </>
      ),
    },
    {
      title: "Visual Preview",
      description: (
        <>
          See how each position template appears in the schedule with its{" "}
          <em>assigned color and name</em>. This helps maintain{" "}
          <strong>consistency</strong> across the team's schedule.
        </>
      ),
    },
  ],
  sections: [
    {
      title: "Creating New Position Templates",
      content: (
        <>
          <p>To create new position templates:</p>
          <ol>
            <li>
              Navigate to the <strong>Shifts Calendar</strong> section
            </li>
            <li>
              Click on <em>"Add Position"</em> in the calendar view
            </li>
            <li>
              Enter a <strong>descriptive name</strong> for the position
            </li>
            <li>
              Select a <em>color</em> from the color picker
            </li>
            <li>
              <u>Save</u> the new position template
            </li>
          </ol>
          <p className="mt-2">
            The new template will automatically appear in this settings page and
            be available for use in <strong>future shift creation</strong>.
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
              Use <strong>clear, descriptive names</strong> for position
              templates
            </li>
            <li>
              Choose <em>distinct colors</em> for different position types
            </li>
            <li>
              Keep template names <u>consistent</u> with team terminology
            </li>
            <li>
              Regularly review and update templates as{" "}
              <em>team needs change</em>
            </li>
            <li>
              Consider creating templates for all{" "}
              <strong>common position types</strong>
            </li>
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
            reusable roles or positions (e.g., <em>"Nurse"</em>,{" "}
            <em>"Receptionist"</em>,<em>"Supervisor"</em>) with their own color,{" "}
            <strong>required skills</strong>, and default shift times. Create
            these in the <u>"Add Position" dialog</u> in the Shifts Calendar.
            Use clear names and distinct colors for easy identification.
          </p>
          <p className="mt-2">
            <strong>Schedule Day Templates</strong> are collections of position
            templates that represent a typical workday (e.g.,{" "}
            <em>"Standard Weekday"</em>, <em>"Weekend Coverage"</em>). You can
            create and manage day templates in the{" "}
            <strong>Day Templates section</strong>. Drag and drop position
            templates to build a day template, then drag day templates onto the
            calendar to quickly fill out a <u>week or month</u>.
          </p>
          <p className="mt-2">
            <strong>Best Practices:</strong> Regularly review your templates to
            ensure they match your <em>team's needs</em>. Use day templates to{" "}
            <strong>speed up scheduling</strong> and maintain consistency.
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
