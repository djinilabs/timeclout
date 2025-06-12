import { useMemo } from "react";
import {
  calculateWorkerSlotProximities,
  calculateWorkerSlotMinutes,
  calculateWorkerInconveniences,
  type ShiftSchedule,
  type SlotShift,
  type Slot,
  type SlotWorker,
} from "@/scheduler";

import { type ShiftPositionWithRowSpan } from "./useTeamShiftPositionsMap";
import { type LeaveRenderInfo } from "./useTeamLeaveSchedule";
import { DayDate } from "@/day-date";

export type AnalyzedShiftPosition = ShiftPositionWithRowSpan & {
  hasLeaveConflict?: boolean;
  hasIssueWithMaximumIntervalBetweenShiftsRule?: boolean;
  hasIssueWithMinimumNumberOfShiftsPerWeekInStandardWorkday?: boolean;
  hasIssueWithMinimumRestSlotsAfterShiftRule?: boolean;
  workerInconvenienceEqualityDeviation?: number;
  workerSlotEqualityDeviation?: number;
  workerSlotProximityDeviation?: number;
};

export interface AnalyzeTeamShiftsCalendarProps {
  teamPk: string;
  startDate: DayDate;
  endDate: DayDate;
  analyzeLeaveConflicts: boolean;
  shiftPositionsMap: Record<string, ShiftPositionWithRowSpan[]>;
  leaveSchedule: Record<string, LeaveRenderInfo[]>;
  requireMaximumIntervalBetweenShifts: boolean;
  maximumIntervalBetweenShiftsInDays: number;
  requireMinimumNumberOfShiftsPerWeekInStandardWorkday: boolean;
  minimumNumberOfShiftsPerWeekInStandardWorkday: number;
  requireMinimumRestSlotsAfterShift: boolean;
  minimumRestSlotsAfterShift: {
    inconvenienceLessOrEqualThan: number;
    minimumRestMinutes: number;
  }[];
  analyzeWorkerInconvenienceEquality: boolean;
  analyzeWorkerSlotEquality: boolean;
  analyzeWorkerSlotProximity: boolean;
}

export interface AnalyzeTeamShiftsCalendarReturn {
  analyzedShiftPositionsMap: Record<string, AnalyzedShiftPosition[]>;
}

// --------- Rules ---------

// -- Analyze Leave Conflicts --

const doAnalyzeLeaveConflicts = ({
  shiftPositionsMap: originalShiftPositionsMap,
  leaveSchedule,
}: AnalyzeTeamShiftsCalendarProps) => {
  return Object.fromEntries(
    Object.entries(originalShiftPositionsMap).map(([day, shiftPositions]) => {
      const analyzedShiftPositions = shiftPositions.map(
        (shiftPosition): AnalyzedShiftPosition => {
          const analyzedShiftPosition: AnalyzedShiftPosition = {
            ...shiftPosition,
          };

          // Check if there are any leaves for this day
          const dayLeaves = leaveSchedule[day] || [];

          // If the shift position is assigned to someone, check if they have a leave
          if (shiftPosition.assignedTo) {
            const hasLeaveConflict = dayLeaves.some(
              (leave) => leave.user.pk === shiftPosition.assignedTo?.pk
            );

            if (hasLeaveConflict) {
              analyzedShiftPosition.hasLeaveConflict = true;
            }
          }

          return analyzedShiftPosition;
        }
      );
      return [day, analyzedShiftPositions];
    })
  );
};

// -- Analyze Maximum Interval Between Shifts --

const doAnalyzeMaximumIntervalBetweenShifts = ({
  shiftPositionsMap: originalShiftPositionsMap,
  maximumIntervalBetweenShiftsInDays,
}: AnalyzeTeamShiftsCalendarProps) => {
  // Get all days sorted chronologically
  const days = Object.keys(originalShiftPositionsMap).sort();

  // Create a map to track the last shift for each worker
  const lastShiftByWorker = new Map<
    string,
    { day: string; shiftPosition: ShiftPositionWithRowSpan }
  >();

  return Object.fromEntries(
    days.map((day) => {
      const shiftPositions = originalShiftPositionsMap[day];

      const analyzedShiftPositions = shiftPositions.map(
        (shiftPosition): AnalyzedShiftPosition => {
          const analyzedShiftPosition: AnalyzedShiftPosition = {
            ...shiftPosition,
          };

          if (shiftPosition.assignedTo) {
            const workerPk = shiftPosition.assignedTo.pk;
            const lastShift = lastShiftByWorker.get(workerPk);

            if (lastShift) {
              // Get the end time of the last shift (last schedule's end time)
              const lastShiftEndTime =
                lastShift.shiftPosition.schedules[
                  lastShift.shiftPosition.schedules.length - 1
                ].endHourMinutes;
              const lastShiftEndDate = new Date(lastShift.day);
              lastShiftEndDate.setHours(
                lastShiftEndTime[0],
                lastShiftEndTime[1]
              );

              // Get the start time of the current shift (first schedule's start time)
              const currentShiftStartTime =
                shiftPosition.schedules[0].startHourMinutes;
              const currentShiftStartDate = new Date(day);
              currentShiftStartDate.setHours(
                currentShiftStartTime[0],
                currentShiftStartTime[1]
              );

              // Calculate the interval between shifts in days
              const intervalDays =
                (currentShiftStartDate.getTime() - lastShiftEndDate.getTime()) /
                (1000 * 60 * 60 * 24);

              // If the interval exceeds the maximum allowed, mark both shifts
              if (intervalDays > maximumIntervalBetweenShiftsInDays) {
                analyzedShiftPosition.hasIssueWithMaximumIntervalBetweenShiftsRule =
                  true;
              }
            }

            // Update the last shift for this worker
            lastShiftByWorker.set(workerPk, { day, shiftPosition });
          }

          return analyzedShiftPosition;
        }
      );

      return [day, analyzedShiftPositions];
    })
  );
};

