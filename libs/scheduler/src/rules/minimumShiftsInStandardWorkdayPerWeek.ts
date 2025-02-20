import { DayDate } from "@/day-date";
import { SlotWorker, ValidationRule } from "../types";

export const minimumShiftsInStandardWorkdayPerWeek: ValidationRule = {
  id: "minimumShiftsInStandardWorkdayPerWeek",
  name: (ruleOptions) => {
    if (typeof ruleOptions !== "number") {
      throw new TypeError("minimumShiftsInStandardWorkday must be a number");
    }
    return `Minimum Shifts in Standard Workday Per Week of ${ruleOptions}`;
  },
  function: (schedule, workers, minimumStandardWorkDayShiftCount) => {
    if (
      minimumStandardWorkDayShiftCount == null ||
      typeof minimumStandardWorkDayShiftCount !== "number"
    ) {
      throw new TypeError("minimumShiftsInStandardWorkday must be a number");
    }
    const workersShiftDays = new Map<SlotWorker, DayDate[]>();
    for (const shift of schedule.shifts) {
      const worker = shift.assigned;
      let workerShiftDays = workersShiftDays.get(worker) ?? [];
      workerShiftDays.push(new DayDate(shift.slot.startsOnDay));
      workersShiftDays.set(worker, workerShiftDays);
    }

    let day = new DayDate(schedule.startDay);
    const endDay = new DayDate(schedule.endDay);
    let workersShiftCountOnCurrentWeek = new Map<SlotWorker, number>();
    while (day.getWeekDay() !== "monday") {
      day = day.nextDay();
    }
    while (day.isBefore(endDay)) {
      if (day.getWeekDayNumber() === 6) {
        // saturday we do the check
        for (const worker of workers) {
          const workerShiftCount =
            workersShiftCountOnCurrentWeek.get(worker) ?? 0;
          if (workerShiftCount < minimumStandardWorkDayShiftCount) {
            return [false];
          }
        }
      } else if (day.getWeekDayNumber() === 0) {
        // sunday we reset the count
        workersShiftCountOnCurrentWeek.clear();
      } else {
        // it's a week day, so we count the shifts
        for (const worker of workers) {
          const workerShiftDays = workersShiftDays.get(worker) ?? [];
          if (workerShiftDays.some((d) => d.isSameDay(day))) {
            workersShiftCountOnCurrentWeek.set(
              worker,
              (workersShiftCountOnCurrentWeek.get(worker) ?? 0) + 1
            );
          }
        }
      }
      day = day.nextDay();
    }

    return [true];
  },
};
