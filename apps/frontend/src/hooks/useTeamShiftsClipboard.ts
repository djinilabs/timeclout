import { useCallback, useEffect, useState } from "react";
import { ShiftPosition } from "libs/graphql/src/types.generated";
import { useTeamShiftActions } from "./useTeamShiftActions";
import { i18n } from "@lingui/core";
import { shiftPositionKey } from "../utils/shiftPositionKey";

type ShiftPositionWithFake = ShiftPosition & {
  fake?: boolean;
  fakeFrom?: string;
};

export const useTeamShiftsClipboard = (
  selectedShiftPositionKeys: string[],
  selectedDay?: string
) => {
  const [copyingShiftPositionKeys, setCopyingShiftPositionKeys] = useState<
    string[] | null
  >(null);
  const [cuttingShiftPositionKeys, setCuttingShiftPositionKeys] = useState<
    string[] | null
  >(null);
  const { copyShiftPosition, deleteShiftPosition } = useTeamShiftActions();

  const pasteShiftPositionFromClipboard = useCallback(
    async (day: string) => {
      if (!copyingShiftPositionKeys && !cuttingShiftPositionKeys) {
        return;
      }
      for (const shiftPositionKey of copyingShiftPositionKeys ?? []) {
        const [pk, sk] = shiftPositionKey.split("//");
        await copyShiftPosition(pk, sk, day);
      }
      for (const shiftPositionKey of cuttingShiftPositionKeys ?? []) {
        const [pk, sk] = shiftPositionKey.split("//");
        await copyShiftPosition(pk, sk, day);
        await deleteShiftPosition(pk, sk);
      }
    },
    [
      copyShiftPosition,
      copyingShiftPositionKeys,
      cuttingShiftPositionKeys,
      deleteShiftPosition,
    ]
  );

  const deleteShiftPositionsFromClipboard = useCallback(() => {
    for (const shiftPositionKey of selectedShiftPositionKeys) {
      const [pk, sk] = shiftPositionKey.split("//");
      deleteShiftPosition(pk, sk);
    }
  }, [deleteShiftPosition, selectedShiftPositionKeys]);

  // catch command-c
  useEffect(() => {
    const handleCopy = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "c") {
        if (selectedShiftPositionKeys.length) {
          setCopyingShiftPositionKeys(selectedShiftPositionKeys);
        }
        setCuttingShiftPositionKeys([]);
      }
    };
    window.addEventListener("keydown", handleCopy);
    return () => window.removeEventListener("keydown", handleCopy);
  }, [selectedShiftPositionKeys]);

  // catch command-x
  useEffect(() => {
    const handleCopy = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "x") {
        if (selectedShiftPositionKeys.length) {
          setCuttingShiftPositionKeys(selectedShiftPositionKeys);
          setCopyingShiftPositionKeys([]);
        }
      }
    };
    window.addEventListener("keydown", handleCopy);
    return () => window.removeEventListener("keydown", handleCopy);
  }, [selectedShiftPositionKeys]);

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
        selectedShiftPositionKeys.length > 0
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
    selectedShiftPositionKeys.length,
  ]);

  const copyShiftPositionToClipboard = useCallback(
    (shiftPosition: ShiftPositionWithFake) => {
      setCopyingShiftPositionKeys([shiftPositionKey(shiftPosition)]);
    },
    []
  );

  return {
    copyShiftPositionToClipboard,
    pasteShiftPositionFromClipboard,
    hasCopiedShiftPosition:
      copyingShiftPositionKeys && copyingShiftPositionKeys?.length > 0,
  };
};
