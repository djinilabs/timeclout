import { SlotWorker, ValidationRule } from "../types";
import { calculateSlotInconvenience } from "../utils/calculateSlotInconvenience";

import { i18n } from "@/locales";

export const maximumInconvenience: ValidationRule = {
  id: "maximumInconvenience",
  name: (ruleOptions) => {
    if (typeof ruleOptions !== "number") {
      throw new TypeError(i18n._("maximumInconvenience must be a number"));
    }
    return `Maximum Inconvenience of ${ruleOptions}`;
  },
  function: (schedule, _workers, maximumInconvenience) => {
    if (typeof maximumInconvenience !== "number") {
      throw new TypeError(i18n._("maximumInconvenience must be a number"));
    }
    const workerInconveniences: Map<SlotWorker, number> = new Map();

    for (const shift of schedule.shifts) {
      const currentInconvenience =
        workerInconveniences.get(shift.assigned) ?? 0;
      const newInconvenience =
        currentInconvenience + calculateSlotInconvenience(shift.slot);
      if (newInconvenience > maximumInconvenience) {
        return [false, shift.slot.id];
      }
      workerInconveniences.set(shift.assigned, newInconvenience);
    }
    return [true];
  },
};
