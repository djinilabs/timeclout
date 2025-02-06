import type { ShiftSchedule, SlotWorker, ValidationRule } from "../types";
import { maximumInconvenience } from "./maximumInconvenience";
import { minimumFrequency } from "./minimumFrequency";
import { minimumShiftsInStandardWorkday } from "./minimumShiftsInStandardWorkday";
import { RuleName } from "./types";

const rules: ValidationRule[] = [
  minimumFrequency,
  maximumInconvenience,
  minimumShiftsInStandardWorkday,
];

export const isScheduleValid = (
  schedule: ShiftSchedule,
  workers: SlotWorker[],
  ruleOptions: Partial<Record<RuleName, unknown>>
): [valid: true] | [valid: false, reason: string] => {
  for (const [ruleName, ruleValue] of Object.entries(ruleOptions)) {
    const rule = rules.find((rule) => rule.name === ruleName);
    if (!rule) {
      throw new Error(`Rule ${ruleName} not found`);
    }
    if (!rule(schedule, workers, ruleValue)) {
      return [false, rule.name];
    }
  }
  return [true];
};
