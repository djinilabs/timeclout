import { useMemo } from "react";
import { SchedulerState } from "@/scheduler";
import { DayDate } from "@/day-date";
import { MonthCalendar } from "./MonthCalendar";
import {
  useTeamShiftPositionsMap,
  ShiftPositionWithFake,
} from "../../hooks/useTeamShiftPositionsMap";
import { classNames } from "../../utils/classNames";
import { ShiftPosition } from "./ShiftPosition";
import { ShiftPosition as ShiftPositionType } from "libs/graphql/src/types.generated";
export interface ShiftsAutoFillProgressProps {
  startDate: DayDate;
  endDate: DayDate;
  progress: SchedulerState;
  shiftPositions: ShiftPositionType[];
}

export const ShiftsAutoFillProgress = ({
  startDate,
  endDate,
  progress,
  shiftPositions,
}: ShiftsAutoFillProgressProps) => {
  const topSolution = progress.topSolutions[0];

  const stats = useMemo(() => {
    return [
      { name: "Cycle count", stat: progress.cycleCount.toLocaleString() },
      { name: "Computed shifts", stat: progress.computed.toLocaleString() },
      {
        name: "Top score",
        stat: `${Math.round(
          (1 - (topSolution?.score ?? 0)) * 100
        ).toLocaleString()}%`,
      },
    ];
  }, [progress, topSolution]);

  const discardedStats = useMemo(() => {
    const total = Array.from(progress.discardedReasons.values()).reduce(
      (sum, count) => sum + count,
      0
    );

    return Array.from(progress.discardedReasons.entries()).map(
      ([reason, count]) => ({
        name: reason,
        stat: `${count.toLocaleString()} (${Math.round(
          (count / total) * 100
        )}%)`,
      })
    );
  }, [progress.discardedReasons]);

  const topSolutionStats = useMemo(() => {
    return topSolution?.heuristicScores.map((heuristic) => ({
      name: heuristic.name,
      stat: (
        <span
          className={`${
            Math.round((1 - heuristic.score) * 100) >= 90
              ? "text-green-600"
              : Math.round((1 - heuristic.score) * 100) >= 70
                ? "text-yellow-600"
                : "text-red-600"
          }`}
        >
          {Math.round((1 - heuristic.score) * 100).toLocaleString()}%
        </span>
      ),
    }));
  }, [topSolution]);

  const yearMonths: Array<{ year: number; month: number }> = useMemo(() => {
    const months = [];
    let start = startDate;
    while (start.isBeforeOrEqual(endDate)) {
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

  const assignedShiftPositions: Record<string, ShiftPositionWithFake[]> =
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

  return (
    <>
      <div>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.name}
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-gray-500">
                {item.name}
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {item.stat}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {discardedStats.length > 0 && (
        <div className="mt-5">
          <h3 className="text-base font-semibold text-gray-900">
            Discarded Schedules
          </h3>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {discardedStats.map((item) => (
              <div
                key={item.name}
                className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
              >
                <dt className="truncate text-sm font-medium text-gray-500">
                  {item.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {item.stat}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="mt-5">
        <h3 className="text-base font-semibold text-gray-900">Top Solution</h3>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {topSolutionStats.map((item) => (
            <div
              key={item.name}
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-gray-500">
                {item.name}
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {item.stat}
              </dd>
            </div>
          ))}
        </dl>
      </div>

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
                maxRowsPerWeekNumber[new DayDate(day.date).getWeekNumber()];
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
                    />
                  ))}
                </div>
              );
            }}
          />
        </div>
      ))}
    </>
  );
};
