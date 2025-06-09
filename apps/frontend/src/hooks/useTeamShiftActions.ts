import moveShiftPositionMutation from "@/graphql-client/mutations/moveShiftPosition.graphql";
import copyShiftPositionMutation from "@/graphql-client/mutations/copyShiftPosition.graphql";
import deleteShiftPositionMutation from "@/graphql-client/mutations/deleteShiftPosition.graphql";
import createShiftPositionMutation from "@/graphql-client/mutations/createShiftPosition.graphql";
import updateShiftPositionMutation from "@/graphql-client/mutations/updateShiftPosition.graphql";
import { useMutation } from "./useMutation";
import { useCallback } from "react";
import toast from "react-hot-toast";
import {
  CreateShiftPositionInput,
  UpdateShiftPositionInput,
} from "libs/graphql/src/types.generated";
import { i18n } from "@lingui/core";
export interface UseTeamShiftActions {
  moveShiftPosition: (pk: string, sk: string, day: string) => Promise<void>;
  copyShiftPosition: (pk: string, sk: string, day: string) => Promise<void>;
  deleteShiftPosition: (pk: string, sk: string) => Promise<void>;
  createShiftPosition: (input: CreateShiftPositionInput) => Promise<boolean>;
  updateShiftPosition: (input: UpdateShiftPositionInput) => Promise<boolean>;
}

export const useTeamShiftActions = (): UseTeamShiftActions => {
  const [, createShiftPosition] = useMutation(createShiftPositionMutation);
  const [, updateShiftPosition] = useMutation(updateShiftPositionMutation);
  const [, moveShiftPosition] = useMutation(moveShiftPositionMutation);
  const [, copyShiftPosition] = useMutation(copyShiftPositionMutation);
  const [, deleteShiftPosition] = useMutation(deleteShiftPositionMutation);

  return {
    createShiftPosition: useCallback(
      async (input) => {
        const result = await createShiftPosition({ input });
        if (!result.error) {
          toast.success(i18n.t("Shift position created"));
          return true;
        }
        return false;
      },
      [createShiftPosition]
    ),
    updateShiftPosition: useCallback(
      async (input) => {
        const result = await updateShiftPosition({ input });
        if (!result.error) {
          toast.success(i18n.t("Shift position updated"));
          return true;
        }
        return false;
      },
      [updateShiftPosition]
    ),
    moveShiftPosition: useCallback(
      async (pk, sk, day) => {
        const result = await moveShiftPosition({
          input: { pk, sk, day },
        });
        if (!result.error) {
          toast.success(i18n.t("Shift position moved"));
        }
      },
      [moveShiftPosition]
    ),
    copyShiftPosition: useCallback(
      async (pk, sk, day) => {
        const result = await copyShiftPosition({
          input: { pk, sk, day },
        });
        if (!result.error) {
          toast.success(i18n.t("Shift position copied"));
        }
      },
      [copyShiftPosition]
    ),
    deleteShiftPosition: useCallback(
      async (pk, sk) => {
        const result = await deleteShiftPosition({ input: { pk, sk } });
        if (!result.error) {
          toast.success(i18n.t("Shift position deleted"));
        }
      },
      [deleteShiftPosition]
    ),
  };
};
