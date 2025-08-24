import { Trans } from "@lingui/react/macro";
import { ShiftPosition } from "libs/graphql/src/types.generated";
import { useCallback, useEffect, useState } from "react";


import { shiftPositionKey } from "../utils/shiftPositionKey";

import { useConfirmDialog } from "./useConfirmDialog";
import { useTeamShiftActions } from "./useTeamShiftActions";


type ShiftPositionWithFake = ShiftPosition & {
  fake?: boolean;
  fakeFrom?: string;
};

export const useTeamShiftsClipboard = (
  selectedShiftPositionKeys: string[],
  selectedDay?: string
) => {
  const { showConfirmDialog } = useConfirmDialog();

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
        if (selectedShiftPositionKeys.length > 0) {
          setCopyingShiftPositionKeys(selectedShiftPositionKeys);
        }
        setCuttingShiftPositionKeys([]);
      }
    };
    globalThis.addEventListener("keydown", handleCopy);
    return () => globalThis.removeEventListener("keydown", handleCopy);
  }, [selectedShiftPositionKeys]);

  // catch command-x
  useEffect(() => {
    const handleCopy = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "x" && selectedShiftPositionKeys.length > 0) {
          setCuttingShiftPositionKeys(selectedShiftPositionKeys);
          setCopyingShiftPositionKeys([]);
        }
    };
    globalThis.addEventListener("keydown", handleCopy);
    return () => globalThis.removeEventListener("keydown", handleCopy);
  }, [selectedShiftPositionKeys]);

  // catch command-v
  useEffect(() => {
    const handlePaste = async (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "v" && selectedDay) {
        pasteShiftPositionFromClipboard(selectedDay);
      }
    };
    globalThis.addEventListener("keydown", handlePaste);
    return () => globalThis.removeEventListener("keydown", handlePaste);
  }, [selectedDay, pasteShiftPositionFromClipboard]);

  const handleDelete = useCallback(
    async (e: KeyboardEvent) => {
      if (
        (e.key === "Backspace" || e.key === "Delete") &&
        selectedShiftPositionKeys.length > 0
      ) {
        if (
          !(await showConfirmDialog({
            text: (
              <Trans>
                Are you sure you want to delete the selected shift positions?
              </Trans>
            ),
          }))
        ) {
          return;
        }
        deleteShiftPositionsFromClipboard();
      }
    },
    [
      selectedShiftPositionKeys,
      showConfirmDialog,
      deleteShiftPositionsFromClipboard,
    ]
  );

  // catch delete
  useEffect(() => {
    globalThis.addEventListener("keydown", handleDelete);
    return () => globalThis.removeEventListener("keydown", handleDelete);
  }, [
    selectedDay,
    pasteShiftPositionFromClipboard,
    deleteShiftPositionsFromClipboard,
    selectedShiftPositionKeys.length,
    handleDelete,
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
