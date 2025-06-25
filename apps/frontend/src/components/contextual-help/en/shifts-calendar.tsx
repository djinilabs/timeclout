import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const shiftsCalendarHelp: HelpSection = {
  title: "Shift Management & Scheduling",
  description: (
    <>
      The heart of TT3's workforce management system. Create, organize, and
      manage team work schedules with precision and efficiency. This
      comprehensive calendar interface allows you to visualize shifts across
      time periods, assign team members based on qualifications, and ensure
      optimal coverage for your operations. The system automatically updates in
      real-time, keeping everyone informed of schedule changes.
    </>
  ),
  features: [
    {
      title: "Intelligent Date Range Management",
      description:
        "Navigate seamlessly between months, weeks, and custom date ranges. Use the intuitive date picker to focus on specific periods for detailed planning or get a bird's-eye view of long-term schedules. Perfect for both short-term operational planning and long-term strategic scheduling.",
    },
    {
      title: "Real-Time Synchronization",
      description:
        "Experience true real-time updates with automatic polling that keeps schedules current across all team members. Changes made by any authorized user are instantly reflected, eliminating confusion and ensuring everyone works with the most up-to-date information. No more manual refresh needed.",
    },
    {
      title: "Advanced Position Management",
      description:
        "Create sophisticated shift positions with detailed specifications including role requirements, time slots, qualification prerequisites, and custom notes. Each position can have unique requirements, making it easy to ensure the right person is assigned to the right role at the right time.",
    },
    {
      title: "Flexible Calendar Navigation",
      description:
        "Navigate through your schedule with ease using intuitive zoom controls and time period selectors. Switch between daily, weekly, and monthly views to match your planning needs. The responsive design adapts to different screen sizes for optimal viewing on any device.",
    },
    {
      title: "Drag-and-Drop Assignment System",
      description:
        "Intuitively assign team members to shifts using our drag-and-drop interface. The system automatically validates assignments against qualification requirements, availability conflicts, and workload distribution rules. Visual feedback helps you make informed assignment decisions quickly.",
    },
    {
      title: "Conflict Detection & Resolution",
      description:
        "Automatically identify and flag scheduling conflicts including double-bookings, qualification mismatches, and rest period violations. The system provides clear warnings and suggestions to help resolve issues before they become problems.",
    },
  ],
  sections: [
    {
      title: "Getting Started with Shift Management",
      content: (
        <>
          <p>Follow these steps to effectively manage your team's shifts:</p>
          <ol className="space-y-2">
            <li>
              <strong>Set Your Timeframe:</strong> Use the date picker to select
              your planning period - whether it's the current week, next month,
              or a custom range
            </li>
            <li>
              <strong>Review Current State:</strong> Examine existing shifts and
              positions to understand current coverage and identify gaps
            </li>
            <li>
              <strong>Create or Modify Positions:</strong> Add new shift
              positions or edit existing ones with specific requirements and
              time slots
            </li>
            <li>
              <strong>Assign Team Members:</strong> Assign qualified team
              members to appropriate shifts, ensuring proper coverage
            </li>
            <li>
              <strong>Validate and Publish:</strong> Review the complete
              schedule for conflicts and publish when ready
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Advanced Scheduling Strategies",
      content: (
        <>
          <ul className="space-y-2">
            <li>
              <strong>Proactive Planning:</strong> Plan shifts at least two
              weeks in advance to allow for team member planning and reduce
              last-minute changes
            </li>
            <li>
              <strong>Qualification Matching:</strong> Always ensure team
              members assigned to shifts have the required qualifications and
              certifications
            </li>
            <li>
              <strong>Workload Balance:</strong> Monitor and maintain fair
              distribution of shifts across team members to prevent burnout and
              ensure equity
            </li>
            <li>
              <strong>Rest Period Compliance:</strong> Respect minimum rest
              periods between shifts to comply with labor regulations and
              maintain team well-being
            </li>
            <li>
              <strong>Regular Reviews:</strong> Conduct weekly schedule reviews
              to identify patterns, optimize efficiency, and address recurring
              issues
            </li>
            <li>
              <strong>Communication:</strong> Use the system's notification
              features to keep team members informed of schedule changes and
              updates
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Troubleshooting Common Issues",
      content: (
        <>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-800">
                No Qualified Team Members Available
              </h5>
              <p className="text-sm text-gray-600">
                Check if team members have the required qualifications assigned.
                Consider temporarily adjusting qualification requirements or
                training team members for needed skills.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Scheduling Conflicts Detected
              </h5>
              <p className="text-sm text-gray-600">
                Review the conflict details and adjust assignments. Consider
                using the auto-fill feature to find optimal solutions
                automatically.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Insufficient Coverage
              </h5>
              <p className="text-sm text-gray-600">
                Analyze your team's availability and consider adjusting shift
                times, adding temporary positions, or requesting additional team
                members.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Publishing Schedules & Version Control",
      content: (
        <>
          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-gray-800">
                Schedule Publishing Workflow
              </h5>
              <p className="text-sm text-gray-600">
                When you make changes to shifts, they are marked as
                "unpublished" until you explicitly publish them. This allows you
                to work on schedules without affecting the live version that
                team members see. Use the publish button to make your changes
                visible to the team.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Publishing for Date Ranges
              </h5>
              <p className="text-sm text-gray-600">
                You can publish schedules for specific date ranges (e.g., a
                week, month, or custom period). This gives you control over when
                changes become visible and allows for phased rollouts of
                schedule updates. Select your desired date range and publish
                only those dates.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Reverting to Published Version
              </h5>
              <p className="text-sm text-gray-600">
                If you need to undo changes and return to the last published
                version, use the "Revert to published" option. This will discard
                all unpublished changes and restore the schedule to its last
                published state. This is useful for correcting mistakes or when
                changes need to be reviewed further.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Best Practices for Publishing
              </h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • Review all changes before publishing to ensure accuracy
                </li>
                <li>
                  • Publish schedules well in advance so team members can plan
                  accordingly
                </li>
                <li>
                  • Use date range publishing for gradual rollouts of major
                  changes
                </li>
                <li>
                  • Communicate with your team when publishing significant
                  schedule changes
                </li>
                <li>• Keep unpublished changes minimal to avoid confusion</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Understanding the Publish Status
              </h5>
              <p className="text-sm text-gray-600">
                The publish status indicator shows whether your current view has
                unpublished changes. A green "Published" status means all
                changes are live, while an orange "Unpublished" status indicates
                you have pending changes that need to be published or reverted.
              </p>
            </div>
          </div>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="shifts-calendar" />,
  roles: <RoleBasedHelp />,
};
