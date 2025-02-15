import { RuleName } from "./rules/types";
import { ShiftSchedule, SlotShift, WorkSlots, SlotWorker } from "./types";
import { calculateMinimumRestMinutesAfterShift } from "./utils/calculateMinimumRestMinutesAfterShift";
import { calculateSlotInconvenience } from "./utils/calculateSlotInconvenience";
import { decreasingRandomLinearWeights } from "./utils/decreasingRandomLinearWeights";
import { selectUniqueRandomWeighted } from "./utils/selectUniqueRandomWeighted";
import { isWorkerAvailableToWork } from "./utils/isWorkerAvailableToWork";
import { getDefined } from "@/utils";

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
}

export const randomSchedule = ({
  startDay,
  endDay,
  slots,
  workers,
  respectLeaveSchedule,
  minimumRestSlotsAfterShift,
}: ScheduleOptions): ShiftSchedule => {
  const busy = new Map<SlotWorker, Array<[number, number]>>();

  const pastWorkLoad = new Map<SlotWorker, number>();

  const sortByPastWorkLoad = (a: SlotWorker, b: SlotWorker) =>
    (pastWorkLoad.get(a) ?? 0) - (pastWorkLoad.get(b) ?? 0);

  return {
    startDay,
    endDay,
    shifts: slots.map((slot): SlotShift => {
      const availableSortedWorkers = workers
        .filter((w) =>
          slot.requiredQualifications.every((q) => w.qualifications.includes(q))
        )
        .filter((w) =>
          isWorkerAvailableToWork(
            w,
            slot.workHours,
            busy.get(w) ?? [],
            respectLeaveSchedule
          )
        )
        .sort(sortByPastWorkLoad);

      if (!slot.assignedWorkerPk && availableSortedWorkers.length < 1) {
        throw new Error("Not enough workers available");
      }

      const worker: SlotWorker = slot.assignedWorkerPk
        ? getDefined(
            workers.find((w) => w.pk === slot.assignedWorkerPk),
            `Worker ${slot.assignedWorkerPk} not found`
          )
        : getDefined(
            selectUniqueRandomWeighted(
              availableSortedWorkers,
              decreasingRandomLinearWeights(availableSortedWorkers.length),
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
