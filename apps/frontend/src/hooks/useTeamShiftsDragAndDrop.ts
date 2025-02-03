import { useRef, useState, useCallback } from "react";
import { nanoid } from "nanoid";
import { useTeamShiftActions } from "./useTeamShiftActions";
import { ShiftPosition } from "../graphql/graphql";

export const useTeamShiftsDragAndDrop = (shiftPositions: ShiftPosition[]) => {
  const [draggingShiftPosition, setDraggingShiftPosition] =
    useState<ShiftPosition | null>(null);
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
      setDraggingShiftPosition(position);
    },
    [shiftPositions]
  );

  const onCellDragLeave = useCallback(() => {
    lastDraggedToDay.current = null;
    setDraggingShiftPosition(null);
  }, []);

  const { moveShiftPosition } = useTeamShiftActions();

  const onCellDrop = useCallback(
    (day: string, e: React.DragEvent<HTMLDivElement>) => {
      const data = e.dataTransfer.types[0];
      lastDraggedToDay.current = day;
      const foundPosition = shiftPositions?.find(
        (shiftPosition) => shiftPosition.sk.toLowerCase() === data
      );
      if (!foundPosition || foundPosition.day == day) {
        return;
      }
      moveShiftPosition(foundPosition.pk, foundPosition.sk, day);
      setDraggingShiftPosition(null);
    },
    [moveShiftPosition, shiftPositions]
  );

  return {
    onCellDragOver,
    onCellDragLeave,
    onCellDrop,
    draggingShiftPosition,
  };
};
