import { getDefined } from "@/utils";
import { RuleName } from "./rules/types";
import { ShiftSchedule, SlotShift, WorkSlots, SlotWorker } from "./types";
import { calculateMinimumRestSlotsAfterShift } from "./utils/calculateMinimumRestSlotsAfterShift";
import { calculateSlotInconvenience } from "./utils/calculateSlotInconvenience";
import { decreasingRandomLinearWeights } from "./utils/decreasingRandomLinearWeights";
import { selectUniqueRandomWeighted } from "./utils/selectUniqueRandomWeighted";

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
  rules,
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
    shifts: slots.map((slot, slotIndex): SlotShift => {
      nextShift();

      const availableSortedWorkers = workers
        .filter((w) => w.isAvailableToWork(slotIndex) && !resting.has(w))
        .sort(sortByPastWorkLoad);

      if (availableSortedWorkers.length < slot.members.length - 1) {
        throw new Error("Not enough workers available");
      }

      const assigned: SlotWorker[] = selectUniqueRandomWeighted(
        availableSortedWorkers,
        decreasingRandomLinearWeights(availableSortedWorkers.length),
        slot.members.length - 1
      );

      const missingExperiencedWorker =
        rules.minimumExperiencedWorker != null
          ? !assigned.some(
              (w) => w.experience >= Number(rules.minimumExperiencedWorker)
            )
          : false;

      let lastShiftAvailableSortedWorkers = availableSortedWorkers
        .filter((w) => !assigned.includes(w))
        .filter((w) =>
          missingExperiencedWorker
            ? w.experience >= Number(rules.minimumExperiencedWorker)
            : true
        );

      if (lastShiftAvailableSortedWorkers.length === 0) {
        throw new Error("No workers available");
      }

      const [lastShiftWorker] = selectUniqueRandomWeighted(
        lastShiftAvailableSortedWorkers,
        decreasingRandomLinearWeights(lastShiftAvailableSortedWorkers.length),
        1
      );

      assigned.push(getDefined(lastShiftWorker));

      let memberIndex = 0;
      for (const worker of assigned) {
        const slotInconvenience = calculateSlotInconvenience(
          getDefined(
            slot.members[memberIndex],
            `Slot member ${memberIndex} not found`
          )
        );
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
        memberIndex++;
      }

      return {
        slot,
        slotIndex,
        assigned,
      };
    }),
  };
};
