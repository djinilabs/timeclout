import { FC, memo, useCallback, useMemo } from "react";
import { Trans } from "@lingui/react/macro";
import { type ScoredShiftSchedule } from "@/scheduler";
import { getInitials } from "../../utils/getInitials";
import { BoxPlot } from "../stats/BoxPlot";
import { i18n } from "@lingui/core";

interface ShiftsAutoFillSolutionTimeDistributionStatsProps {
  schedule: ScoredShiftSchedule;
}

export const ShiftsAutoFillSolutionTimeDistributionStats: FC<ShiftsAutoFillSolutionTimeDistributionStatsProps> =
  memo(({ schedule }) => {
    const { schedule: shiftSchedule } = schedule;

    const { workerTimeIntervals, workerById } = useMemo(() => {
      // Group shifts by worker
      const shiftsByWorker = shiftSchedule.shifts.reduce((acc, shift) => {
        if (!shift.assigned) return acc;

        if (!acc[shift.assigned.pk]) {
          acc[shift.assigned.pk] = [];
        }
        acc[shift.assigned.pk].push(shift);
        return acc;
      }, {} as Record<string, typeof shiftSchedule.shifts>);

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

      const workerById = shiftSchedule.shifts.reduce((acc, shift) => {
        if (shift.assigned) {
          acc[shift.assigned.pk] = shift.assigned;
        }
        return acc;
      }, {} as Record<string, (typeof shiftSchedule.shifts)[number]["assigned"]>);

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

    const tickLabel = useCallback(
      (tick: string) => {
        const worker = workerById[tick];
        if (!worker) {
          return "";
        }
        return getInitials(worker.name);
      },
      [workerById]
    );

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
          <BoxPlot
            data={boxPlotData}
            tickLabel={tickLabel}
            axisBottomLabel={i18n.t("Hours between shifts")}
          />
        </div>
      </div>
    );
  });
