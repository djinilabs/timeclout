import { useRef, useCallback, useState } from "react";
import { nanoid } from "nanoid";
import { useTeamShiftActions } from "./useTeamShiftActions";
import { ShiftPosition } from "../graphql/graphql";
import { useDragAndDrop } from "./useDragAndDrop";
import { ShiftPositionWithFake } from "./useTeamShiftPositionsMap";

export const useTeamShiftsDragAndDrop = (shiftPositions: ShiftPosition[]) => {
  const { setDragging, dragging, resetDragging } = useDragAndDrop();
  const [draggingShiftPosition, setDraggingShiftPosition] =
    useState<ShiftPositionWithFake | null>(null);
  const lastDraggedToDay = useRef<string | null>(null);

  const onShiftPositionDragStart = useCallback(
    (
      shiftPosition: ShiftPositionWithFake,
      e: React.DragEvent<HTMLDivElement>
    ) => {
      console.log("onShiftPositionDragStart", shiftPosition);
      setDraggingShiftPosition(shiftPosition);
      e.dataTransfer.dropEffect = "move";
      e.currentTarget.setAttribute("aria-grabbed", "true");
    },
    []
  );

  const onShiftPositionDragEnd = useCallback(
    (_: ShiftPositionWithFake, e: React.DragEvent<HTMLDivElement>) => {
      console.log("onShiftPositionDragEnd");
      setDraggingShiftPosition(null);
      e.currentTarget.setAttribute("aria-grabbed", "false");
    },
    []
  );

  const onCellDragOver = useCallback(
    (day: string) => {
      if (lastDraggedToDay.current == day) {
        return;
      }
      lastDraggedToDay.current = day;
      if (!draggingShiftPosition) {
        return;
      }
      const foundPosition = shiftPositions?.find(
        (shiftPosition) => shiftPosition.sk === draggingShiftPosition.sk
      );
      if (!foundPosition || draggingShiftPosition.day == day) {
        return;
      }
      const position = {
        ...draggingShiftPosition,
        day,
        sk: `day/${nanoid()}`, // fake sk
        fake: true,
        fakeFrom: draggingShiftPosition.sk,
      };
      setDragging(position);
    },
    [draggingShiftPosition, setDragging, shiftPositions]
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
    onShiftPositionDragStart,
    onShiftPositionDragEnd,
    onCellDragOver,
    onCellDragLeave,
    onCellDrop,
    draggingShiftPosition: dragging,
  };
};
