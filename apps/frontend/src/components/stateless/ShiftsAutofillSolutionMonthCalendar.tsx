import { Trans } from "@lingui/react/macro";
import { DayDate } from "@/day-date";
import { MonthDailyCalendar } from "./MonthDailyCalendar";
import { classNames } from "../../utils/classNames";
import { ShiftPosition } from "./ShiftPosition";
import { LabeledSwitch } from "./LabeledSwitch";
import { Avatar } from "./Avatar";
import { useMemo } from "react";
import { ShiftPositionWithRowSpan } from "../../hooks/useTeamShiftPositionsMap";
import { LeaveRenderInfo } from "../../hooks/useTeamLeaveSchedule";
import { SchedulerState } from "@/scheduler";

export interface ShiftsAutofillSolutionMonthCalendarProps {
  year: number;
  month: number;
  progress: SchedulerState;
  shiftPositionsMap: Record<string, ShiftPositionWithRowSpan[]>;
  showScheduleDetails: boolean;
  setShowScheduleDetails: (showScheduleDetails: boolean) => void;
  showLeaveSchedule: boolean;
  setShowLeaveSchedule: (showLeaveSchedule: boolean) => void;
  assignedShiftPositions: Record<string, ShiftPositionWithRowSpan[]>;
  leaveSchedule: Record<string, LeaveRenderInfo[]>;
}

export const ShiftsAutofillSolutionMonthCalendar = ({
  year,
  month,
  shiftPositionsMap,
  showScheduleDetails,
  setShowScheduleDetails,
  showLeaveSchedule,
  setShowLeaveSchedule,
  assignedShiftPositions,
  leaveSchedule,
  progress,
}: ShiftsAutofillSolutionMonthCalendarProps) => {
  // for each week (monday to sunday) we need to calculate the maximum number of positions in each day

  const maxRowsPerWeekNumber = useMemo(() => {
    const weekNumbers: Array<number> = [];
    for (const [day, shiftPositions] of Object.entries(
      shiftPositionsMap
    ).sort()) {
      const dayShiftPositionsRows = shiftPositions.reduce(
        (acc, shiftPosition) => acc + shiftPosition.rowSpan,
        0
      );
      const dayLeaveRows = leaveSchedule?.[day]?.length ?? 0;
      const week = new DayDate(day).getWeekNumber();
      weekNumbers[week] = Math.max(
        weekNumbers[week] ?? 0,
        dayShiftPositionsRows + dayLeaveRows
      );
    }
    return weekNumbers;
  }, [leaveSchedule, shiftPositionsMap]);

  return (
    <MonthDailyCalendar
      year={year}
      month={month - 1}
      additionalActions={[
        {
          type: "component",
          component: (
            <LabeledSwitch
              label={<Trans>Show schedule details</Trans>}
              checked={showScheduleDetails}
              onChange={setShowScheduleDetails}
            />
          ),
        },
        {
          type: "component",
          component: (
            <LabeledSwitch
              label={<Trans>Show leave schedule</Trans>}
              checked={showLeaveSchedule}
              onChange={setShowLeaveSchedule}
            />
          ),
        },
      ]}
      renderDay={(day) => {
        const shiftPositions = assignedShiftPositions?.[day.date];
        if (!shiftPositions) {
          return null;
        }
        const leaves = leaveSchedule?.[day.date];
        const rowCount: number | undefined =
          maxRowsPerWeekNumber[new DayDate(day.date).getWeekNumber()];
        return (
          <div
            className={classNames("h-full w-full grid")}
            style={{
              gridTemplateRows: `repeat(${rowCount ?? shiftPositions.length}, 1fr)`,
            }}
          >
            {leaves?.map((leave, leaveIndex) => (
              <div
                key={leave.user.pk}
                className={classNames(
                  "p-2 border-gray-100 bg-gray-50 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#f3f4f6_10px,#f3f4f6_20px)]",
                  leaveIndex === 0 && "border-t",
                  leaveIndex === leaves.length - 1 && "border-b"
                )}
              >
                <div className="flex items-center gap-1">
                  <div className="text-sm flex items-center">
                    <div
                      className="text-sm rounded-full p-1 bg-white"
                      style={{
                        backgroundColor: leave.color,
                      }}
                      title={leave.type}
                    >
                      {leave.icon}
                    </div>
                  </div>
                  <div className="flex items-center -ml-2">
                    <Avatar size={25} {...leave.user} />
                  </div>
                  <div className="text-tiny truncate text-gray-400">
                    {leave.user.name}
                  </div>
                </div>
              </div>
            ))}
            {shiftPositions.map((shiftPosition) => (
              <ShiftPosition
                key={shiftPosition.sk}
                shiftPosition={shiftPosition}
                conflicts={progress.problemInSlotIds.has(shiftPosition.sk)}
                showScheduleDetails={showScheduleDetails}
              />
            ))}
          </div>
        );
      }}
    />
  );
};
