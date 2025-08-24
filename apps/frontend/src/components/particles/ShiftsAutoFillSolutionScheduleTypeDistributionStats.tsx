import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { FC, memo, useCallback, useMemo } from "react";

import { getInitials } from "../../utils/getInitials";
import { StackedBarPlot } from "../stats/StackedBarPlot";

import { type ScoredShiftSchedule } from "@/scheduler";

interface ShiftsAutoFillSolutionScheduleTypeDistributionStatsProperties {
  schedule: ScoredShiftSchedule;
}

export const ShiftsAutoFillSolutionScheduleTypeDistributionStats: FC<ShiftsAutoFillSolutionScheduleTypeDistributionStatsProperties> =
  memo(({ schedule }) => {
    const { schedule: shiftSchedule } = schedule;

    const { typeNames, workerStats, workerById } = useMemo(() => {
      // Get unique type names from shifts
      const typeNames = [
        ...new Set(shiftSchedule.shifts.map((shift) => shift.slot.typeName)),
      ];

      // Define the type for worker assignments
      type WorkerAssignment = {
        workerName: string;
        [key: string]: string | number;
      };

      // Count assignments per worker per type
      const workerTypeAssignments: Record<string, WorkerAssignment> =
        shiftSchedule.shifts.reduce((accumulator, shift) => {
          if (!shift.assigned) return accumulator;

          if (!accumulator[shift.assigned.pk]) {
            accumulator[shift.assigned.pk] = {
              workerName: shift.assigned.pk,
              ...typeNames.reduce(
                (types, type) => ({ ...types, [type]: 0 }),
                {} as Record<string, number>
              ),
            };
          }

          (accumulator[shift.assigned.pk][shift.slot.typeName] as number)++;
          return accumulator;
        }, {} as Record<string, WorkerAssignment>);

      console.log({ workerTypeAssignments });

      const workerStats = Object.values(workerTypeAssignments).map((v) => {
        return Object.fromEntries(
          Object.entries(v).filter(
            ([, value]) => typeof value !== "number" || value !== 0
          )
        );
      });

      const workerById = shiftSchedule.shifts.reduce((accumulator, shift) => {
        if (shift.assigned) {
          accumulator[shift.assigned.pk] = shift.assigned;
        }
        return accumulator;
      }, {} as Record<string, (typeof shiftSchedule.shifts)[number]["assigned"]>);

      return {
        typeNames,
        workerStats,
        workerById,
      };
    }, [shiftSchedule]);

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

ShiftsAutoFillSolutionScheduleTypeDistributionStats.displayName =
  "ShiftsAutoFillSolutionScheduleTypeDistributionStats";
