import { useState } from "react";
import {
  DragAndDropContext,
  type DraggableItem,
} from "../contexts/DragAndDropContext";

export const DragAndDropProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dragging, setDragging] = useState<DraggableItem | null>(null);

  const resetDragging = () => {
    setDragging(null);
  };

  return (
    <DragAndDropContext.Provider
      value={{ dragging, setDragging, resetDragging }}
    >
      {children}
    </DragAndDropContext.Provider>
  );
};
