import { useMemo } from "react";
import { splitShiftPositionForEachDay } from "../utils/splitShiftPositionsForEachDay";
import { type ShiftPosition as ShiftPositionType } from "libs/graphql/src/types.generated";
import { isValidNumber } from "../utils/isValidNumber";

export type ShiftPositionWithFake = ShiftPositionType & {
  fake?: boolean;
  fakeFrom?: string;
  original: ShiftPositionType;
  rowPosInPreviousDay: number;
  rowSpan: number;
  rowStart: number;
  rowEnd: number;
};

export interface UseTeamShiftPositionsMapParams {
  draggingShiftPosition: ShiftPositionType | null;
  shiftPositionsResult: ShiftPositionType[];
}

export const useTeamShiftPositionsMap = ({
  shiftPositionsResult,
  draggingShiftPosition,
}: UseTeamShiftPositionsMapParams) => {
  const shiftPositions = useMemo(() => {
    if (draggingShiftPosition) {
      const shiftPositions = [...(shiftPositionsResult ?? [])];
      shiftPositions.push(draggingShiftPosition);
      return shiftPositions;
    }
    return shiftPositionsResult;
  }, [draggingShiftPosition, shiftPositionsResult]);

  const shiftPositionsMap = useMemo(() => {
    const entries = shiftPositions.flatMap((shiftPosition) => {
      return splitShiftPositionForEachDay(shiftPosition).map(
        (splittedShiftPosition) =>
          [
            splittedShiftPosition.day,
            {
              ...splittedShiftPosition,
              original: shiftPosition,
              rowSpan: 1,
            },
          ] as [string, ShiftPositionWithFake]
      );
    });

    const map = entries?.reduce(
      (acc, [day, shiftPosition]) => {
        const dayPositions = acc[day] ?? [];
        acc[day] = dayPositions;
        const pos =
          draggingShiftPosition &&
          shiftPosition.sk ===
            (draggingShiftPosition as ShiftPositionWithFake).fakeFrom
            ? {
                ...shiftPosition,
                fake: true,
              }
            : shiftPosition;
        dayPositions.push(pos);
        return acc;
      },
      {} as Record<string, ShiftPositionWithFake[]>
    );

    let previousDayPositions: ShiftPositionWithFake[] = [];
    for (const day of Object.keys(map).sort()) {
      const dayPositions = map[day];
      // here we must keep track of split day
      // and then ensure that the rowSpan is set correctly
      // for each shift position
      for (const dayPosition of dayPositions) {
        const { original: originalPos } = dayPosition;
        const previousDayIndex = previousDayPositions.findIndex(
          (previousDayPos) => previousDayPos.sk === originalPos.sk
        );
        dayPosition.rowPosInPreviousDay =
          previousDayIndex >= 0 ? previousDayIndex : Infinity;
      }

      const sortedDayPositions = dayPositions.sort(
        (a, b) => a.rowPosInPreviousDay - b.rowPosInPreviousDay
      );

      // now we fill in the rowSpan
      let previousRowSpan = 0;
      for (const dayPosition of sortedDayPositions) {
        let rowSpan = dayPosition.rowPosInPreviousDay
          ? dayPosition.rowPosInPreviousDay + 1 - previousRowSpan
          : 1;
        if (!isValidNumber(rowSpan)) {
          rowSpan = 1;
        }
        dayPosition.rowSpan = rowSpan;
        dayPosition.rowStart = isValidNumber(previousRowSpan)
          ? previousRowSpan + 1
          : 1;
        dayPosition.rowEnd = dayPosition.rowStart + rowSpan - 1;
        previousRowSpan += rowSpan;
      }
      map[day] = sortedDayPositions;

      previousDayPositions = dayPositions;
    }

    return map;
  }, [draggingShiftPosition, shiftPositions]);

  return {
    shiftPositionsMap,
  };
};
