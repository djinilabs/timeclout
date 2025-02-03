import { useMemo } from "react";
import { DayDate } from "@/day-date";
import { splitShiftPositionForEachDay } from "../utils/splitShiftPositionsForEachDay";
import { type ShiftPosition as ShiftPositionType } from "libs/graphql/src/types.generated";

type ShiftPositionWithFake = ShiftPositionType & {
  fake?: boolean;
  fakeFrom?: string;
  original?: ShiftPositionType;
};

export interface UseTeamShiftPositionsMapParams {
  draggingShiftPosition?: ShiftPositionWithFake | null;
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
            },
          ] as [string, ShiftPositionWithFake]
      );
    });

    return entries?.reduce(
      (acc, [day, shiftPosition]) => {
        const dayPositions = acc[day] ?? [];
        acc[day] = dayPositions;
        const pos =
          draggingShiftPosition &&
          shiftPosition.sk === draggingShiftPosition.fakeFrom
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
  }, [draggingShiftPosition, shiftPositions]);

  return {
    shiftPositionsMap,
  };
};
