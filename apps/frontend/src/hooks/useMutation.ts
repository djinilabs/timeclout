import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  AnyVariables,
  DocumentInput,
  useMutation as urqlUseMutation,
} from "urql";

export const useMutation = <
  TData,
  TVariables extends AnyVariables = AnyVariables,
>(
  mutation: DocumentInput<TData, TVariables>
) => {
  const [result, executeMutation] = urqlUseMutation(mutation);
  useEffect(() => {
    if (result.error) {
      toast.error("Error: " + result.error.message);
    }
  }, [result.error]);
  return [result, executeMutation] as const;
};
