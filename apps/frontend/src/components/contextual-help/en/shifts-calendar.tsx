import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const shiftsCalendarHelp: HelpSection = {
  title: "Shift Management & Scheduling",
  description: (
    <>
      The <strong>heart of TT3's workforce management system</strong>. Create,
      organize, and manage team work schedules with{" "}
      <em>precision and efficiency</em>. This comprehensive calendar interface
      allows you to <strong>visualize shifts across time periods</strong>,
      assign team members based on <u>qualifications</u>, and ensure
      <strong>optimal coverage</strong> for your operations. The system
      automatically updates in
      <em>real-time</em>, keeping everyone informed of schedule changes.
    </>
  ),
  features: [
    {
      title: "Intelligent Date Range Management",
      description: (
        <>
          Navigate seamlessly between{" "}
          <strong>months, weeks, and custom date ranges</strong>. Use the
          intuitive date picker to focus on specific periods for{" "}
          <em>detailed planning</em> or get a bird's-eye view of{" "}
          <strong>long-term schedules</strong>. Perfect for both{" "}
          <u>short-term operational planning</u> and{" "}
          <u>long-term strategic scheduling</u>.
        </>
      ),
    },
    {
      title: "Real-Time Synchronization",
      description: (
        <>
          Experience true <strong>real-time updates</strong> with automatic
          polling that keeps schedules current across all team members. Changes
          made by any <em>authorized user</em> are <u>instantly reflected</u>,
          eliminating confusion and ensuring everyone works with the most
          up-to-date information. <strong>No more manual refresh needed</strong>
          .
        </>
      ),
    },
    {
      title: "Advanced Position Management",
      description: (
        <>
          Create sophisticated shift positions with detailed specifications
          including <strong>role requirements</strong>, <em>time slots</em>,{" "}
          <u>qualification prerequisites</u>, and custom notes. Each position
          can have <strong>unique requirements</strong>, making it easy to
          ensure the{" "}
          <em>right person is assigned to the right role at the right time</em>.
        </>
      ),
    },
    {
      title: "Flexible Calendar Navigation",
      description: (
        <>
          Navigate through your schedule with ease using{" "}
          <strong>intuitive zoom controls</strong> and time period selectors.
          Switch between <em>daily, weekly, and monthly views</em> to match your
          planning needs. The <strong>responsive design</strong> adapts to
          different screen sizes for optimal viewing on any device.
        </>
      ),
    },
    {
      title: "Drag-and-Drop Assignment System",
      description: (
        <>
          Intuitively assign team members to shifts using our{" "}
          <strong>drag-and-drop interface</strong>. The system automatically
          validates assignments against <u>qualification requirements</u>,{" "}
          <em>availability conflicts</em>, and{" "}
          <strong>workload distribution rules</strong>. Visual feedback helps
          you make <em>informed assignment decisions</em> quickly.
        </>
      ),
    },
    {
      title: "Conflict Detection & Resolution",
      description: (
        <>
          Automatically identify and flag scheduling conflicts including{" "}
          <u>double-bookings</u>, <strong>qualification mismatches</strong>, and{" "}
          <em>rest period violations</em>. The system provides{" "}
          <strong>clear warnings and suggestions</strong> to help resolve issues
          before they become problems.
        </>
      ),
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
              your planning period - whether it's the <em>current week</em>,{" "}
              <em>next month</em>, or a <strong>custom range</strong>
            </li>
            <li>
              <strong>Review Current State:</strong> Examine existing shifts and
              positions to understand <em>current coverage</em> and identify{" "}
              <u>gaps</u>
            </li>
            <li>
              <strong>Create or Modify Positions:</strong> Add new shift
              positions or edit existing ones with{" "}
              <strong>specific requirements</strong> and
              <em>time slots</em>
            </li>
            <li>
              <strong>Assign Team Members:</strong> Assign{" "}
              <u>qualified team members</u> to appropriate shifts, ensuring{" "}
              <strong>proper coverage</strong>
            </li>
            <li>
              <strong>Validate and Publish:</strong> Review the complete
              schedule for <em>conflicts</em> and <u>publish when ready</u>
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
              <strong>Proactive Planning:</strong> Plan shifts at least{" "}
              <u>two weeks in advance</u> to allow for team member planning and
              reduce
              <em>last-minute changes</em>
            </li>
            <li>
              <strong>Qualification Matching:</strong> Always ensure team
              members assigned to shifts have the{" "}
              <strong>required qualifications</strong> and
              <em>certifications</em>
            </li>
            <li>
              <strong>Workload Balance:</strong> Monitor and maintain{" "}
              <em>fair distribution</em> of shifts across team members to
              prevent <u>burnout</u> and ensure <strong>equity</strong>
            </li>
            <li>
              <strong>Rest Period Compliance:</strong> Respect{" "}
              <u>minimum rest periods</u> between shifts to comply with{" "}
              <strong>labor regulations</strong> and maintain team well-being
            </li>
            <li>
              <strong>Regular Reviews:</strong> Conduct{" "}
              <em>weekly schedule reviews</em>
              to identify patterns, optimize efficiency, and address{" "}
              <strong>recurring issues</strong>
            </li>
            <li>
              <strong>Communication:</strong> Use the system's{" "}
              <u>notification features</u> to keep team members informed of
              schedule changes and updates
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
                Check if team members have the{" "}
                <strong>required qualifications</strong> assigned. Consider
                temporarily adjusting <em>qualification requirements</em> or
                <u>training team members</u> for needed skills.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Scheduling Conflicts Detected
              </h5>
              <p className="text-sm text-gray-600">
                Review the <strong>conflict details</strong> and adjust
                assignments. Consider using the <em>auto-fill feature</em> to
                find optimal solutions automatically.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Insufficient Coverage
              </h5>
              <p className="text-sm text-gray-600">
                Analyze your team's <em>availability</em> and consider adjusting{" "}
                <strong>shift times</strong>, adding <u>temporary positions</u>,
                or requesting additional team members.
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
                <strong>"unpublished"</strong> until you explicitly publish
                them. This allows you to work on schedules without affecting the{" "}
                <em>live version</em> that team members see. Use the{" "}
                <u>publish button</u> to make your changes visible to the team.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Publishing for Date Ranges
              </h5>
              <p className="text-sm text-gray-600">
                You can publish schedules for{" "}
                <strong>specific date ranges</strong> (e.g., a week, month, or
                custom period). This gives you{" "}
                <em>control over when changes become visible</em> and allows for{" "}
                <u>phased rollouts</u> of schedule updates. Select your desired
                date range and publish only those dates.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Reverting to Published Version
              </h5>
              <p className="text-sm text-gray-600">
                If you need to undo changes and return to the{" "}
                <strong>last published version</strong>, use the{" "}
                <u>"Revert to published"</u> option. This will discard all
                unpublished changes and restore the schedule to its last
                published state. This is useful for <em>correcting mistakes</em>{" "}
                or when changes need to be reviewed further.
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
  roles: <RoleBasedHelp context="shifts-calendar" />,
};
