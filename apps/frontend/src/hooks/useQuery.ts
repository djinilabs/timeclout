import { useEffect } from "react";
import toast from "react-hot-toast";
import { AnyVariables, useQuery as urqlUseQuery, UseQueryArgs } from "urql";

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
      console.error(result.error);
      if (toastIfError) {
        handle = toast.error(
          "Error fetching companies: " + result.error.message
        );
      }
    }
    return () => {
      if (handle) {
        toast.remove(handle);
      }
    };
  }, [result.error, toastIfError]);

  useEffect(() => {
    if (pollingIntervalMs) {
      const interval = setInterval(() => reexecuteQuery(), pollingIntervalMs);
      return () => clearInterval(interval);
    }
  }, [pollingIntervalMs, reexecuteQuery]);

  return [result, reexecuteQuery] as const;
};
