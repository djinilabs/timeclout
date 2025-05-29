import { useMemo } from "react";
import { type ShiftPositionWithRowSpan } from "./useTeamShiftPositionsMap";
import { type LeaveRenderInfo } from "./useTeamLeaveSchedule";

export type AnalyzedShiftPosition = ShiftPositionWithRowSpan & {
  hasLeaveConflict?: boolean;
};

export interface AnalyzeTeamShiftsCalendarProps {
  analyzeLeaveConflicts: boolean;
  shiftPositionsMap: Record<string, ShiftPositionWithRowSpan[]>;
  leaveSchedule: Record<string, LeaveRenderInfo[]>;
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

export const useAnalyzeTeamShiftsCalendar = (
  props: AnalyzeTeamShiftsCalendarProps
): AnalyzeTeamShiftsCalendarReturn => {
  const {
    analyzeLeaveConflicts,
    shiftPositionsMap: originalShiftPositionsMap,
  } = props;

  const shiftPositionsMap = useMemo(() => {
    if (analyzeLeaveConflicts) {
      return doAnalyzeLeaveConflicts(props);
    }
    return originalShiftPositionsMap;
  }, [analyzeLeaveConflicts, originalShiftPositionsMap, props]);

  return {
    analyzedShiftPositionsMap: shiftPositionsMap,
  };
};
