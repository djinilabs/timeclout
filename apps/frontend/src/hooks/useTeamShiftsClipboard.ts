import { useCallback, useEffect, useState } from "react";
import { ShiftPosition } from "libs/graphql/src/types.generated";
import { useTeamShiftActions } from "./useTeamShiftActions";
import { i18n } from "@lingui/core";
type ShiftPositionWithFake = ShiftPosition & {
  fake?: boolean;
  fakeFrom?: string;
};

export const useTeamShiftsClipboard = (
  selectedShiftPositions: ShiftPositionWithFake[],
  selectedDay?: string
) => {
  const [copyingShiftPositions, setCopyingShiftPositions] = useState<
    ShiftPositionWithFake[] | null
  >(null);
  const [cuttingShiftPositions, setCuttingShiftPositions] = useState<
    ShiftPositionWithFake[] | null
  >(null);
  const { copyShiftPosition, deleteShiftPosition } = useTeamShiftActions();

  const pasteShiftPositionFromClipboard = useCallback(
    async (day: string) => {
      if (!copyingShiftPositions && !cuttingShiftPositions) {
        return;
      }
      for (const shiftPosition of copyingShiftPositions ?? []) {
        copyShiftPosition(shiftPosition.pk, shiftPosition.sk, day);
      }
      for (const shiftPosition of cuttingShiftPositions ?? []) {
        await copyShiftPosition(shiftPosition.pk, shiftPosition.sk, day);
        await deleteShiftPosition(shiftPosition.pk, shiftPosition.sk);
      }
    },
    [
      copyShiftPosition,
      copyingShiftPositions,
      cuttingShiftPositions,
      deleteShiftPosition,
    ]
  );

  const deleteShiftPositionsFromClipboard = useCallback(() => {
    for (const shiftPosition of selectedShiftPositions) {
      deleteShiftPosition(shiftPosition.pk, shiftPosition.sk);
    }
  }, [deleteShiftPosition, selectedShiftPositions]);

  // catch command-c
  useEffect(() => {
    const handleCopy = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "c") {
        if (selectedShiftPositions.length) {
          setCopyingShiftPositions(selectedShiftPositions);
        }
        setCuttingShiftPositions([]);
      }
    };
    window.addEventListener("keydown", handleCopy);
    return () => window.removeEventListener("keydown", handleCopy);
  }, [selectedShiftPositions]);

  // catch command-x
  useEffect(() => {
    const handleCopy = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "x") {
        if (selectedShiftPositions.length) {
          setCuttingShiftPositions(selectedShiftPositions);
          setCopyingShiftPositions([]);
        }
      }
    };
    window.addEventListener("keydown", handleCopy);
    return () => window.removeEventListener("keydown", handleCopy);
  }, [selectedShiftPositions]);

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

  // catch delete
  useEffect(() => {
    const handleDelete = async (e: KeyboardEvent) => {
      if (
        (e.key === "Backspace" || e.key === "Delete") &&
        selectedShiftPositions.length > 0
      ) {
        if (
          confirm(
            i18n.t(
              "Are you sure you want to delete the selected shift positions?"
            )
          )
        ) {
          deleteShiftPositionsFromClipboard();
        }
      }
    };
    window.addEventListener("keydown", handleDelete);
    return () => window.removeEventListener("keydown", handleDelete);
  }, [
    selectedDay,
    pasteShiftPositionFromClipboard,
    deleteShiftPositionsFromClipboard,
    selectedShiftPositions.length,
  ]);

  const copyShiftPositionToClipboard = useCallback(
    (shiftPosition: ShiftPositionWithFake) => {
      setCopyingShiftPositions([shiftPosition]);
    },
    []
  );

  return {
    copyShiftPositionToClipboard,
    pasteShiftPositionFromClipboard,
    hasCopiedShiftPosition:
      copyingShiftPositions && copyingShiftPositions?.length > 0,
  };
};