const doAnalyzeMinimumNumberOfShiftsPerWeekInStandardWorkday = ({
  shiftPositionsMap: originalShiftPositionsMap,
  minimumNumberOfShiftsPerWeekInStandardWorkday,
}: AnalyzeTeamShiftsCalendarProps) => {
  // Get all days sorted chronologically
  const days = Object.keys(originalShiftPositionsMap).sort();

  // Create a map to track shifts per week for each worker
  const shiftsPerWeekByWorker = new Map<
    string,
    Map<string, { day: string; shiftPosition: ShiftPositionWithRowSpan }[]>
  >();

  // First pass: group shifts by week and worker
  days.forEach((day) => {
    const shiftPositions = originalShiftPositionsMap[day];
    const date = new Date(day);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    const weekKey = weekStart.toISOString().split("T")[0];

    shiftPositions.forEach((shiftPosition) => {
      if (shiftPosition.assignedTo) {
        const workerPk = shiftPosition.assignedTo.pk;
        if (!shiftsPerWeekByWorker.has(workerPk)) {
          shiftsPerWeekByWorker.set(workerPk, new Map());
        }
        const workerWeeks = shiftsPerWeekByWorker.get(workerPk)!;
        if (!workerWeeks.has(weekKey)) {
          workerWeeks.set(weekKey, []);
        }
        workerWeeks.get(weekKey)!.push({ day, shiftPosition });
      }
    });
  });

  // Second pass: analyze and mark shifts that don't meet the minimum requirement
  return Object.fromEntries(
    days.map((day) => {
      const shiftPositions = originalShiftPositionsMap[day];
      const date = new Date(day);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split("T")[0];

      const analyzedShiftPositions = shiftPositions.map(
        (shiftPosition): AnalyzedShiftPosition => {
          const analyzedShiftPosition: AnalyzedShiftPosition = {
            ...shiftPosition,
          };

          if (shiftPosition.assignedTo) {
            const workerPk = shiftPosition.assignedTo.pk;
            const workerWeeks = shiftsPerWeekByWorker.get(workerPk);
            if (workerWeeks) {
              const weekShifts = workerWeeks.get(weekKey);
              if (weekShifts) {
                // Count only standard workday shifts (Monday to Friday)
                const standardWorkdayShifts = weekShifts.filter(({ day }) => {
                  const shiftDate = new Date(day);
                  const dayOfWeek = shiftDate.getDay();
                  return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
                });

                if (
                  standardWorkdayShifts.length <
                  minimumNumberOfShiftsPerWeekInStandardWorkday
                ) {
                  analyzedShiftPosition.hasIssueWithMinimumNumberOfShiftsPerWeekInStandardWorkday =
                    true;
                }
              }
            }
          }

          return analyzedShiftPosition;
        }
      );

      return [day, analyzedShiftPositions];
    })
  );
};

