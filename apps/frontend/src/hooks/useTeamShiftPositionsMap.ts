import { type ShiftPosition as ShiftPositionType } from "libs/graphql/src/types.generated";
import { useMemo } from "react";

import { splitShiftPositionForEachDay } from "../utils/splitShiftPositionsForEachDay";

export type ShiftPositionWithFake = ShiftPositionType & {
  fake?: boolean;
  isTemplate?: boolean;
  fakeFrom?: string;
  original: ShiftPositionType;
};

export interface UseTeamShiftPositionsMapParams {
  draggingShiftPosition?: ShiftPositionType | null;
  shiftPositionsResult: ShiftPositionType[];
  spillTime?: boolean;
}

export interface ShiftPositionWithRowSpan extends ShiftPositionWithFake {
  rowSpan: number;
  rowStart: number;
  rowEnd: number;
}

export interface UseTeamShiftPositionsMapResult {
  shiftPositionsMap: Record<string, Array<ShiftPositionWithRowSpan>>;
}

export const useTeamShiftPositionsMap = ({
  shiftPositionsResult,
  draggingShiftPosition,
  spillTime = true,
}: UseTeamShiftPositionsMapParams): UseTeamShiftPositionsMapResult => {
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
      return (
        spillTime
          ? splitShiftPositionForEachDay(shiftPosition)
          : [shiftPosition]
      ).map(
        (splittedShiftPosition) =>
          [
            splittedShiftPosition.day,
            {
              ...splittedShiftPosition,
              original: shiftPosition,
            },
          ] as [string, ShiftPositionWithFake]
      );
    });

    const map = entries?.reduce((acc, [day, shiftPosition]) => {
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
    }, {} as Record<string, ShiftPositionWithFake[]>);

    const newMap = {} as Record<string, Array<ShiftPositionWithRowSpan>>;

    let previousDayPositions: Array<ShiftPositionWithFake | undefined> = [];
    for (const day of Object.keys(map).sort()) {
      const dayPositions = map[day];
      const newDayPositions: Array<ShiftPositionWithFake | undefined> = [];
      // here we must keep track of split day
      // and then ensure that the rowSpan is set correctly
      // for each shift position
      for (const dayPosition of dayPositions) {
        const { original: originalPos } = dayPosition;
        const previousDayIndex = previousDayPositions.findIndex(
          (previousDayPos) => previousDayPos?.sk === originalPos.sk
        );
        let newDayIndex =
          previousDayIndex >= 0
            ? previousDayIndex
            : newDayPositions.findIndex((p) => p == null);
        if (newDayIndex < 0) {
          newDayIndex = newDayPositions.length;
        }
        newDayPositions[newDayIndex] = dayPosition;
      }

      // now we fill in the rowSpan
      let previousRowSpan = 0;

      const finalDayPositions = newDayPositions.reduce((acc, dayPos, index) => {
        if (!dayPos) {
          return acc;
        }
        if (dayPos != null) {
          const rowSpan = index - previousRowSpan + 1;
          previousRowSpan += rowSpan;
          acc.push({
            ...dayPos,
            rowSpan,
            rowStart: previousRowSpan,
            rowEnd: previousRowSpan + rowSpan - 1,
          });
        }
        return acc;
      }, [] as Array<ShiftPositionWithRowSpan>);

      newMap[day] = finalDayPositions;

      previousDayPositions = newDayPositions;
    }

    return newMap;
  }, [draggingShiftPosition, shiftPositions, spillTime]);

  return {
    shiftPositionsMap,
  };
};
