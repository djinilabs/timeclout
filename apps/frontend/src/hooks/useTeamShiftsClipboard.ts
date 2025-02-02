import { useCallback, useEffect, useState } from "react";
import { ShiftPosition } from "libs/graphql/src/types.generated";
import { useTeamShiftActions } from "./useTeamShiftActions";
type ShiftPositionWithFake = ShiftPosition & {
  fake?: boolean;
  fakeFrom?: string;
};

export const useTeamShiftsClipboard = (
  focusedShiftPosition: ShiftPositionWithFake | null,
  selectedDay: string | null
) => {
  const [copyingShiftPosition, setCopyingShiftPosition] =
    useState<ShiftPositionWithFake | null>(null);

  // catch command-c
  useEffect(() => {
    const handleCopy = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "c") {
        console.log("copy");
        if (focusedShiftPosition) {
          setCopyingShiftPosition(focusedShiftPosition);
        }
      }
    };
    window.addEventListener("keydown", handleCopy);
    return () => window.removeEventListener("keydown", handleCopy);
  }, [focusedShiftPosition]);

  const { moveShiftPosition, copyShiftPosition } = useTeamShiftActions();

  // catch command-v
  useEffect(() => {
    const handlePaste = async (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "v") {
        console.log("paste");
        if (!copyingShiftPosition || !selectedDay) {
          return;
        }
        copyShiftPosition(
          copyingShiftPosition.pk,
          copyingShiftPosition.sk,
          selectedDay
        );
      }
    };
    window.addEventListener("keydown", handlePaste);
    return () => window.removeEventListener("keydown", handlePaste);
  }, [copyShiftPosition, copyingShiftPosition, moveShiftPosition, selectedDay]);

  const copyShiftPositionToClipboard = useCallback(
    (shiftPosition: ShiftPositionWithFake) => {
      setCopyingShiftPosition(shiftPosition);
    },
    []
  );

  return {
    copyShiftPositionToClipboard,
  };
};
