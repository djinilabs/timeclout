import { FC, memo, useMemo } from "react";
import { Slot, SlotWorker, type ScoredShiftSchedule } from "@/scheduler";
import { Trans } from "@lingui/react/macro";
import { getInitials } from "../../utils/getInitials";
import { DeviationBarPlot } from "../stats/DeviationBarPlot";
import { i18n } from "@lingui/core";

interface ShiftsAutoFillSolutionInconvenienceDeviationStatsProps {
  schedule: ScoredShiftSchedule;
}

export const ShiftsAutoFillSolutionInconvenienceDeviationStats: FC<ShiftsAutoFillSolutionInconvenienceDeviationStatsProps> =
  memo(({ schedule }) => {
    const { schedule: shiftSchedule } = schedule;

    const { workerById, inconvenienceByWorker, expectedInconvenience } =
      useMemo(() => {
        // Group shifts by worker
        const workerShifts = shiftSchedule.shifts.reduce((acc, shift) => {
          const workerPk = shift.assigned.pk;
          if (!acc[workerPk]) {
            acc[workerPk] = [];
          }
          acc[workerPk].push(shift.slot);
          return acc;
        }, {} as Record<string, Slot[]>);

        // calculate expected inconvenience
        // Calculate total inconvenience across all slots
        const totalInconvenience = Object.values(workerShifts).reduce(
          (acc, slots) =>
            acc +
            slots.reduce(
              (slotAcc, slot) =>
                slotAcc +
                slot.workHours.reduce(
                  (hourAcc, workHour) =>
                    hourAcc +
                    (workHour.end - workHour.start) *
                      workHour.inconvenienceMultiplier,
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
          ([workerPk, slots]) => ({
            workerPk,
            totalInconvenience: slots.reduce(
              (acc, slot) =>
                acc +
                slot.workHours.reduce(
                  (sum, workHour) =>
                    sum +
                    (workHour.end - workHour.start) *
                      workHour.inconvenienceMultiplier,
                  0
                ),
              0
            ),
            numShifts: slots.length,
          })
        );

        // Collect worker info by id
        const workerById = shiftSchedule.shifts.reduce((acc, shift) => {
          acc[shift.assigned.pk] = shift.assigned;
          return acc;
        }, {} as Record<string, SlotWorker>);

        return {
          expectedInconvenience,
          inconvenienceByWorker,
          workerById,
        };
      }, [shiftSchedule]);

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
            label={(data) => {
              const deviationPercent = (
                (data.deviation / expectedInconvenience) *
                100
              ).toFixed(1);
              return `${data.deviation >= 0 ? "+" : ""}${deviationPercent}%`;
            }}
            maxDeviation={maxDeviation}
            data={inconvenienceByWorker.map((worker) => ({
              group: worker.workerPk,
              deviation: worker.totalInconvenience - expectedInconvenience,
            }))}
            color={(data) => {
              const deviation = Math.abs(data.deviation);

              const ratio = deviation / maxDeviation;
              // Use teal color scale from light to dark based on ratio
              const tealBase = 180; // Teal hue
              const lightness = 80 - ratio * 40; // Vary from 80% to 30% lightness
              return `hsl(${tealBase}, 50%, ${lightness}%)`;
            }}
            tickLabel={(data) => {
              const worker = workerById[data];
              if (!worker) {
                return "";
              }
              return getInitials(worker.name);
            }}
            axisBottomLabel={i18n.t("Inconvenience:Deviation from Expected")}
            ariaLabel="Worker inconvenience deviation chart"
          />
        </div>
      </div>
    );
  });
