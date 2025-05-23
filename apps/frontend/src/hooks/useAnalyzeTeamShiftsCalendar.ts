import { useMemo } from "react";
import { useLocalPreference } from "./useLocalPreference";
import { ShiftPositionWithRowSpan } from "./useTeamShiftPositionsMap";

export type AnalyzedShiftPosition = ShiftPositionWithRowSpan & {
  inconvenienceLoad?: number;
};

export interface AnalyzeTeamShiftsCalendarProps {
  shiftPositionsMap: Record<string, ShiftPositionWithRowSpan[]>;
}

export interface AnalyzeTeamShiftsCalendarReturn {
  analyzeInconvenienceLoad: boolean;
  setAnalyzeInconvenienceLoad: (analyzeInconvenienceLoad: boolean) => void;
  analyzedShiftPositionsMap: Record<string, AnalyzedShiftPosition[]>;
}

export const useAnalyzeTeamShiftsCalendar = ({
  shiftPositionsMap: originalShiftPositionsMap,
}: AnalyzeTeamShiftsCalendarProps): AnalyzeTeamShiftsCalendarReturn => {
  const [analyzeInconvenienceLoad, setAnalyzeInconvenienceLoad] =
    useLocalPreference(
      "team-shifts-calendar-show-analyze-inconvenience-load",
      false
    );

  const shiftPositionsMap = useMemo(() => {
    if (analyzeInconvenienceLoad) {
      return Object.fromEntries(
        Object.entries(originalShiftPositionsMap).map(
          ([day, shiftPositions]) => {
            return [
              day,
              shiftPositions.map((shiftPosition) => {
                return {
                  ...shiftPosition,
                };
              }),
            ];
          }
        )
      );
    }
    return originalShiftPositionsMap;
  }, [analyzeInconvenienceLoad, originalShiftPositionsMap]);

  return {
    analyzeInconvenienceLoad,
    setAnalyzeInconvenienceLoad,
    analyzedShiftPositionsMap: shiftPositionsMap,
  };
};
