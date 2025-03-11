import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Trans } from "@lingui/react/macro";
import { SchedulerState } from "@/scheduler";
import { DayDate } from "@/day-date";
import assignShiftPositionsMutation from "@/graphql-client/mutations/assignShiftPositions.graphql";
import { MonthCalendar } from "./MonthCalendar";
import {
  useTeamShiftPositionsMap,
  ShiftPositionWithRowSpan,
} from "../../hooks/useTeamShiftPositionsMap";
import { classNames } from "../../utils/classNames";
import { ShiftPosition } from "./ShiftPosition";
import { ShiftPosition as ShiftPositionType } from "libs/graphql/src/types.generated";
import { useMutation } from "../../hooks/useMutation";
import { getDefined } from "@/utils";
import { Button } from "./Button";
import toast from "react-hot-toast";
import { ShiftAutoFillSolutionStats } from "./ShiftAutoFillSolutionStats";
import { Tabs } from "./Tabs";
import { ShiftAutoFillSolutionDetailedStats } from "./ShiftAutoFillSolutionDetailedStats";
import { Attention } from "./Attention";
import { i18n } from "@lingui/core";
export interface ShiftsAutoFillProgressProps {
  startDate?: DayDate;
  endDate?: DayDate;
  progress: SchedulerState;
  shiftPositions: ShiftPositionType[];
  canAssignShiftPositions: boolean;
  onAssignShiftPositions: () => void;
}

export const ShiftsAutoFillProgress = ({
  startDate,
  endDate,
  progress,
  shiftPositions,
  canAssignShiftPositions,
  onAssignShiftPositions,
}: ShiftsAutoFillProgressProps) => {
  const { team } = useParams();
  const topSolution = progress.topSolutions[0];

  const yearMonths: Array<{ year: number; month: number }> = useMemo(() => {
    const months = [];
    let start = startDate;
    while (start && endDate && start.isBeforeOrEqual(endDate)) {
      months.push({ year: start.getYear(), month: start.getMonth() });
      start = start.nextMonth();
    }
    return months;
  }, [startDate, endDate]);

  const { shiftPositionsMap } = useTeamShiftPositionsMap({
    shiftPositionsResult: shiftPositions,
  });

  // for each week (monday to sunday) we need to calculate the maximum number of positions in each day

  const maxRowsPerWeekNumber = useMemo(() => {
    const weekNumbers: Array<number> = [];
    for (const [day, shiftPositions] of Object.entries(
      shiftPositionsMap
    ).sort()) {
      const week = new DayDate(day).getWeekNumber();
      const dayRows = shiftPositions.reduce(
        (acc, shiftPosition) => acc + shiftPosition.rowSpan,
        0
      );
      weekNumbers[week] = Math.max(weekNumbers[week] ?? 0, dayRows);
    }
    return weekNumbers;
  }, [shiftPositionsMap]);

  const assignedShiftPositions: Record<string, ShiftPositionWithRowSpan[]> =
    useMemo(() => {
      return Object.fromEntries(
        Object.entries(shiftPositionsMap).map(([day, shiftPositions]) => {
          const newShiftPositions = shiftPositions.map((shiftPosition) => {
            const shift = topSolution?.schedule.shifts.find(
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
    }, [shiftPositionsMap, topSolution]);

  // asssign shift positions

  const [{ fetching: fetchingAssignShiftPositions }, assignShiftPositions] =
    useMutation(assignShiftPositionsMutation);

  const handleAssignShiftPositions = useCallback(async () => {
    const solution = topSolution?.schedule;
    if (!solution) {
      return;
    }
    const result = await assignShiftPositions({
      input: {
        team: getDefined(team),
        assignments: solution.shifts.map((shift) => ({
          shiftPositionId: shift.slot.id,
          workerPk: shift.assigned.pk,
        })),
      },
    });
    if (!result.error) {
      toast.success(i18n.t("Shift positions assigned successfully"));
      onAssignShiftPositions();
    }
  }, [assignShiftPositions, onAssignShiftPositions, team, topSolution]);

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

  // problematic slots
  const { computed, problemInSlotIds, discardedReasons } = progress;

  const totalDiscarded = useMemo(() => {
    return Array.from(discardedReasons.values()).reduce(
      (acc, count) => acc + count,
      0
    );
  }, [discardedReasons]);

  console.log({ problemInSlotIds });
  const problemInShiftPosition = useMemo(() => {
    if (computed > totalDiscarded) {
      return undefined;
    }
    const mostProblematicShiftPositionId = Array.from(problemInSlotIds).reduce<
      [number, string]
    >(
      ([maxCount, maxId], [id, count]) => {
        if (count > maxCount) {
          return [count, id];
        }
        return [maxCount, maxId];
      },
      [0, ""]
    )?.[1];
    return shiftPositions.find(
      (shiftPosition) => shiftPosition.sk === mostProblematicShiftPositionId
    );
  }, [computed, problemInSlotIds, shiftPositions, totalDiscarded]);

  const problemInShiftPositionDay = useMemo(() => {
    return problemInShiftPosition?.day
      ? new DayDate(problemInShiftPosition?.day).toHumanString()
      : undefined;
  }, [problemInShiftPosition]);

  console.log("discardedReasons", discardedReasons);

  const discardedReasonsList = useMemo(() => {
    return Array.from(discardedReasons.entries()).map(([reason, count]) => ({
      reason,
      count,
    }));
  }, [discardedReasons]);

  console.log("discardedReasonsList", discardedReasonsList);

  return (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-4">
        <div className="mt-5">
          {canAssignShiftPositions && topSolution?.schedule && (
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
        {discardedReasonsList.length > 0 && (
          <div className="mt-5">
            <Attention title={<Trans>Attention needed</Trans>}>
              <>
                <p>
                  <Trans>There are</Trans>{" "}
                  {problemInSlotIds.size + discardedReasonsList.length}{" "}
                  <Trans>
                    conflict(s) when trying to search for a solution
                  </Trans>
                  {problemInShiftPositionDay ? (
                    <>
                      <Trans>starting on day</Trans> {problemInShiftPositionDay}
                    </>
                  ) : (
                    ""
                  )}
                  .
                </p>
                <p>
                  <Trans>
                    Some solutions have been discarded because of the following
                    reasons:
                  </Trans>
                  <ul className="list-disc list-inside">
                    {discardedReasonsList.map(({ reason }) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </p>
              </>
            </Attention>
          </div>
        )}

        <Tabs
          onChange={setTab}
          tabs={tabs}
          tabPropName="shiftsAutoFillProgressTab"
        >
          {tab.href === "calendar" && (
            <>
              {yearMonths.map((yearMonth) => (
                <div key={`${yearMonth.year}-${yearMonth.month}`}>
                  <MonthCalendar
                    year={yearMonth.year}
                    month={yearMonth.month - 1}
                    renderDay={(day) => {
                      const shiftPositions = assignedShiftPositions?.[day.date];
                      if (!shiftPositions) {
                        return null;
                      }
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
                          {shiftPositions.map((shiftPosition) => (
                            <ShiftPosition
                              key={shiftPosition.sk}
                              shiftPosition={shiftPosition}
                              conflicts={problemInSlotIds.has(shiftPosition.sk)}
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
          {tab.href === "stats" && topSolution?.schedule && (
            <ShiftAutoFillSolutionDetailedStats schedule={topSolution} />
          )}
        </Tabs>
      </div>

      <div className="col-span-1">
        <ShiftAutoFillSolutionStats progress={progress} />
      </div>
    </div>
  );
};
