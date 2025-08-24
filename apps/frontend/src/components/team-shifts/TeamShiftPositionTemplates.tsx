import {
  InformationCircleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { FC, useCallback } from "react";

import { type AnalyzedShiftPosition } from "../../hooks/useAnalyzeTeamShiftsCalendar";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { ShiftPositionWithFake } from "../../hooks/useTeamShiftPositionsMap";
import { useTeamShiftPositionTemplates } from "../../hooks/useTeamShiftPositionTemplates";
import { ShiftPosition } from "../atoms/ShiftPosition";
import { Button } from "../particles/Button";
import { Hint } from "../particles/Hint";

import { type SchedulePositionTemplate } from "@/settings";



export interface TeamShiftPositionTemplatesProperties {
  teamPk: string;
  onCreateTemplate: () => void;
}

// Helper function to convert SchedulePositionTemplate to AnalyzedShiftPosition
const convertTemplateToAnalyzedShiftPosition = (
  template: SchedulePositionTemplate,
  index: number
): AnalyzedShiftPosition => {
  return {
    pk: `template-${index}`,
    sk: `template-${index}`,
    isTemplate: true,
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
  TeamShiftPositionTemplatesProperties
> = ({ teamPk, onCreateTemplate }) => {
  const { teamShiftPositionTemplates, deleteTeamShiftPositionTemplate } =
    useTeamShiftPositionTemplates(teamPk);

  const handleDeleteTemplate = async (template: SchedulePositionTemplate) => {
    await deleteTeamShiftPositionTemplate(template);
  };

  const { setDragging, resetDragging } = useDragAndDrop("shiftPosition");

  const onShiftPositionDragStart = useCallback(
    (
      shiftPosition: ShiftPositionWithFake,
      e: React.DragEvent<HTMLDivElement>
    ) => {
      console.log("onShiftPositionDragStart", shiftPosition);
      setDragging({
        type: "shiftPosition",
        value: shiftPosition,
      });
      e.dataTransfer.dropEffect = "copy";
      e.currentTarget.setAttribute("aria-grabbed", "true");
    },
    [setDragging]
  );

  const onShiftPositionDragEnd = useCallback(
    (
      _shiftPosition: ShiftPositionWithFake,
      e: React.DragEvent<HTMLDivElement>
    ) => {
      resetDragging();
      e.currentTarget.setAttribute("aria-grabbed", "false");
    },
    [resetDragging]
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          <Trans>Shift Position Templates</Trans>
        </h3>
        <p className="text-xs text-gray-500">
          <span className="inline-flex items-center mr-1 align-middle text-blue-400">
            <InformationCircleIcon className="w-4 h-4" aria-hidden="true" />
          </span>
          <Trans>
            You can drag and drop templates to the team shift calendar.
          </Trans>
        </p>
        <button
          onClick={onCreateTemplate}
          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 p-1 rounded-lg cursor-pointer"
        >
          <PlusCircleIcon className="w-4 h-4" aria-hidden="true" />
          <Trans>Create template</Trans>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3">
        {!teamShiftPositionTemplates ||
        teamShiftPositionTemplates.length === 0 ? (
          <div className="h-full flex flex-col">
            <div className="text-center py-8 text-gray-500">
              <Trans>No shift position templates found.</Trans>
            </div>
          </div>
        ) : (
          teamShiftPositionTemplates.map((template, index) => {
            const analyzedShiftPosition =
              convertTemplateToAnalyzedShiftPosition(template, index);

            return (
              <div
                key={`${template.name}-${index}`}
                className="relative border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <ShiftPosition
                  teamPk={teamPk}
                  shiftPosition={analyzedShiftPosition}
                  showScheduleDetails={true}
                  showMenu={false}
                  marginLeftAccordingToSchedule={false}
                  onShiftPositionDragStart={onShiftPositionDragStart}
                  onShiftPositionDragEnd={onShiftPositionDragEnd}
                />

                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    <Hint hint={i18n.t("Delete template")}>
                      <Button
                        onClick={() => handleDeleteTemplate(template)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                        aria-label={`Delete template ${template.name}`}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </Hint>
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
