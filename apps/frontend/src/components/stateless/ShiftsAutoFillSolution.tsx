import { FC, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Trans } from "@lingui/react/macro";
import { i18n } from "@lingui/core";
import { SchedulerState, ScoredShiftSchedule } from "@/scheduler";
import { getDefined } from "@/utils";
import { DayDate } from "@/day-date";
import assignShiftPositionsMutation from "@/graphql-client/mutations/assignShiftPositions.graphql";
import {
  ShiftPositionWithRowSpan,
  useTeamShiftPositionsMap,
} from "../../hooks/useTeamShiftPositionsMap";
import { useMutation } from "../../hooks/useMutation";
import { useTeamLeaveSchedule } from "../../hooks/useTeamLeaveSchedule";
import { ShiftPosition as ShiftPositionType } from "../../graphql/graphql";
import { Button } from "../particles/Button";
import { Tabs } from "../molecules/Tabs";
import { ShiftAutoFillSolutionStats } from "../molecules/ShiftAutoFillSolutionStats";
import { ShiftAutoFillSolutionDetailedStats } from "../atoms/ShiftAutoFillSolutionDetailedStats";
import { ShiftsAutofillSolutionMonthCalendar } from "./ShiftsAutofillSolutionMonthCalendar";

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

  const tabs = useMemo(
    () => [
      {
        name: i18n.t("Calendar"),
        href: "calendar",
      },
      {
        name: i18n.t("Stats"),
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
                  <ShiftsAutofillSolutionMonthCalendar
                    year={yearMonth.year}
                    month={yearMonth.month}
                    progress={progress}
                    shiftPositionsMap={shiftPositionsMap}
                    showScheduleDetails={showScheduleDetails}
                    setShowScheduleDetails={setShowScheduleDetails}
                    showLeaveSchedule={showLeaveSchedule}
                    setShowLeaveSchedule={setShowLeaveSchedule}
                    assignedShiftPositions={assignedShiftPositions}
                    leaveSchedule={leaveSchedule}
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
