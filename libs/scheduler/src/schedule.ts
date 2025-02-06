import { RuleName } from "./rules/types";
import { ShiftSchedule, SlotShift, WorkSlots, SlotWorker } from "./types";
import { calculateMinimumRestSlotsAfterShift } from "./utils/calculateMinimumRestSlotsAfterShift";
import { calculateSlotInconvenience } from "./utils/calculateSlotInconvenience";
import { decreasingRandomLinearWeights } from "./utils/decreasingRandomLinearWeights";
import { selectUniqueRandomWeighted } from "./utils/selectUniqueRandomWeighted";
import { isWorkerAvailableToWork } from "./utils/isWorkerAvailableToWork";
import { getDefined } from "@/utils";

export interface ScheduleOptions {
  slots: WorkSlots;
  workers: SlotWorker[];
  minimumRestSlotsAfterShift: {
    inconvenienceLessOrEqualThan: number;
    minimumRestSlots: number;
  }[];
  rules: Partial<Record<RuleName, unknown>>;
}

export const randomSchedule = ({
  slots,
  workers,
  minimumRestSlotsAfterShift,
}: ScheduleOptions): ShiftSchedule => {
  const resting = new Map<SlotWorker, number>();

  const nextShift = () => {
    for (const [worker, rest] of resting.entries()) {
      if (rest === 0) {
        resting.delete(worker);
      } else {
        resting.set(worker, rest - 1);
      }
    }
  };

  const pastWorkLoad = new Map<SlotWorker, number>();

  const sortByPastWorkLoad = (a: SlotWorker, b: SlotWorker) =>
    (pastWorkLoad.get(a) ?? 0) - (pastWorkLoad.get(b) ?? 0);

  return {
    shifts: slots.map((slot): SlotShift => {
      nextShift();

      const availableSortedWorkers = workers
        .filter(
          (w) => isWorkerAvailableToWork(w, slot.workHours) && !resting.has(w)
        )
        .sort(sortByPastWorkLoad);

      if (availableSortedWorkers.length < 1) {
        throw new Error("Not enough workers available");
      }

      const worker: SlotWorker = getDefined(
        selectUniqueRandomWeighted(
          availableSortedWorkers,
          decreasingRandomLinearWeights(availableSortedWorkers.length),
          1
        )[0]
      );

      const slotInconvenience = calculateSlotInconvenience(slot);
      const thisSlotMinimumRestSlotsAfterShift =
        calculateMinimumRestSlotsAfterShift(
          slotInconvenience,
          minimumRestSlotsAfterShift
        );
      if (thisSlotMinimumRestSlotsAfterShift > 0) {
        resting.set(worker, thisSlotMinimumRestSlotsAfterShift);
      }
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
