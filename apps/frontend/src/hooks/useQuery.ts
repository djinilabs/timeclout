import { AnyVariables } from "@urql/core";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery as urqlUseQuery, UseQueryArgs } from "urql";

import { formatErrorForToast } from "../utils/errorMessages";

import { useIsFetching } from "./useIsFetching";

type ExtendedUseQueryProps<
  TData = unknown,
  TVariables extends AnyVariables = AnyVariables
> = UseQueryArgs<TVariables, TData> & {
  pollingIntervalMs?: number;
  toastIfError?: boolean;
};

export const useQuery = <
  TData = unknown,
  TVariables extends AnyVariables = AnyVariables
>({
  pollingIntervalMs,
  toastIfError = true,
  ...props
}: ExtendedUseQueryProps<TData, TVariables>): ReturnType<
  typeof urqlUseQuery<TData, TVariables>
> => {
  const [result, reexecuteQuery] = urqlUseQuery<TData, TVariables>(
    props as UseQueryArgs<TVariables, TData>
  );
  useEffect(() => {
    let handle: string | undefined;
    if (result.error) {
      console.error("Query error:", result.error);
      if (toastIfError) {
        const friendlyError = formatErrorForToast(result.error);
        handle = toast.error(friendlyError, {
          duration: 5000,
        });
      }
    }
    return () => {
      if (handle) {
        toast.remove(handle);
      }
    };
  }, [result.error, toastIfError]);

  const isFetching = useIsFetching();

  useEffect(() => {
    if (pollingIntervalMs) {
      const interval = setInterval(() => {
        if (!isFetching && !result.fetching) {
          reexecuteQuery();
        }
      }, pollingIntervalMs);
      return () => clearInterval(interval);
    }
  }, [pollingIntervalMs, reexecuteQuery, result.fetching, isFetching]);

  return [result, reexecuteQuery] as const;
};
