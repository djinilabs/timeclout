import { useMemo } from "react";
import { type ShiftPositionWithRowSpan } from "./useTeamShiftPositionsMap";
import { type LeaveRenderInfo } from "./useTeamLeaveSchedule";

export type AnalyzedShiftPosition = ShiftPositionWithRowSpan & {
  hasLeaveConflict?: boolean;
  hasIssueWithMaximumIntervalBetweenShiftsRule?: boolean;
};

export interface AnalyzeTeamShiftsCalendarProps {
  analyzeLeaveConflicts: boolean;
  shiftPositionsMap: Record<string, ShiftPositionWithRowSpan[]>;
  leaveSchedule: Record<string, LeaveRenderInfo[]>;
  requireMaximumIntervalBetweenShifts: boolean;
  maximumIntervalBetweenShiftsInDays: number;
}

export interface AnalyzeTeamShiftsCalendarReturn {
  analyzedShiftPositionsMap: Record<string, AnalyzedShiftPosition[]>;
}

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

export const useAnalyzeTeamShiftsCalendar = (
  props: AnalyzeTeamShiftsCalendarProps
): AnalyzeTeamShiftsCalendarReturn => {
  const {
    analyzeLeaveConflicts,
    shiftPositionsMap: originalShiftPositionsMap,
    requireMaximumIntervalBetweenShifts,
  } = props;

  let shiftPositionsMap = originalShiftPositionsMap;

  shiftPositionsMap = useMemo(() => {
    if (analyzeLeaveConflicts) {
      return doAnalyzeLeaveConflicts(props);
    }
    return originalShiftPositionsMap;
  }, [analyzeLeaveConflicts, originalShiftPositionsMap, props]);

  shiftPositionsMap = useMemo(() => {
    if (requireMaximumIntervalBetweenShifts) {
      return doAnalyzeMaximumIntervalBetweenShifts({
        ...props,
        shiftPositionsMap,
      });
    }
    return shiftPositionsMap;
  }, [requireMaximumIntervalBetweenShifts, shiftPositionsMap, props]);

  return {
    analyzedShiftPositionsMap: shiftPositionsMap,
  };
};
