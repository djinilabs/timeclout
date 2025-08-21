import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { FC, memo, useCallback, useMemo } from "react";

import { ShiftPositionWithRowSpan } from "../../hooks/useTeamShiftPositionsMap";
import { getInitials } from "../../utils/getInitials";
import { StackedBarPlot } from "../stats/StackedBarPlot";

interface TeamShiftsScheduleTypeDistributionStatsProps {
  shiftPositionsMap: Record<string, ShiftPositionWithRowSpan[]>;
}

export const TeamShiftsScheduleTypeDistributionStats: FC<TeamShiftsScheduleTypeDistributionStatsProps> =
  memo(({ shiftPositionsMap }) => {
    const { typeNames, workerStats, workerById } = useMemo(() => {
      // Get unique type names from shifts (using name field)
      const typeNames = [
        ...new Set(
          Object.values(shiftPositionsMap)
            .flat()
            .map((shift) => shift.name || "Unnamed")
            .filter(Boolean)
        ),
      ];

      // Define the type for worker assignments
      type WorkerAssignment = {
        workerName: string;
        [key: string]: string | number;
      };

      // Count assignments per worker per type
      const workerTypeAssignments: Record<string, WorkerAssignment> =
        Object.values(shiftPositionsMap)
          .flat()
          .reduce((acc, shiftPosition) => {
            if (!shiftPosition.assignedTo) return acc;

            const typeName = shiftPosition.name || "Unnamed";
            if (!acc[shiftPosition.assignedTo.pk]) {
              acc[shiftPosition.assignedTo.pk] = {
                workerName: shiftPosition.assignedTo.pk,
                ...typeNames.reduce(
                  (types, type) => ({ ...types, [type]: 0 }),
                  {} as Record<string, number>
                ),
              };
            }

            (acc[shiftPosition.assignedTo.pk][typeName] as number)++;
            return acc;
          }, {} as Record<string, WorkerAssignment>);

      const workerStats = Object.entries(workerTypeAssignments)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, v]) => {
          return Object.fromEntries(
            Object.entries(v).filter(
              ([, value]) => typeof value !== "number" || value !== 0
            )
          );
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
        typeNames,
        workerStats,
        workerById,
      };
    }, [shiftPositionsMap]);

    return (
      <div className="w-full">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">
            <Trans>Number of shifts</Trans>
          </h2>
          <p className="text-sm text-gray-500">
            <Trans>
              The number of shifts assigned to each worker for each type.
            </Trans>
          </p>
          <div className="aspect-square w-full">
            <StackedBarPlot
              data={workerStats}
              groupNames={typeNames}
              legend={i18n.t("Number of shifts")}
              tickLabel={useCallback(
                (data) => {
                  const worker = workerById[data];
                  if (!worker) {
                    return "";
                  }
                  return getInitials(worker.name);
                },
                [workerById]
              )}
            />
          </div>
        </div>
      </div>
    );
  });

TeamShiftsScheduleTypeDistributionStats.displayName =
  "TeamShiftsScheduleTypeDistributionStats";
