import type { ShiftSchedule, SlotWorker, ValidationRule } from "../types";
import { getUniqueWorkers } from "../utils/getUniqueWorkers";

import { maximumInconvenience } from "./maximumInconvenience";
import { minimumFrequency } from "./minimumFrequency";
import { minimumShiftsInStandardWorkdayPerWeek } from "./minimumShiftsInStandardWorkdayPerWeek";
import { RuleName } from "./types";

import { i18n } from "@/locales";

export * from "./types";

const rules: ValidationRule[] = [
  minimumFrequency,
  maximumInconvenience,
  minimumShiftsInStandardWorkdayPerWeek,
];

export const isScheduleValid = (
  schedule: ShiftSchedule,
  _workers: SlotWorker[],
  ruleOptions: Partial<Record<RuleName, unknown>>
): [valid: true] | [valid: false, reason: string, problemInSlotId?: string] => {
  const workers = [...getUniqueWorkers(schedule)];
  for (const [ruleName, ruleValue] of Object.entries(ruleOptions)) {
    const rule = rules.find((rule) => rule.id === ruleName);
    if (!rule) {
      throw new Error(i18n._("Rule {ruleName} not found", { ruleName }));
    }
    const [valid, problemInSlotId] = rule.function(
      schedule,
      workers,
      ruleValue
    );
    if (!valid) {
      return [false, rule.name(ruleValue), problemInSlotId];
    }
  }
  return [true];
};
