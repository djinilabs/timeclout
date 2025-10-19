import { ValidationRule } from "../types";

import { i18n } from "@/locales";

export interface FirstShiftAfterExtendedLeaveOptions {
  minimumContinuousDays: number;
  applicableLeaveTypes: string[];
}

const isLeaveContinuous = (
  leave1: { end: number },
  leave2: { start: number }
): boolean => {
  // Check if leave periods are continuous (within 24 hours)
  const timeDiff = leave2.start - leave1.end;
  return timeDiff >= 0 && timeDiff <= 24 * 60 * 60; // 24 hours in seconds
};

const getContinuousLeavePeriods = (
  leaves: Array<{ start: number; end: number; type: string }>,
  applicableTypes: string[]
): Array<{ start: number; end: number; types: string[] }> => {
  // Filter leaves by applicable types and sort by start time
  const applicableLeaves = leaves
    .filter((leave) => applicableTypes.includes(leave.type))
    .sort((a, b) => a.start - b.start);

  if (applicableLeaves.length === 0) {
    return [];
  }

  const periods: Array<{ start: number; end: number; types: string[] }> = [];
  let currentPeriod = {
    start: applicableLeaves[0].start,
    end: applicableLeaves[0].end,
    types: [applicableLeaves[0].type],
  };

  for (let i = 1; i < applicableLeaves.length; i++) {
    const currentLeave = applicableLeaves[i];

    if (isLeaveContinuous(currentPeriod, currentLeave)) {
      // Extend current period
      currentPeriod.end = Math.max(currentPeriod.end, currentLeave.end);
      if (!currentPeriod.types.includes(currentLeave.type)) {
        currentPeriod.types.push(currentLeave.type);
      }
    } else {
      // Start new period
      periods.push(currentPeriod);
      currentPeriod = {
        start: currentLeave.start,
        end: currentLeave.end,
        types: [currentLeave.type],
      };
    }
  }

  periods.push(currentPeriod);
  return periods;
};

const calculateLeaveDurationInDays = (
  startTime: number,
  endTime: number
): number => {
  // Calculate duration in calendar days (including weekends)
  const startDate = new Date(startTime * 1000);
  const endDate = new Date(endTime * 1000);

  // Set both dates to start of day for accurate day counting
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

export const firstShiftAfterExtendedLeave: ValidationRule = {
  id: "firstShiftAfterExtendedLeave",
  name: (ruleOptions) => {
    if (typeof ruleOptions !== "object" || ruleOptions === null) {
      throw new TypeError(
        i18n._("firstShiftAfterExtendedLeave must be an object")
      );
    }
    const options = ruleOptions as FirstShiftAfterExtendedLeaveOptions;
    if (
      typeof options.minimumContinuousDays !== "number" ||
      !Array.isArray(options.applicableLeaveTypes)
    ) {
      throw new TypeError(
        i18n._(
          "firstShiftAfterExtendedLeave must have minimumContinuousDays (number) and applicableLeaveTypes (array)"
        )
      );
    }
    return `First shift after extended leave (${
      options.minimumContinuousDays
    }+ days, types: ${options.applicableLeaveTypes.join(", ")})`;
  },
  function: (schedule, workers, ruleOptions) => {
    if (typeof ruleOptions !== "object" || ruleOptions === null) {
      throw new TypeError(
        i18n._("firstShiftAfterExtendedLeave must be an object")
      );
    }
    const options = ruleOptions as FirstShiftAfterExtendedLeaveOptions;
    if (
      typeof options.minimumContinuousDays !== "number" ||
      !Array.isArray(options.applicableLeaveTypes)
    ) {
      throw new TypeError(
        i18n._(
          "firstShiftAfterExtendedLeave must have minimumContinuousDays (number) and applicableLeaveTypes (array)"
        )
      );
    }

    // Sort shifts chronologically by start time
    const sortedShifts = [...schedule.shifts].sort(
      (a, b) => a.slot.workHours[0].start - b.slot.workHours[0].start
    );

    // Check each worker
    for (const worker of workers) {
      const workerLeavePeriods = getContinuousLeavePeriods(
        worker.approvedLeaves,
        options.applicableLeaveTypes
      );

      // Find qualifying leave periods (≥ minimumContinuousDays)
      const qualifyingPeriods = workerLeavePeriods.filter((period) => {
        const duration = calculateLeaveDurationInDays(period.start, period.end);
        return duration >= options.minimumContinuousDays;
      });

      // For each qualifying leave period, check if worker is assigned to first shift after
      for (const leavePeriod of qualifyingPeriods) {
        const leaveEndTime = leavePeriod.end;

        // Find the first shift after this leave period ends
        const firstShiftAfterLeave = sortedShifts.find(
          (shift) => shift.slot.workHours[0].start > leaveEndTime
        );

        if (firstShiftAfterLeave) {
          // Check if this worker is assigned to this first shift
          if (firstShiftAfterLeave.assigned !== worker) {
            return [false, firstShiftAfterLeave.slot.id];
          }
        }
      }
    }

    return [true];
  },
};
