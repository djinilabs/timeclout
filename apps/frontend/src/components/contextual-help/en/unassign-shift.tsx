import { HelpSection } from "../types";

export const unassignShiftHelp: HelpSection = {
  title: "Unassign Shift Positions",
  description: "Remove shift position assignments for a specific date range.",
  features: [
    {
      title: "Date Range Selection",
      description:
        "Select a start and end date to unassign all shift positions within that period. The date picker supports both single day and range selection.",
    },
    {
      title: "Bulk Unassignment",
      description:
        "Efficiently remove multiple shift position assignments at once by selecting a date range. This is useful when you need to clear assignments for a specific period.",
    },
  ],
  sections: [
    {
      title: "How to Use",
      content: (
        <div className="space-y-2">
          <p>1. Select a date range using the date picker</p>
          <p>
            2. Review the selected dates to ensure they cover the correct period
          </p>
          <p>
            3. Click "Unassign" to remove all shift position assignments within
            the selected range
          </p>
          <p>
            4. A confirmation message will appear when the operation is
            successful
          </p>
        </div>
      ),
    },
    {
      title: "Important Notes",
      content: (
        <div className="space-y-2">
          <p>
            • This action cannot be undone - all shift position assignments
            within the selected range will be permanently removed
          </p>
          <p>
            • Make sure to communicate with team members before unassigning
            shifts
          </p>
          <p>
            • The operation will affect all shift positions within the selected
            date range
          </p>
        </div>
      ),
    },
  ],
};
