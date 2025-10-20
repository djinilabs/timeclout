import type { RuleName } from "./rules/types";
import type { ShiftSchedule, SlotShift, SlotWorker, WorkSlots } from "./types";
import { calculateMinimumRestMinutesAfterShift } from "./utils/calculateMinimumRestMinutesAfterShift";
import { calculateSlotInconvenience } from "./utils/calculateSlotInconvenience";
import { decreasingRandomLinearWeights } from "./utils/decreasingRandomLinearWeights";
import { isWorkerAvailableToWork } from "./utils/isWorkerAvailableToWork";
import { selectUniqueRandomWeighted } from "./utils/selectUniqueRandomWeighted";

import { i18n } from "@/locales";
import { getDefined } from "@/utils";

import type { WorkSchedule } from "./scheduler";

export interface ScheduleOptions {
  startDay: string;
  endDay: string;
  slots: WorkSlots;
  workers: SlotWorker[];
  respectLeaveSchedule: boolean;
  minimumRestSlotsAfterShift: {
    inconvenienceLessOrEqualThan: number;
    minimumRestMinutes: number;
  }[];
  rules: Partial<Record<RuleName, unknown>>;
  workSchedule?: WorkSchedule;
}

export const randomSchedule = ({
  startDay,
  endDay,
  slots,
  workers,
  respectLeaveSchedule,
  minimumRestSlotsAfterShift,
  workSchedule,
}: ScheduleOptions): ShiftSchedule => {
  const busy = new Map<SlotWorker, Array<[number, number]>>();

  const pastWorkLoad = new Map<SlotWorker, number>();

  const sortByPastWorkLoad = (a: SlotWorker, b: SlotWorker) =>
    (pastWorkLoad.get(a) ?? 0) - (pastWorkLoad.get(b) ?? 0);

  return {
    startDay,
    endDay,
    shifts: slots.map((slot): SlotShift => {
      const workersWithAtLeastOneOfTheRequiredQualifications = workers.filter(
        (w) =>
          slot.requiredQualifications.length === 0 ||
          slot.requiredQualifications.some((q) => w.qualifications.includes(q))
      );
      const availableWorkers = workersWithAtLeastOneOfTheRequiredQualifications
        .filter((w) => {
          const [available] = isWorkerAvailableToWork(
            w,
            slot.workHours,
            busy.get(w) ?? [],
            respectLeaveSchedule,
            startDay
          );
          return available;
        })
        .sort(sortByPastWorkLoad);

      if (!slot.assignedWorkerPk && availableWorkers.length < 1) {
        throw new Error(
          i18n._(
            "Of {workersCount} workers, none is available to work on day {day} for shift {shiftType}. For this shift we had {qualifiedWorkersCount} workers with at least one of the required qualifications and {availableWorkersCount} available.",
            {
              workersCount: workers.length,
              day: slot.startsOnDay,
              shiftType: slot.typeName,
              qualifiedWorkersCount:
                workersWithAtLeastOneOfTheRequiredQualifications.length,
              availableWorkersCount: availableWorkers.length,
            }
          )
        );
      }

      const worker: SlotWorker = slot.assignedWorkerPk
        ? getDefined(
            workers.find((w) => w.pk === slot.assignedWorkerPk),
            i18n._("Worker {workerPk} not found", {
              workerPk: slot.assignedWorkerPk,
            })
          )
        : getDefined(
            selectUniqueRandomWeighted(
              availableWorkers,
              decreasingRandomLinearWeights(availableWorkers.length),
              1
            )[0]
          );

      const slotInconvenience = calculateSlotInconvenience(slot);
      const thisSlotMinimumRestMinutesAfterShift =
        calculateMinimumRestMinutesAfterShift(
          slotInconvenience,
          minimumRestSlotsAfterShift
        );
      const firstMinuteOfShift = slot.workHours[0].start;
      const lastMinuteOfShift = slot.workHours[slot.workHours.length - 1].end;
      const pastBusy = busy.get(worker) ?? [];
      pastBusy.push([firstMinuteOfShift, lastMinuteOfShift]);
      if (thisSlotMinimumRestMinutesAfterShift > 0) {
        pastBusy.push([
          lastMinuteOfShift,
          lastMinuteOfShift + thisSlotMinimumRestMinutesAfterShift,
        ]);
      }
      busy.set(worker, pastBusy);
      pastWorkLoad.set(
        worker,
        (pastWorkLoad.get(worker) ?? 0) + slotInconvenience
      );

      return {
        slot,
        assigned: worker,
      };
    }),
  };
};
