import type { ShiftSchedule, SlotWorker, ValidationRule } from "../types";
import { maximumInconvenience } from "./maximumInconvenience";
import { minimumExperiencedWorker } from "./minimumExperiencedWorker";
import { minimumFrequency } from "./minimumFrequency";
import { minimumShiftsInStandardWorkday } from "./minimumShiftsInStandardWorkday";
import { RuleName } from "./types";

const rules: ValidationRule[] = [
  minimumFrequency,
  minimumExperiencedWorker,
  maximumInconvenience,
  minimumShiftsInStandardWorkday,
];

export const isScheduleValid = (
  schedule: ShiftSchedule,
  workers: SlotWorker[],
  ruleOptions: Partial<Record<RuleName, unknown>>
): [valid: true] | [valid: false, reason: string] => {
  for (const rule of rules) {
    if (!rule(schedule, workers, ruleOptions[rule.name as RuleName])) {
      return [false, rule.name];
    }
  }
  return [true];
};
