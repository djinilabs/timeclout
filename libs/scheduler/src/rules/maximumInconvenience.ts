import { getDefined } from "@/utils";
import { SlotWorker, ValidationRule } from "../types";
import { calculateSlotInconvenience } from "../utils/calculateSlotInconvenience";

export const maximumInconvenience: ValidationRule = (
  schedule,
  _workers,
  maximumInconvenience
) => {
  if (typeof maximumInconvenience !== "number") {
    return true;
  }
  const workerInconveniences: Map<SlotWorker, number> = new Map();

  for (const shift of schedule.shifts) {
    let index = 0;
    for (const worker of shift.assigned) {
      const currentInconvenience = workerInconveniences.get(worker) ?? 0;
      const newInconvenience =
        currentInconvenience +
        calculateSlotInconvenience(
          getDefined(
            shift.slot.members[index],
            `Slot member ${index} not found`
          )
        );
      if (newInconvenience > maximumInconvenience) {
        return false;
      }
      workerInconveniences.set(worker, newInconvenience);
      index++;
    }
  }
  return true;
};
