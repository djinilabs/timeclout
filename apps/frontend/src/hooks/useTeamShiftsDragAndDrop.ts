import { useRef, useCallback, useState } from "react";
import { nanoid } from "nanoid";
import { useTeamShiftActions } from "./useTeamShiftActions";
import { ShiftPosition } from "../graphql/graphql";
import { useDragAndDrop } from "./useDragAndDrop";
import { ShiftPositionWithFake } from "./useTeamShiftPositionsMap";

export const useTeamShiftsDragAndDrop = (
  teamPk: string,
  shiftPositions: ShiftPosition[]
) => {
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
    console.log("onCellDragLeave");
    if (draggingShiftPosition) {
      resetDragging();
    }
  }, [draggingShiftPosition, resetDragging]);

  const { moveShiftPosition, createShiftPosition } = useTeamShiftActions();

  const onCellDrop = useCallback(
    (day: string) => {
      console.log("onCellDrop", dragging);
      const shiftPosition = dragging as ShiftPositionWithFake | null;
      if (!shiftPosition) {
        return;
      }
      if (shiftPosition.isTemplate) {
        createShiftPosition({
          team: teamPk,
          name: shiftPosition.name,
          color: shiftPosition.color,
          day: day,
          requiredSkills: shiftPosition.requiredSkills,
          schedules: shiftPosition.schedules,
        });
        return;
      }
      const sk = shiftPosition.fakeFrom?.toLowerCase();
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
    [
      createShiftPosition,
      moveShiftPosition,
      resetDragging,
      shiftPositions,
      dragging,
      teamPk,
    ]
  );

  return {
    onShiftPositionDragStart,
    onShiftPositionDragEnd,
    onCellDragOver,
    onCellDragLeave,
    onCellDrop,
    draggingShiftPosition: (dragging as ShiftPositionWithFake)?.isTemplate
      ? null
      : dragging,
  };
};
