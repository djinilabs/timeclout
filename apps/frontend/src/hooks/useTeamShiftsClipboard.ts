import { useCallback, useEffect, useState } from "react";
import { ShiftPosition } from "libs/graphql/src/types.generated";
import { useTeamShiftActions } from "./useTeamShiftActions";
type ShiftPositionWithFake = ShiftPosition & {
  fake?: boolean;
  fakeFrom?: string;
};

export const useTeamShiftsClipboard = (
  focusedShiftPosition: ShiftPositionWithFake | null,
  selectedDay?: string
) => {
  const [copyingShiftPosition, setCopyingShiftPosition] =
    useState<ShiftPositionWithFake | null>(null);
  const { copyShiftPosition } = useTeamShiftActions();

  const pasteShiftPositionFromClipboard = useCallback(
    (day: string) => {
      if (!copyingShiftPosition) {
        return;
      }
      copyShiftPosition(copyingShiftPosition.pk, copyingShiftPosition.sk, day);
    },
    [copyingShiftPosition, copyShiftPosition]
  );

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

  // catch command-v
  useEffect(() => {
    const handlePaste = async (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "v" && selectedDay) {
        pasteShiftPositionFromClipboard(selectedDay);
      }
    };
    window.addEventListener("keydown", handlePaste);
    return () => window.removeEventListener("keydown", handlePaste);
  }, [selectedDay, pasteShiftPositionFromClipboard]);

  const copyShiftPositionToClipboard = useCallback(
    (shiftPosition: ShiftPositionWithFake) => {
      setCopyingShiftPosition(shiftPosition);
    },
    []
  );

  return {
    copyShiftPositionToClipboard,
    pasteShiftPositionFromClipboard,
    hasCopiedShiftPosition: !!copyingShiftPosition,
  };
};