const doAnalyzeMinimumRestSlotsAfterShift = ({
  shiftPositionsMap: originalShiftPositionsMap,
  minimumRestSlotsAfterShift,
}: AnalyzeTeamShiftsCalendarProps) => {
  // Get all days sorted chronologically
  const days = Object.keys(originalShiftPositionsMap).sort();

  // Create a map to track the last shift for each worker
  const lastShiftByWorker = new Map<
    string,
    { day: string; shiftPosition: ShiftPositionWithRowSpan }
  >();

  return Object.fromEntries(
    days.map((day) => {
      const shiftPositions = originalShiftPositionsMap[day];

      const analyzedShiftPositions = shiftPositions.map(
        (shiftPosition): AnalyzedShiftPosition => {
          const analyzedShiftPosition: AnalyzedShiftPosition = {
            ...shiftPosition,
          };

          if (shiftPosition.assignedTo) {
            const workerPk = shiftPosition.assignedTo.pk;
            const lastShift = lastShiftByWorker.get(workerPk);

            if (lastShift) {
              // Get the end time of the last shift (last schedule's end time)
              const lastShiftEndTime =
                lastShift.shiftPosition.schedules[
                  lastShift.shiftPosition.schedules.length - 1
                ].endHourMinutes;
              const lastShiftEndDate = new Date(lastShift.day);
              lastShiftEndDate.setHours(
                lastShiftEndTime[0],
                lastShiftEndTime[1]
              );

              // Get the start time of the current shift (first schedule's start time)
              const currentShiftStartTime =
                shiftPosition.schedules[0].startHourMinutes;
              const currentShiftStartDate = new Date(day);
              currentShiftStartDate.setHours(
                currentShiftStartTime[0],
                currentShiftStartTime[1]
              );

              // Calculate the rest time in minutes
              const restMinutes =
                (currentShiftStartDate.getTime() - lastShiftEndDate.getTime()) /
                (1000 * 60);

              // Calculate the total inconvenience score of the last shift
              // by summing up the inconvenience scores of all schedules
              const lastShiftInconvenienceScore =
                lastShift.shiftPosition.schedules.reduce((total, schedule) => {
                  const durationInHours =
                    schedule.endHourMinutes[0] +
                    schedule.endHourMinutes[1] / 60 -
                    (schedule.startHourMinutes[0] +
                      schedule.startHourMinutes[1] / 60);
                  return (
                    total + schedule.inconveniencePerHour * durationInHours
                  );
                }, 0);

              // Find the applicable rule based on inconvenience score
              const applicableRule = minimumRestSlotsAfterShift.find(
                (rule) =>
                  lastShiftInconvenienceScore <=
                  rule.inconvenienceLessOrEqualThan
              );

              if (
                applicableRule &&
                restMinutes < applicableRule.minimumRestMinutes
              ) {
                analyzedShiftPosition.hasIssueWithMinimumRestSlotsAfterShiftRule =
                  true;
              }
            }

            // Update the last shift for this worker
            lastShiftByWorker.set(workerPk, { day, shiftPosition });
          }

          return analyzedShiftPosition;
        }
      );

      return [day, analyzedShiftPositions];
    })
  );
};

// --------- Heuristics ---------

const normalizeValues = <T>(values: [T, number][]): [T, number][] => {
  // first, calculate the average
  const average =
    values.reduce((acc, [, value]) => acc + value, 0) / values.length;
  // then, calculate the standard deviation
  const standardDeviation = Math.sqrt(
    values.reduce((acc, [, value]) => acc + Math.pow(value - average, 2), 0) /
      values.length
  );
  // normalize the values
  return values.map(([key, value]) => [
    key,
    (value - average) / standardDeviation,
  ]);
};

