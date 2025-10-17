import { i18n } from "@lingui/core";
import {
  CreateShiftPositionInput,
  UpdateShiftPositionInput,
} from "libs/graphql/src/types.generated";
import { useCallback } from "react";
import toast from "react-hot-toast";

import { useMutation } from "./useMutation";

import copyShiftPositionMutation from "@/graphql-client/mutations/copyShiftPosition.graphql";
import createShiftPositionMutation from "@/graphql-client/mutations/createShiftPosition.graphql";
import deleteShiftPositionMutation from "@/graphql-client/mutations/deleteShiftPosition.graphql";
import moveShiftPositionMutation from "@/graphql-client/mutations/moveShiftPosition.graphql";
import updateShiftPositionMutation from "@/graphql-client/mutations/updateShiftPosition.graphql";

export interface UseTeamShiftActions {
  moveShiftPosition: (pk: string, sk: string, day: string) => Promise<void>;
  copyShiftPosition: (pk: string, sk: string, day: string) => Promise<void>;
  deleteShiftPosition: (pk: string, sk: string) => Promise<void>;
  createShiftPosition: (input: CreateShiftPositionInput) => Promise<boolean>;
  updateShiftPosition: (input: UpdateShiftPositionInput) => Promise<boolean>;
}

export interface UseTeamShiftActionsOptions {
  refetch?: () => void;
}

export const useTeamShiftActions = (
  options?: UseTeamShiftActionsOptions
): UseTeamShiftActions => {
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
          options?.refetch?.();
          return true;
        }
        return false;
      },
      [createShiftPosition, options?.refetch]
    ),
    updateShiftPosition: useCallback(
      async (input) => {
        const result = await updateShiftPosition({ input });
        if (!result.error) {
          toast.success(i18n.t("Shift position updated"));
          options?.refetch?.();
          return true;
        }
        return false;
      },
      [updateShiftPosition, options?.refetch]
    ),
    moveShiftPosition: useCallback(
      async (pk, sk, day) => {
        const result = await moveShiftPosition({
          input: { pk, sk, day },
        });
        if (!result.error) {
          toast.success(i18n.t("Shift position moved"));
          options?.refetch?.();
        }
      },
      [moveShiftPosition, options?.refetch]
    ),
    copyShiftPosition: useCallback(
      async (pk, sk, day) => {
        const result = await copyShiftPosition({
          input: { pk, sk, day },
        });
        if (!result.error) {
          toast.success(i18n.t("Shift position copied"));
          options?.refetch?.();
        }
      },
      [copyShiftPosition, options?.refetch]
    ),
    deleteShiftPosition: useCallback(
      async (pk, sk) => {
        const result = await deleteShiftPosition({ input: { pk, sk } });
        if (!result.error) {
          toast.success(i18n.t("Shift position deleted"));
          options?.refetch?.();
        }
      },
      [deleteShiftPosition, options?.refetch]
    ),
  };
};
