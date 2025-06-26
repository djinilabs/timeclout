import { FC, memo, useCallback, useMemo } from "react";
import { Trans } from "@lingui/react/macro";
import { getInitials } from "../../utils/getInitials";
import {
  DeviationBarPlot,
  DeviationBarPlotDatum,
} from "../stats/DeviationBarPlot";
import { i18n } from "@lingui/core";
import { ShiftPositionWithRowSpan } from "../../hooks/useTeamShiftPositionsMap";

interface TeamShiftsInconvenienceDeviationStatsProps {
  shiftPositionsMap: Record<string, ShiftPositionWithRowSpan[]>;
}

export const TeamShiftsInconvenienceDeviationStats: FC<TeamShiftsInconvenienceDeviationStatsProps> =
  memo(({ shiftPositionsMap }) => {
    const { workerById, inconvenienceByWorker, expectedInconvenience } =
      useMemo(() => {
        // Group shifts by worker
        const workerShifts = Object.values(shiftPositionsMap)
          .flat()
          .reduce((acc, shiftPosition) => {
            if (!shiftPosition.assignedTo) return acc;

            const workerPk = shiftPosition.assignedTo.pk;
            if (!acc[workerPk]) {
              acc[workerPk] = [];
            }
            acc[workerPk].push(shiftPosition);
            return acc;
          }, {} as Record<string, ShiftPositionWithRowSpan[]>);

        // Calculate total inconvenience across all shifts
        const totalInconvenience = Object.values(workerShifts).reduce(
          (acc, shifts) =>
            acc +
            shifts.reduce(
              (shiftAcc, shift) =>
                shiftAcc +
                shift.schedules.reduce(
                  (scheduleAcc, schedule) =>
                    scheduleAcc +
                    schedule.startHourMinutes.reduce(
                      (hourAcc, startMinute, index) => {
                        const endMinute = schedule.endHourMinutes[index];
                        const durationHours = (endMinute - startMinute) / 60;
                        return (
                          hourAcc +
                          durationHours * schedule.inconveniencePerHour
                        );
                      },
                      0
                    ),
                  0
                ),
              0
            ),
          0
        );

        // Calculate expected inconvenience per worker
        const expectedInconvenience =
          totalInconvenience / Object.keys(workerShifts).length;

        // Calculate total inconvenience per worker
        const inconvenienceByWorker = Object.entries(workerShifts).map(
          ([workerPk, shifts]) => ({
            workerPk,
            totalInconvenience: shifts.reduce(
              (acc, shift) =>
                acc +
                shift.schedules.reduce(
                  (scheduleAcc, schedule) =>
                    scheduleAcc +
                    schedule.startHourMinutes.reduce(
                      (hourAcc, startMinute, index) => {
                        const endMinute = schedule.endHourMinutes[index];
                        const durationHours = (endMinute - startMinute) / 60;
                        return (
                          hourAcc +
                          durationHours * schedule.inconveniencePerHour
                        );
                      },
                      0
                    ),
                  0
                ),
              0
            ),
            numShifts: shifts.length,
          })
        );

        // Collect worker info by id
        const workerById = Object.values(shiftPositionsMap)
          .flat()
          .reduce((acc, shiftPosition) => {
            if (shiftPosition.assignedTo) {
              acc[shiftPosition.assignedTo.pk] = shiftPosition.assignedTo;
            }
            return acc;
          }, {} as Record<string, NonNullable<ShiftPositionWithRowSpan["assignedTo"]>>);

        return {
          expectedInconvenience,
          inconvenienceByWorker,
          workerById,
        };
      }, [shiftPositionsMap]);

    const maxDeviation = Math.max(
      ...inconvenienceByWorker.map((w) =>
        Math.abs(w.totalInconvenience - expectedInconvenience)
      )
    );

    return (
      <div className="flex flex-col gap-2 w-full">
        <h2 className="text-lg font-bold">
          <Trans>Inconvenience Deviation</Trans>
        </h2>
        <p className="text-sm text-gray-500">
          <Trans>
            The deviation of the inconvenience from the expected inconvenience.
          </Trans>
        </p>
        <div className="aspect-square w-full">
          <DeviationBarPlot
            label={useCallback(
              (data: DeviationBarPlotDatum) => {
                const deviationPercent = (
                  (data.deviation / expectedInconvenience) *
                  100
                ).toFixed(1);
                return `${data.deviation >= 0 ? "+" : ""}${deviationPercent}%`;
              },
              [expectedInconvenience]
            )}
            maxDeviation={maxDeviation}
            data={useMemo(
              () =>
                inconvenienceByWorker.map((worker) => ({
                  group: worker.workerPk,
                  deviation: worker.totalInconvenience - expectedInconvenience,
                })),
              [inconvenienceByWorker, expectedInconvenience]
            )}
            color={useCallback(
              (data: DeviationBarPlotDatum) => {
                const deviation = Math.abs(data.deviation);

                const ratio = deviation / maxDeviation;
                // Use teal color scale from light to dark based on ratio
                const tealBase = 180; // Teal hue
                const lightness = 80 - ratio * 40; // Vary from 80% to 30% lightness
                return `hsl(${tealBase}, 50%, ${lightness}%)`;
              },
              [maxDeviation]
            )}
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
            axisBottomLabel={i18n.t("Inconvenience:Deviation from Expected")}
            ariaLabel="Worker inconvenience deviation chart"
          />
        </div>
      </div>
    );
  });
