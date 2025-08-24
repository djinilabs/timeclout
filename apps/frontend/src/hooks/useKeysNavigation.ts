import { useCallback, useEffect } from "react";

export interface UseKeysNavigationProperties {
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
}: UseKeysNavigationProperties) => {
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
    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};
