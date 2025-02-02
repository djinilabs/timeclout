import moveShiftPositionMutation from "@/graphql-client/mutations/moveShiftPosition.graphql";
import copyShiftPositionMutation from "@/graphql-client/mutations/copyShiftPosition.graphql";
import { useMutation } from "./useMutation";
import { useCallback } from "react";
import toast from "react-hot-toast";

export interface UseTeamShiftActions {
  moveShiftPosition: (pk: string, sk: string, day: string) => Promise<void>;
  copyShiftPosition: (pk: string, sk: string, day: string) => Promise<void>;
}

export const useTeamShiftActions = (): UseTeamShiftActions => {
  const [, moveShiftPosition] = useMutation(moveShiftPositionMutation);
  const [, copyShiftPosition] = useMutation(copyShiftPositionMutation);

  return {
    moveShiftPosition: useCallback(
      async (pk, sk, day) => {
        const result = await moveShiftPosition({
          input: { pk, sk, day },
        });
        if (!result.error) {
          toast.success("Shift position moved");
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
          toast.success("Shift position copied");
        }
      },
      [copyShiftPosition]
    ),
  };
};
