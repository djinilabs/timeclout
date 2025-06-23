import { useState } from "react";
import { DragAndDropContext } from "../contexts/DragAndDropContext";

export const DragAndDropProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dragging, setDragging] = useState<NonNullable<unknown> | null>(null);

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
