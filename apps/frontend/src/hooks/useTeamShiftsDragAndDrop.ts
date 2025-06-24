import { useCallback, useState } from "react";
import { nanoid } from "nanoid";
import { useTeamShiftActions } from "./useTeamShiftActions";
import { ShiftPosition } from "../graphql/graphql";
import { useDragAndDrop } from "./useDragAndDrop";
import { ShiftPositionWithFake } from "./useTeamShiftPositionsMap";

export const useTeamShiftsDragAndDrop = (
  teamPk: string,
  shiftPositions: ShiftPosition[]
) => {
  const {
    setDragging,
    dragging: draggingShiftPosition,
    resetDragging,
  } = useDragAndDrop("shiftPosition");

  const [draggingFakeShiftPosition, setDraggingFakeShiftPosition] =
    useState<ShiftPositionWithFake | null>(null);

  const { dragging: draggingDayTemplate } = useDragAndDrop("dayTemplate");

  const [lastDraggedToDay, setLastDraggedToDay] = useState<string | null>(null);

  const onShiftPositionDragStart = useCallback(
    (
      shiftPosition: ShiftPositionWithFake,
      e: React.DragEvent<HTMLDivElement>
    ) => {
      setDragging({
        type: "shiftPosition",
        value: shiftPosition,
      });
      e.dataTransfer.dropEffect = "move";
      e.currentTarget.setAttribute("aria-grabbed", "true");
    },
    [setDragging]
  );

  const onShiftPositionDragEnd = useCallback(
    (_: ShiftPositionWithFake, e: React.DragEvent<HTMLDivElement>) => {
      setDraggingFakeShiftPosition(null);
      resetDragging();
      e.currentTarget.setAttribute("aria-grabbed", "false");
    },
    [resetDragging]
  );

  const onCellDragOver = useCallback(
    (day: string) => {
      if (lastDraggedToDay == day) {
        return;
      }
      let sameDay = false;
      setLastDraggedToDay((previousDay) => {
        if (previousDay == day) {
          sameDay = true;
        }
        return day;
      });
      if (sameDay) {
        return;
      }
      if (draggingShiftPosition) {
        // the shift position is being dragged
        const foundPosition = shiftPositions?.find(
          (shiftPosition) => shiftPosition.sk === draggingShiftPosition.sk
        );
        if (!foundPosition || draggingShiftPosition.day == day) {
          return;
        }
        const position = {
          ...draggingShiftPosition,
          day,
          sk: `${day}/${nanoid()}`, // fake sk
          fake: true,
          fakeFrom: draggingShiftPosition.sk,
        };
        setDraggingFakeShiftPosition(position);
      }
    },
    [draggingShiftPosition, shiftPositions, lastDraggedToDay]
  );

  // no need to do anything here
  const onCellDragLeave = useCallback(() => {}, []);

  const { moveShiftPosition, createShiftPosition } = useTeamShiftActions();

  const onCellDrop = useCallback(
    async (day: string) => {
      // drop day template
      if (draggingDayTemplate) {
        const dayTemplate = draggingDayTemplate;
        for (const shiftPosition of dayTemplate) {
          await createShiftPosition({
            team: teamPk,
            name: shiftPosition.name,
            color: shiftPosition.color,
            day: day,
            requiredSkills: shiftPosition.requiredSkills,
            schedules: shiftPosition.schedules,
          });
        }
        return;
      }

      // drop template
      if (draggingShiftPosition?.isTemplate) {
        createShiftPosition({
          team: teamPk,
          name: draggingShiftPosition.name,
          color: draggingShiftPosition.color,
          day: day,
          requiredSkills: draggingShiftPosition.requiredSkills,
          schedules: draggingShiftPosition.schedules,
        });
        return;
      }

      // drop shift position
      const shiftPosition = draggingFakeShiftPosition;
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
      const foundPosition = shiftPositions?.find((shiftPosition) => {
        return shiftPosition.sk.toLowerCase() === sk;
      });
      if (!foundPosition || foundPosition.day == day) {
        return;
      }
      moveShiftPosition(foundPosition.pk, foundPosition.sk, day);
      resetDragging();
      setDraggingFakeShiftPosition(null);
    },
    [
      draggingDayTemplate,
      draggingShiftPosition?.isTemplate,
      draggingShiftPosition?.name,
      draggingShiftPosition?.color,
      draggingShiftPosition?.requiredSkills,
      draggingShiftPosition?.schedules,
      draggingFakeShiftPosition,
      shiftPositions,
      moveShiftPosition,
      resetDragging,
      createShiftPosition,
      teamPk,
    ]
  );

  return {
    onShiftPositionDragStart,
    onShiftPositionDragEnd,
    onCellDragOver,
    onCellDragLeave,
    onCellDrop,
    draggingShiftPosition: draggingFakeShiftPosition,
  };
};
