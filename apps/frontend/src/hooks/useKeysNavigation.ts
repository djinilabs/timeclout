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
        onUp();
      }
      if (event.key === "ArrowDown") {
        onDown();
      }
      if (event.key === "ArrowLeft") {
        onLeft();
      }
      if (event.key === "ArrowRight") {
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
