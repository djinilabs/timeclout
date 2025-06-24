import { createContext } from "react";
import { type ShiftPositionWithFake } from "../hooks/useTeamShiftPositionsMap";
import { type ScheduleDayTemplate } from "@/settings";

export type DraggableItem =
  | {
      type: "shiftPosition";
      value: ShiftPositionWithFake;
    }
  | {
      type: "dayTemplate";
      value: ScheduleDayTemplate;
    };

export const DragAndDropContext = createContext<{
  setDragging: (draggable: DraggableItem) => void;
  dragging: DraggableItem | null;
  resetDragging: () => void;
}>({
  setDragging: () => {},
  dragging: null,
  resetDragging: () => {},
});
