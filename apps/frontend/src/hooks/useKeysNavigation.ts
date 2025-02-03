import { useCallback, useEffect } from "react";

export interface UseKeysNavigationProps {
  onUp: () => void;
  onDown: () => void;
  onLeft: () => void;
  onRight: () => void;
}

export const useKeysNavigation = ({
  onUp,
  onDown,
  onLeft,
  onRight,
}: UseKeysNavigationProps) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        event.stopPropagation();
        onUp();
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        event.stopPropagation();
        onDown();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        onLeft();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        onRight();
      }
    },
    [onUp, onDown, onLeft, onRight]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};
