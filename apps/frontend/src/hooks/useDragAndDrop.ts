import { useContext } from "react";
import { DragAndDropContext } from "../contexts/DragAndDropContext";

export const useDragAndDrop = () => {
  const { dragging, setDragging, resetDragging } =
    useContext(DragAndDropContext);

  return { dragging, setDragging, resetDragging };
};
