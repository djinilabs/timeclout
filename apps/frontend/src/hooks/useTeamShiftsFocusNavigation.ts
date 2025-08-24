import { type ShiftPosition as ShiftPositionType } from "libs/graphql/src/types.generated";
import { useState } from "react";

import { useKeysNavigation } from "../hooks/useKeysNavigation";

import { DayDate } from "@/day-date";

type ShiftPositionWithFake = ShiftPositionType & {
  fake?: boolean;
  fakeFrom?: string;
  original?: ShiftPositionType;
};

export interface UseTeamShiftsFocusNavigationProperties {
  shiftPositionsMap: Record<string, ShiftPositionWithFake[]>;
  selectedMonth: DayDate;
  previouslySelectedMonth: DayDate | null;
  goToMonth: (month: DayDate) => void;
}

export const useTeamShiftsFocusNavigation = ({
  shiftPositionsMap,
  selectedMonth,
  goToMonth,
}: UseTeamShiftsFocusNavigationProperties) => {
  const [focusedShiftPosition, setFocusedShiftPosition] =
    useState<ShiftPositionWithFake | null>(null);

  const advanceFocusedShiftPositionByDays = (
    days: number,
    nextSelectionPreference: "same" | "first" | "last"
  ) => {
    if (focusedShiftPosition) {
      let triedFocus = 0;
      let tryDay = new DayDate(focusedShiftPosition.day);
      const initialIndex = shiftPositionsMap?.[tryDay.toString()]?.findIndex(
        (shiftPosition) => shiftPosition === focusedShiftPosition
      );
      while (triedFocus < 10) {
        triedFocus++;
        tryDay = tryDay.nextDay(days);
        // if previous day is not the same month, we need to navigate to the previous month
        if (tryDay.getMonth() !== selectedMonth.getMonth()) {
          goToMonth(tryDay);
          break;
        }
        const nextShiftPositions = shiftPositionsMap?.[tryDay.toString()];
        if (nextShiftPositions) {
          const nextIndex =
            nextSelectionPreference === "same"
              ? Math.min(initialIndex, nextShiftPositions.length - 1)
              : (nextSelectionPreference === "first"
                ? 0
                : nextShiftPositions.length - 1);

          const nextShiftPosition = nextShiftPositions[nextIndex];
          if (nextShiftPosition) {
            setFocusedShiftPosition(nextShiftPosition);
            break;
          }
        }
      }
    }
  };

  useKeysNavigation({
    onUp: () => {
      if (focusedShiftPosition) {
        const dayShiftPositions = shiftPositionsMap?.[focusedShiftPosition.day];
        const index = dayShiftPositions?.findIndex(
          (shiftPosition) => shiftPosition === focusedShiftPosition
        );
        if (index !== undefined && index > 0) {
          setFocusedShiftPosition(dayShiftPositions[index - 1]);
        } else {
          advanceFocusedShiftPositionByDays(-7, "last");
        }
      }
    },
    onDown: () => {
      if (focusedShiftPosition) {
        const dayShiftPositions = shiftPositionsMap?.[focusedShiftPosition.day];
        const index = dayShiftPositions?.findIndex(
          (shiftPosition) => shiftPosition === focusedShiftPosition
        );
        if (index !== undefined && index < dayShiftPositions.length - 1) {
          setFocusedShiftPosition(dayShiftPositions[index + 1]);
        } else {
          advanceFocusedShiftPositionByDays(7, "first");
        }
      }
    },
    onLeft: () => {
      advanceFocusedShiftPositionByDays(-1, "same");
    },
    onRight: () => {
      advanceFocusedShiftPositionByDays(1, "same");
    },
  });

  return {
    setFocusedShiftPosition,
    focusedShiftPosition,
  };
};
