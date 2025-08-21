import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { FC, memo, useCallback, useMemo } from "react";

import { ShiftPositionWithRowSpan } from "../../hooks/useTeamShiftPositionsMap";
import { getInitials } from "../../utils/getInitials";
import { BoxPlot } from "../stats/BoxPlot";

interface TeamShiftsTimeDistributionStatsProps {
  shiftPositionsMap: Record<string, ShiftPositionWithRowSpan[]>;
}

export const TeamShiftsTimeDistributionStats: FC<TeamShiftsTimeDistributionStatsProps> =
  memo(({ shiftPositionsMap }) => {
    const { workerTimeIntervals, workerById } = useMemo(() => {
      // Group shifts by worker
      const shiftsByWorker = Object.values(shiftPositionsMap)
        .flat()
        .reduce((acc, shiftPosition) => {
          if (!shiftPosition.assignedTo) return acc;

          if (!acc[shiftPosition.assignedTo.pk]) {
            acc[shiftPosition.assignedTo.pk] = [];
          }
          acc[shiftPosition.assignedTo.pk].push(shiftPosition);
          return acc;
        }, {} as Record<string, ShiftPositionWithRowSpan[]>);

      // For each worker, sort their shifts by day and calculate intervals
      const workerTimeIntervals = Object.entries(shiftsByWorker)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([workerPk, shifts]) => {
          // Sort shifts by day
          const sortedShifts = [...shifts].sort((a, b) => {
            return new Date(a.day).getTime() - new Date(b.day).getTime();
          });

          // Calculate intervals between consecutive shifts
          const intervals = sortedShifts.slice(0, -1).map((shift, index) => {
            const nextShift = sortedShifts[index + 1];
            const currentDay = new Date(shift.day);
            const nextDay = new Date(nextShift.day);

            // Calculate days between shifts
            const timeDiff = nextDay.getTime() - currentDay.getTime();
            const daysDiff = timeDiff / (1000 * 3600 * 24);

            return {
              interval: daysDiff,
            };
          });

          return {
            workerPk,
            intervals,
          };
        });

      const workerById = Object.values(shiftPositionsMap)
        .flat()
        .reduce((acc, shiftPosition) => {
          if (shiftPosition.assignedTo) {
            acc[shiftPosition.assignedTo.pk] = shiftPosition.assignedTo;
          }
          return acc;
        }, {} as Record<string, NonNullable<ShiftPositionWithRowSpan["assignedTo"]>>);

      return {
        workerTimeIntervals,
        workerById,
      };
    }, [shiftPositionsMap]);

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
            axisBottomLabel={i18n.t("Days between shifts")}
          />
        </div>
      </div>
    );
  });

TeamShiftsTimeDistributionStats.displayName = "TeamShiftsTimeDistributionStats";
