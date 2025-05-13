import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const shiftsCalendarHelp: HelpSection = {
  title: "Shift Management",
  description: (
    <>
      Organize team work schedules effectively. Create and manage shift
      positions while ensuring adequate coverage. The calendar shows shifts for
      the selected month, with automatic polling to stay up-to-date. Use this
      interface to maintain optimal staffing levels and coordinate team
      schedules.
    </>
  ),
  features: [
    {
      title: "Date range filtering",
      description:
        "View shifts within specific start and end dates. Use the date picker to navigate between months and select custom date ranges for focused planning.",
    },
    {
      title: "Real-time updates",
      description:
        "Automatic polling keeps the schedule current. Changes made by team members are reflected immediately, ensuring everyone has access to the latest schedule information.",
    },
    {
      title: "Position management",
      description:
        "Create and edit shift positions with custom details including role requirements, time slots, and necessary qualifications. Assign team members to positions based on their availability and skills.",
    },
    {
      title: "Calendar navigation",
      description:
        "Easily navigate between months and weeks using intuitive controls. Zoom in/out to view different time periods and get a better overview of the schedule.",
    },
    {
      title: "Shift assignment",
      description:
        "Drag and drop team members to assign them to shifts. The system automatically checks for conflicts and qualification requirements.",
    },
  ],
  sections: [
    {
      title: "Getting Started",
      content: (
        <>
          <p>To begin managing shifts:</p>
          <ol>
            <li>Select your desired date range using the date picker</li>
            <li>Review existing shifts and positions</li>
            <li>Create new positions or modify existing ones</li>
            <li>Assign team members to shifts</li>
          </ol>
        </>
      ),
    },
    {
      title: "Best Practices",
      content: (
        <>
          <ul>
            <li>Plan shifts at least two weeks in advance</li>
            <li>Consider team member qualifications and preferences</li>
            <li>Maintain balanced workload distribution</li>
            <li>Regularly review and update the schedule</li>
          </ul>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="shifts-calendar" />,
  roles: <RoleBasedHelp />,
};
