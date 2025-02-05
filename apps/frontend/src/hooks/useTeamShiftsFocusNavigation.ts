import { useEffect, useState } from "react";
import { DayDate } from "@/day-date";
import { useKeysNavigation } from "../hooks/useKeysNavigation";
import { type ShiftPosition as ShiftPositionType } from "libs/graphql/src/types.generated";

type ShiftPositionWithFake = ShiftPositionType & {
  fake?: boolean;
  fakeFrom?: string;
  original?: ShiftPositionType;
};

export interface UseTeamShiftsFocusNavigationProps {
  shiftPositionsMap: Record<string, ShiftPositionWithFake[]>;
  selectedMonth: DayDate;
  previouslySelectedMonth: DayDate | null;
  goToMonth: (month: DayDate) => void;
}

export const useTeamShiftsFocusNavigation = ({
  shiftPositionsMap,
  selectedMonth,
  previouslySelectedMonth,
  goToMonth,
}: UseTeamShiftsFocusNavigationProps) => {
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
              : nextSelectionPreference === "first"
                ? 0
                : nextShiftPositions.length - 1;

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

  useEffect(() => {
    if (
      !focusedShiftPosition &&
      shiftPositionsMap &&
      (!previouslySelectedMonth ||
        !previouslySelectedMonth?.isSameMonth(selectedMonth))
    ) {
      // determine the new focused shift position based on the previously selected month
      // first, we need to determine which direction to scan the month: up or down
      const direction =
        previouslySelectedMonth == null ||
        previouslySelectedMonth.isBefore(selectedMonth)
          ? 1
          : -1;

      let scanningDay =
        direction == 1
          ? selectedMonth.firstOfMonth()
          : selectedMonth.endOfMonth();
      while (scanningDay.isSameMonth(selectedMonth)) {
        const shiftPositions = shiftPositionsMap[scanningDay.toString()];
        if (shiftPositions) {
          const candidate =
            shiftPositions[direction == 1 ? 0 : shiftPositions.length - 1];
          if (
            candidate &&
            new DayDate(candidate.day).isSameMonth(selectedMonth)
          ) {
            setFocusedShiftPosition(candidate);
            break;
          }
        }
        scanningDay = scanningDay.nextDay(direction);
      }
    }
  }, [
    focusedShiftPosition,
    previouslySelectedMonth,
    selectedMonth,
    shiftPositionsMap,
  ]);

  return {
    setFocusedShiftPosition,
    focusedShiftPosition,
  };
};
