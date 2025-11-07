import type {
  ShiftScheduleHeuristic,
  ShiftSchedule,
  WorkSchedule,
} from "../types";

import { DayDate } from "@/day-date";

/**
 * Default work schedule that treats Monday-Friday as work days and Saturday-Sunday as non-work days
 */
const defaultWorkSchedule: WorkSchedule = {
  monday: { isWorkDay: true },
  tuesday: { isWorkDay: true },
  wednesday: { isWorkDay: true },
  thursday: { isWorkDay: true },
  friday: { isWorkDay: true },
  saturday: { isWorkDay: false },
  sunday: { isWorkDay: false },
};

/**
 * Maps DayDate week day numbers to work schedule keys
 */
const weekDayToScheduleKey: Record<number, keyof WorkSchedule> = {
  0: "monday",
  1: "tuesday",
  2: "wednesday",
  3: "thursday",
  4: "friday",
  5: "saturday",
  6: "sunday",
};

/**
 * Checks if a given day is a work day according to the work schedule
 */
const isWorkDay = (day: DayDate, workSchedule?: WorkSchedule): boolean => {
  const schedule = workSchedule || defaultWorkSchedule;
  const weekDayNumber = day.getWeekDayNumber();
  const scheduleKey = weekDayToScheduleKey[weekDayNumber];
  return schedule[scheduleKey].isWorkDay;
};

/**
 * Groups shifts by worker and week, then finds the first shift of each week for each worker
 */
const getFirstShiftsByWorkerAndWeek = (
  schedule: ShiftSchedule
): Map<string, Map<number, DayDate>> => {
  const firstShiftsByWorkerAndWeek = new Map<string, Map<number, DayDate>>();

  for (const shift of schedule.shifts) {
    const workerPk = shift.assigned.pk;
    const shiftDay = new DayDate(shift.slot.startsOnDay);
    const weekNumber = shiftDay.getWeekNumber();

    if (!firstShiftsByWorkerAndWeek.has(workerPk)) {
      firstShiftsByWorkerAndWeek.set(workerPk, new Map<number, DayDate>());
    }

    const workerWeeks = firstShiftsByWorkerAndWeek.get(workerPk)!;

    // If this is the first shift for this worker in this week, or if it's earlier than the current first shift
    if (
      !workerWeeks.has(weekNumber) ||
      shiftDay.isBefore(workerWeeks.get(weekNumber)!)
    ) {
      workerWeeks.set(weekNumber, shiftDay);
    }
  }

  return firstShiftsByWorkerAndWeek;
};

/**
 * Calculates the expected number of non-work day first shifts based on random assignment
 */
const calculateExpectedNonWorkDayFirstShifts = (
  schedule: ShiftSchedule,
  workSchedule?: WorkSchedule
): number => {
  const workScheduleConfig = workSchedule || defaultWorkSchedule;

  // Count non-work days per week
  const nonWorkDaysPerWeek = Object.values(workScheduleConfig).filter(
    (day) => !day.isWorkDay
  ).length;

  // Calculate probability that a randomly assigned first shift falls on a non-work day
  const totalDaysPerWeek = 7;
  const probabilityOfNonWorkDayFirstShift =
    nonWorkDaysPerWeek / totalDaysPerWeek;

  // Get the actual first shifts by worker and week
  const firstShiftsByWorkerAndWeek = getFirstShiftsByWorkerAndWeek(schedule);

  // Count total first shifts (one per worker per week they work)
  let totalFirstShifts = 0;
  for (const [, weeks] of firstShiftsByWorkerAndWeek) {
    totalFirstShifts += weeks.size;
  }

  // Expected number of non-work day first shifts = total first shifts * probability
  return totalFirstShifts * probabilityOfNonWorkDayFirstShift;
};

/**
 * Calculates the actual number of non-work day first shifts in the schedule
 */
const calculateActualNonWorkDayFirstShifts = (
  schedule: ShiftSchedule,
  workSchedule?: WorkSchedule
): number => {
  const firstShiftsByWorkerAndWeek = getFirstShiftsByWorkerAndWeek(schedule);
  let actualViolations = 0;

  for (const [, weeks] of firstShiftsByWorkerAndWeek) {
    for (const [, firstShiftDay] of weeks) {
      if (!isWorkDay(firstShiftDay, workSchedule)) {
        actualViolations++;
      }
    }
  }

  return actualViolations;
};

/**
 * Calculates the standard deviation from expected non-work day first shifts
 */
export const calculateAvoidNonWorkDayFirstShiftDeviation = (
  schedule: ShiftSchedule,
  workSchedule?: WorkSchedule
): number => {
  const expected = calculateExpectedNonWorkDayFirstShifts(
    schedule,
    workSchedule
  );
  const actual = calculateActualNonWorkDayFirstShifts(schedule, workSchedule);

  // Calculate the deviation from expected value
  // We only penalize when actual > expected (more violations than expected)
  // When actual < expected (fewer violations), that's good, so deviation = 0
  const deviation = Math.max(0, actual - expected);

  // Normalize by expected value to get relative deviation
  // If expected is 0, return the absolute deviation
  return expected > 0 ? deviation / expected : deviation;
};

/**
 * Creates a heuristic that penalizes schedules where workers' first shift of the week occurs on non-work days
 */
export const createAvoidNonWorkDayFirstShiftHeuristic = (
  workSchedule?: WorkSchedule
): ShiftScheduleHeuristic => ({
  name: "Avoid Non-Work Day First Shift",
  eval: (schedule) =>
    calculateAvoidNonWorkDayFirstShiftDeviation(schedule, workSchedule),
});

/**
 * Default heuristic instance (uses default work schedule)
 */
export const avoidNonWorkDayFirstShiftHeuristic: ShiftScheduleHeuristic = {
  name: "Avoid Non-Work Day First Shift",
  eval: (schedule) => calculateAvoidNonWorkDayFirstShiftDeviation(schedule),
};
