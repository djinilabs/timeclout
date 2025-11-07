import { AnyVariables, DocumentInput } from "@urql/core";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useMutation as urqlUseMutation } from "urql";

import { formatErrorForToast } from "../utils/errorMessages";

export const useMutation = <
  TData,
  TVariables extends AnyVariables = AnyVariables,
>(
  mutation: DocumentInput<TData, TVariables>
) => {
  const [result, executeMutation] = urqlUseMutation(mutation);
  useEffect(() => {
    if (result.error) {
      console.error("Mutation error:", result.error);
      const friendlyError = formatErrorForToast(result.error);
      toast.error(friendlyError, {
        duration: 5000,
      });
    }
  }, [result.error]);
  return [result, executeMutation] as const;
};
