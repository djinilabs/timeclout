import { useMemo } from "react";
import { ResponsiveBoxPlot } from "@nivo/boxplot";
import { Trans } from "@lingui/react/macro";
import { type ScoredShiftSchedule } from "@/scheduler";
import { Avatar } from "./Avatar";

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
    <div className="w-full aspect-2/1">
      <ResponsiveBoxPlot
        data={boxPlotData}
        margin={{ top: 50, right: 130, bottom: 120, left: 60 }}
        minValue="auto"
        maxValue="auto"
        colors="#14b8a6"
        borderRadius={4}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: <Trans>Hours between shifts</Trans>,
          legendPosition: "middle",
          legendOffset: -40,
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: <Trans>Worker</Trans>,
          legendPosition: "middle",
          legendOffset: 80,
          renderTick: (tick) => {
            const worker = workerById[tick.value];
            return (
              <g transform={`translate(${tick.x},${tick.y + 20})`}>
                <foreignObject x="-24" y="-12" width="80" height="60">
                  <div className="flex gap-2 flex-col items-center">
                    <Avatar {...worker} size={24} />
                    <span className="text-tiny text-nowrap">{worker.name}</span>
                  </div>
                </foreignObject>
              </g>
            );
          },
        }}
      />
    </div>
  );
};
