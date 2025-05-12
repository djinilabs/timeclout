import { FC, useCallback, useMemo, useState } from "react";
import { Trans } from "@lingui/react/macro";
import { SchedulerState, ScoredShiftSchedule } from "@/scheduler";
import { DayDate } from "@/day-date";
import assignShiftPositionsMutation from "@/graphql-client/mutations/assignShiftPositions.graphql";
import { MonthDailyCalendar } from "./MonthDailyCalendar";
import {
  ShiftPositionWithRowSpan,
  useTeamShiftPositionsMap,
} from "../../hooks/useTeamShiftPositionsMap";
import { classNames } from "../../utils/classNames";
import { ShiftPosition } from "./ShiftPosition";
import { useMutation } from "../../hooks/useMutation";
import { getDefined } from "@/utils";
import { Button } from "./Button";
import toast from "react-hot-toast";
import { ShiftAutoFillSolutionStats } from "./ShiftAutoFillSolutionStats";
import { Tabs } from "./Tabs";
import { ShiftAutoFillSolutionDetailedStats } from "./ShiftAutoFillSolutionDetailedStats";
import { i18n } from "@lingui/core";
import { LabeledSwitch } from "./LabeledSwitch";
import { Avatar } from "./Avatar";
import { useTeamLeaveSchedule } from "../../hooks/useTeamLeaveSchedule";
import { ShiftPosition as ShiftPositionType } from "../../graphql/graphql";

export interface ShiftsAutoFillSolutionProps {
  team: string;
  company: string;
  startDate?: DayDate;
  endDate?: DayDate;
  progress: SchedulerState;
  solution: ScoredShiftSchedule;
  shiftPositions: ShiftPositionType[];
  canAssignShiftPositions: boolean;
  onAssignShiftPositions: () => void;
}

export const ShiftsAutoFillSolution: FC<ShiftsAutoFillSolutionProps> = ({
  team,
  company,
  startDate,
  endDate,
  progress,
  solution,
  shiftPositions,
  canAssignShiftPositions,
  onAssignShiftPositions,
}) => {
  const [showScheduleDetails, setShowScheduleDetails] = useState(false);

  const { shiftPositionsMap } = useTeamShiftPositionsMap({
    shiftPositionsResult: shiftPositions,
    spillTime: showScheduleDetails,
  });

  // team leave schedule
  const [showLeaveSchedule, setShowLeaveSchedule] = useState(false);

  const { leaveSchedule } = useTeamLeaveSchedule({
    company: getDefined(company),
    team: getDefined(team),
    calendarStartDay: startDate ?? DayDate.today(),
    calendarEndDay: endDate ?? DayDate.today(),
    pause: !showLeaveSchedule,
  });

  const yearMonths: Array<{ year: number; month: number }> = useMemo(() => {
    const months = [];
    let start = startDate;
    while (start && endDate && start.isBeforeOrEqual(endDate)) {
      months.push({ year: start.getYear(), month: start.getMonth() });
      start = start.nextMonth();
    }
    return months;
  }, [startDate, endDate]);

  const assignedShiftPositions: Record<string, ShiftPositionWithRowSpan[]> =
    useMemo(() => {
      return Object.fromEntries(
        Object.entries(shiftPositionsMap).map(([day, shiftPositions]) => {
          const newShiftPositions = shiftPositions.map((shiftPosition) => {
            const shift = solution?.schedule.shifts.find(
              (shift) => shift.slot.id === shiftPosition.sk
            );
            if (!shift) {
              return shiftPosition;
            }
            return {
              ...shiftPosition,
              assignedTo: shift.assigned,
            };
          });
          return [day, newShiftPositions];
        })
      );
    }, [shiftPositionsMap, solution]);

  // asssign shift positions

  const [{ fetching: fetchingAssignShiftPositions }, assignShiftPositions] =
    useMutation(assignShiftPositionsMutation);

  const handleAssignShiftPositions = useCallback(async () => {
    const schedule = solution?.schedule;
    if (!schedule) {
      return;
    }
    const result = await assignShiftPositions({
      input: {
        team: getDefined(team),
        assignments: schedule.shifts.map((shift) => ({
          shiftPositionId: shift.slot.id,
          workerPk: shift.assigned.pk,
        })),
      },
    });
    if (!result.error) {
      toast.success(i18n.t("Shift positions assigned successfully"));
      onAssignShiftPositions();
    }
  }, [assignShiftPositions, onAssignShiftPositions, team, solution]);

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

  const tabs = useMemo(
    () => [
      {
        name: "Calendar",
        href: "calendar",
      },
      {
        name: "Stats",
        href: "stats",
      },
    ],
    []
  );

  const [tab, setTab] = useState(tabs[0]);

  return (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-4">
        <div className="mt-5">
          {canAssignShiftPositions && solution?.schedule && (
            <Button
              disabled={fetchingAssignShiftPositions}
              onClick={handleAssignShiftPositions}
            >
              {fetchingAssignShiftPositions ? (
                <Trans>Assigning Shift Positions...</Trans>
              ) : (
                <Trans>
                  Use this solution and assigning these shift Positions
                </Trans>
              )}
            </Button>
          )}
        </div>

        <Tabs
          onChange={setTab}
          tabs={tabs}
          tabPropName="shiftsAutoFillProgressTab"
        >
          {tab.href === "calendar" && (
            <>
              {yearMonths.map((yearMonth) => (
                <div key={`${yearMonth.year}-${yearMonth.month}`}>
                  <MonthDailyCalendar
                    year={yearMonth.year}
                    month={yearMonth.month - 1}
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
                        maxRowsPerWeekNumber[
                          new DayDate(day.date).getWeekNumber()
                        ];
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
                              conflicts={progress.problemInSlotIds.has(
                                shiftPosition.sk
                              )}
                              showScheduleDetails={showScheduleDetails}
                            />
                          ))}
                        </div>
                      );
                    }}
                  />
                </div>
              ))}
            </>
          )}
          {tab.href === "stats" && solution?.schedule && (
            <ShiftAutoFillSolutionDetailedStats schedule={solution} />
          )}
        </Tabs>
      </div>

      <div className="col-span-1">
        <ShiftAutoFillSolutionStats solution={solution} progress={progress} />
      </div>
    </div>
  );
};
