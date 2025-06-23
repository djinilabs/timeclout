import { useRef, useCallback } from "react";
import { nanoid } from "nanoid";
import { useTeamShiftActions } from "./useTeamShiftActions";
import { ShiftPosition } from "../graphql/graphql";
import { useDragAndDrop } from "./useDragAndDrop";
import { ShiftPositionWithFake } from "./useTeamShiftPositionsMap";

export const useTeamShiftsDragAndDrop = (shiftPositions: ShiftPosition[]) => {
  const { setDragging, dragging, resetDragging } = useDragAndDrop();
  const lastDraggedToDay = useRef<string | null>(null);

  const onCellDragOver = useCallback(
    (day: string, e: React.DragEvent<HTMLDivElement>) => {
      if (lastDraggedToDay.current == day) {
        return;
      }
      lastDraggedToDay.current = day;
      const data = e.dataTransfer.types[0];
      const foundPosition = shiftPositions?.find(
        (shiftPosition) => shiftPosition.sk.toLowerCase() === data
      );
      if (!foundPosition || foundPosition.day == day) {
        return;
      }
      const position = {
        ...foundPosition,
        day,
        sk: `day/${nanoid()}`, // fake sk
        fake: true,
        fakeFrom: foundPosition.sk,
      };
      setDragging(position);
    },
    [setDragging, shiftPositions]
  );

  const onCellDragLeave = useCallback(() => {
    lastDraggedToDay.current = null;
    resetDragging();
  }, [resetDragging]);

  const { moveShiftPosition } = useTeamShiftActions();

  const onCellDrop = useCallback(
    (day: string) => {
      const sk = (dragging as ShiftPositionWithFake)?.fakeFrom?.toLowerCase();
      lastDraggedToDay.current = day;
      const foundPosition = shiftPositions?.find((shiftPosition) => {
        return shiftPosition.sk.toLowerCase() === sk;
      });
      if (!foundPosition || foundPosition.day == day) {
        return;
      }
      moveShiftPosition(foundPosition.pk, foundPosition.sk, day);
      resetDragging();
    },
    [moveShiftPosition, resetDragging, shiftPositions, dragging]
  );

  return {
    onCellDragOver,
    onCellDragLeave,
    onCellDrop,
    draggingShiftPosition: dragging,
  };
};
