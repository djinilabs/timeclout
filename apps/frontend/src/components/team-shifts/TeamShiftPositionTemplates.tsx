import { FC } from "react";
import { Trans } from "@lingui/react/macro";
import { useTeamShiftPositionTemplates } from "../../hooks/useTeamShiftPositionTemplates";
import { ShiftPosition } from "../atoms/ShiftPosition";
import { type AnalyzedShiftPosition } from "../../hooks/useAnalyzeTeamShiftsCalendar";
import { type SchedulePositionTemplate } from "@/settings";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "../particles/Button";

export interface TeamShiftPositionTemplatesProps {
  teamPk: string;
}

// Helper function to convert SchedulePositionTemplate to AnalyzedShiftPosition
const convertTemplateToAnalyzedShiftPosition = (
  template: SchedulePositionTemplate,
  index: number
): AnalyzedShiftPosition => {
  return {
    pk: `template-${index}`,
    sk: `template-${index}`,
    day: "template", // This is just for display purposes
    name: template.name,
    color: template.color,
    requiredSkills: template.requiredSkills,
    schedules: template.schedules.map((schedule) => ({
      startHourMinutes: schedule.startHourMinutes as [number, number],
      endHourMinutes: schedule.endHourMinutes as [number, number],
      inconveniencePerHour: schedule.inconveniencePerHour,
    })),
    assignedTo: null, // Templates don't have assigned users
    userVersion: null,
    fake: false,
    original: null as never, // Not needed for templates
    rowSpan: 1,
    rowStart: 0,
    rowEnd: 0,
    // No analysis data for templates
    hasLeaveConflict: false,
    hasIssueWithMaximumIntervalBetweenShiftsRule: false,
    hasIssueWithMinimumNumberOfShiftsPerWeekInStandardWorkday: false,
    hasIssueWithMinimumRestSlotsAfterShiftRule: false,
  };
};

export const TeamShiftPositionTemplates: FC<
  TeamShiftPositionTemplatesProps
> = ({ teamPk }) => {
  const { teamShiftPositionTemplates, deleteTeamShiftPositionTemplate } =
    useTeamShiftPositionTemplates(teamPk);

  const handleDeleteTemplate = async (template: SchedulePositionTemplate) => {
    await deleteTeamShiftPositionTemplate(template);
  };

  // Dummy function for required props
  const handleAssignShiftPosition = () => {
    // Templates don't need assignment functionality
  };

  if (!teamShiftPositionTemplates || teamShiftPositionTemplates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Trans>No shift position templates found.</Trans>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-hidden">
      <h3 className="text-lg font-medium text-gray-900">
        <Trans>Shift Position Templates</Trans>
      </h3>
      <div className="space-y-3">
        {teamShiftPositionTemplates.map((template, index) => {
          const analyzedShiftPosition = convertTemplateToAnalyzedShiftPosition(
            template,
            index
          );

          return (
            <div
              key={`${template.name}-${index}`}
              className="relative border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">
                  {template.name}
                </h4>
                <Button
                  onClick={() => handleDeleteTemplate(template)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                  aria-label={`Delete template ${template.name}`}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>

              <div className="h-16">
                {" "}
                {/* Fixed height container for the shift position */}
                <ShiftPosition
                  teamPk={teamPk}
                  shiftPosition={analyzedShiftPosition}
                  hideName={false}
                  handleAssignShiftPosition={handleAssignShiftPosition}
                  showScheduleDetails={true}
                />
              </div>

              {template.requiredSkills.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">
                    <Trans>Acceptable Skills:</Trans>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
