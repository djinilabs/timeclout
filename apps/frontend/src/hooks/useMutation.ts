import { useEffect } from "react";
import toast from "react-hot-toast";
import { useMutation as urqlUseMutation } from "urql";
import { AnyVariables, DocumentInput } from "@urql/core";

export const useMutation = <
  TData,
  TVariables extends AnyVariables = AnyVariables,
>(
  mutation: DocumentInput<TData, TVariables>
) => {
  const [result, executeMutation] = urqlUseMutation(mutation);
  useEffect(() => {
    if (result.error) {
      console.log("result.error", result.error.message);
      toast.error("Error: " + result.error.message);
    }
  }, [result.error]);
  return [result, executeMutation] as const;
};
