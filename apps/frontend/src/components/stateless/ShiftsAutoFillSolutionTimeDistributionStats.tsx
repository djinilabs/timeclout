import { useMemo } from "react";
import { ResponsiveBoxPlot } from "@nivo/boxplot";
import { Trans } from "@lingui/react/macro";
import { type ScoredShiftSchedule } from "@/scheduler";
import { getInitials } from "../../utils/getInitials";

export const ShiftsAutoFillSolutionTimeDistributionStats = ({
  schedule,
}: {
  schedule: ScoredShiftSchedule;
}) => {
  const { schedule: shiftSchedule } = schedule;

  const { workerTimeIntervals, workerById } = useMemo(() => {
    // Group shifts by worker
    const shiftsByWorker = shiftSchedule.shifts.reduce(
      (acc, shift) => {
        if (!shift.assigned) return acc;

        if (!acc[shift.assigned.pk]) {
          acc[shift.assigned.pk] = [];
        }
        acc[shift.assigned.pk].push(shift);
        return acc;
      },
      {} as Record<string, typeof shiftSchedule.shifts>
    );

    // For each worker, sort their shifts by start time and calculate intervals
    const workerTimeIntervals = Object.entries(shiftsByWorker).map(
      ([workerPk, shifts]) => {
        // Sort shifts by start time of first work hour
        const sortedShifts = [...shifts].sort((a, b) => {
          return a.slot.workHours[0].start - b.slot.workHours[0].start;
        });

        // Calculate intervals between consecutive shifts
        const intervals = sortedShifts.slice(0, -1).map((shift, index) => {
          const nextShift = sortedShifts[index + 1];
          const currentEnd =
            shift.slot.workHours[shift.slot.workHours.length - 1].end;
          const nextStart = nextShift.slot.workHours[0].start;
          return {
            interval: (nextStart - currentEnd) / 60, // Convert minutes to hours
          };
        });

        return {
          workerPk,
          intervals,
        };
      }
    );

    const workerById = shiftSchedule.shifts.reduce(
      (acc, shift) => {
        if (shift.assigned) {
          acc[shift.assigned.pk] = shift.assigned;
        }
        return acc;
      },
      {} as Record<string, (typeof shiftSchedule.shifts)[number]["assigned"]>
    );

    return {
      workerTimeIntervals,
      workerById,
    };
  }, [shiftSchedule]);

  // Transform data for box plot - create one data point per interval
  const boxPlotData = useMemo(() => {
    return workerTimeIntervals.flatMap(({ workerPk, intervals }) =>
      intervals.map((interval) => ({
        group: workerPk,
        value: interval.interval,
      }))
    );
  }, [workerTimeIntervals]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <h2 className="text-lg font-bold">
        <Trans>Time between shifts</Trans>
      </h2>
      <p className="text-sm text-gray-500">
        <Trans>
          The time between shifts for each worker. The box plot shows the
          median, quartiles, and outliers.
        </Trans>
      </p>
      <div className="aspect-square w-full">
        <ResponsiveBoxPlot
          data={boxPlotData}
          margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
          minValue="auto"
          maxValue="auto"
          colors="#14b8a6"
          borderRadius={4}
          layout="horizontal"
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: <Trans>Hours between shifts</Trans>,
            legendPosition: "middle",
            legendOffset: 40,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: <Trans>Worker</Trans>,
            legendPosition: "middle",
            legendOffset: 80,
            renderTick: (tick) => {
              const worker = workerById[tick.value];
              if (!worker) {
                return null;
              }
              return (
                <g transform={`translate(${tick.x - 25},${tick.y})`}>
                  <foreignObject x="-10" y="-10" width="200" height="60">
                    <div className="flex gap-2 flex-col">
                      <span className="text-sm">
                        {getInitials(worker.name)}
                      </span>
                    </div>
                  </foreignObject>
                  <text
                    x="-22"
                    y="4"
                    textAnchor="end"
                    dominantBaseline="middle"
                    style={{ fill: "rgb(102, 102, 102)", fontSize: "14px" }}
                  >
                    {tick.value.name}
                  </text>
                </g>
              );
            },
          }}
        />
      </div>
    </div>
  );
};
