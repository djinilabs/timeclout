import { useContext } from "react";
import {
  DragAndDropContext,
  type DraggableItem,
} from "../contexts/DragAndDropContext";
import { type ShiftPositionWithFake } from "./useTeamShiftPositionsMap";
import { ScheduleDayTemplate } from "@/settings";

type DraggableValue<T extends DraggableItem["type"]> = T extends "shiftPosition"
  ? ShiftPositionWithFake
  : T extends "dayTemplate"
  ? ScheduleDayTemplate
  : never;

type UseDragAndDropReturn<T extends DraggableItem["type"]> = {
  dragging: DraggableValue<T> | null;
  setDragging: (draggable: DraggableItem) => void;
  resetDragging: () => void;
};

export const useDragAndDrop = <T extends DraggableItem["type"]>(
  type: T
): UseDragAndDropReturn<T> => {
  const { dragging, setDragging, resetDragging } =
    useContext(DragAndDropContext);

  const typedDragging = dragging?.type === type ? dragging.value : null;

  return {
    dragging: typedDragging as DraggableValue<T> | null,
    setDragging,
    resetDragging,
  };
};

export type { DraggableItem };
