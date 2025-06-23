import { createContext } from "react";

export const DragAndDropContext = createContext<{
  setDragging: (draggable: NonNullable<unknown>) => void;
  dragging: NonNullable<unknown> | null;
  resetDragging: () => void;
}>({
  setDragging: () => {},
  dragging: null,
  resetDragging: () => {},
});