const doAnalyzeHeuristics = ({
  shiftPositionsMap,
  analyzeWorkerInconvenienceEquality,
  analyzeWorkerSlotEquality,
  analyzeWorkerSlotProximity,
}: AnalyzeTeamShiftsCalendarProps) => {
  if (
    !analyzeWorkerInconvenienceEquality &&
    !analyzeWorkerSlotEquality &&
    !analyzeWorkerSlotProximity
  ) {
    return shiftPositionsMap;
  }

  // Get all days sorted chronologically
  const days = Object.keys(shiftPositionsMap).sort();

  // Convert shiftPositionsMap to a ShiftSchedule format
  const schedule: ShiftSchedule = {
    startDay: days[0],
    endDay: days[days.length - 1],
    shifts: days.flatMap((day) =>
      shiftPositionsMap[day]
        .filter((position) => position.assignedTo) // Only include shifts with assigned workers
        .map((position) => {
          const slot: Slot = {
            id: position.pk + "//" + position.sk,
            workHours: position.schedules.map((schedule) => ({
              start:
                schedule.startHourMinutes[0] * 60 +
                schedule.startHourMinutes[1],
              end: schedule.endHourMinutes[0] * 60 + schedule.endHourMinutes[1],
              inconvenienceMultiplier: schedule.inconveniencePerHour,
            })),
            startsOnDay: day,
            requiredQualifications: position.requiredSkills,
            typeName: "regular",
          };

          const worker: SlotWorker = {
            pk: position.assignedTo!.pk,
            name: position.assignedTo!.name || "",
            email: position.assignedTo!.email || "",
            emailMd5: position.assignedTo!.emailMd5 || "",
            qualifications: [], // We don't have access to qualifications in the User type
            approvedLeaves: [], // We don't have access to approvedLeaves in the User type
          };

          const slotShift: SlotShift = {
            slot,
            assigned: worker,
          };

          return slotShift;
        })
    ),
  };

  const workerProximitiesMap = new Map<string, Map<string, number>>();
  if (analyzeWorkerSlotProximity) {
    // Process worker slot proximities
    const workerSlotProximities = calculateWorkerSlotProximities(schedule);
    normalizeValues(Array.from(workerSlotProximities.entries())).forEach(
      ([key, value]) => {
        const [workerPk, slotPk, slotSk] = key.split("//");
        if (!workerProximitiesMap.has(workerPk)) {
          workerProximitiesMap.set(workerPk, new Map());
        }
        workerProximitiesMap.get(workerPk)!.set(slotPk + "//" + slotSk, value);
      }
    );
  }

  const workerSlotMinutesMap = new Map<string, number>();
  if (analyzeWorkerSlotEquality) {
    // Process worker slot minutes
    const workerSlotMinutes = calculateWorkerSlotMinutes(schedule);
    normalizeValues(Array.from(workerSlotMinutes.entries())).forEach(
      ([workerPk, value]) => {
        workerSlotMinutesMap.set(workerPk, value);
      }
    );
  }

  const workerInconvenienceMap = new Map<string, number>();
  if (analyzeWorkerInconvenienceEquality) {
    const workerInconveniences = calculateWorkerInconveniences(schedule);

    // Process worker inconveniences
    normalizeValues(Array.from(workerInconveniences.entries())).forEach(
      ([workerPk, value]) => {
        workerInconvenienceMap.set(workerPk, value);
      }
    );
  }

  return Object.fromEntries(
    days.map((day) => {
      const shiftPositions = shiftPositionsMap[day];

      const analyzedShiftPositions = shiftPositions.map(
        (shiftPosition): AnalyzedShiftPosition => {
          const analyzedShiftPosition: AnalyzedShiftPosition = {
            ...shiftPosition,
          };

          if (shiftPosition.assignedTo) {
            const workerPk = shiftPosition.assignedTo.pk;

            // O(1) lookups using the pre-processed Maps
            const proximityDeviations = workerProximitiesMap.get(workerPk);
            if (proximityDeviations !== undefined) {
              const proximityDeviation =
                proximityDeviations.get(
                  shiftPosition.pk + "//" + shiftPosition.sk
                ) ?? undefined;
              analyzedShiftPosition.workerSlotProximityDeviation =
                proximityDeviation;
            }

            const slotEqualityDeviation = workerSlotMinutesMap.get(workerPk);
            if (slotEqualityDeviation !== undefined) {
              analyzedShiftPosition.workerSlotEqualityDeviation =
                slotEqualityDeviation;
            }

            const inconvenienceEqualityDeviation =
              workerInconvenienceMap.get(workerPk);
            if (inconvenienceEqualityDeviation !== undefined) {
              analyzedShiftPosition.workerInconvenienceEqualityDeviation =
                inconvenienceEqualityDeviation;
            }
          }

          return analyzedShiftPosition;
        }
      );

      return [day, analyzedShiftPositions];
    })
  );
};

const doAnalyzeRules = (props: AnalyzeTeamShiftsCalendarProps) => {
  let { shiftPositionsMap } = props;

  if (props.analyzeLeaveConflicts) {
    shiftPositionsMap = doAnalyzeLeaveConflicts(props);
  }

  if (props.requireMaximumIntervalBetweenShifts) {
    shiftPositionsMap = doAnalyzeMaximumIntervalBetweenShifts({
      ...props,
      shiftPositionsMap,
    });
  }

  if (props.requireMinimumNumberOfShiftsPerWeekInStandardWorkday) {
    shiftPositionsMap = doAnalyzeMinimumNumberOfShiftsPerWeekInStandardWorkday({
      ...props,
      shiftPositionsMap,
    });
  }

  if (props.requireMinimumRestSlotsAfterShift) {
    shiftPositionsMap = doAnalyzeMinimumRestSlotsAfterShift({
      ...props,
      shiftPositionsMap,
    });
  }

  return shiftPositionsMap;
};

export const useAnalyzeTeamShiftsCalendar = (
  props: AnalyzeTeamShiftsCalendarProps
): AnalyzeTeamShiftsCalendarReturn => {
  // ------- Rules -------
  let analyzedShiftPositionsMap = useMemo(() => {
    return doAnalyzeRules(props);
  }, [props]);

  // ------- Heuristics -------
  analyzedShiftPositionsMap = useMemo(
    () =>
      doAnalyzeHeuristics({
        ...props,
        shiftPositionsMap: analyzedShiftPositionsMap,
      }),
    [analyzedShiftPositionsMap, props]
  );

  return {
    analyzedShiftPositionsMap,
  };
};
