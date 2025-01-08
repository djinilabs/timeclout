import { useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery as urqlUseQuery } from "urql";

type UseQueryProps<TData = any> = Parameters<typeof urqlUseQuery<TData>>[0] & {
  pollingIntervalMs?: number;
};

export const useQuery = <TData = any>({
  pollingIntervalMs,
  ...props
}: UseQueryProps<TData>): ReturnType<typeof urqlUseQuery<TData>> => {
  const [result, reexecuteQuery] = urqlUseQuery(props);
  useEffect(() => {
    let handle: string | undefined;
    if (result.error) {
      console.error(result.error);
      handle = toast.error("Error fetching companies: " + result.error.message);
    }
    return () => {
      if (handle) {
        toast.remove(handle);
      }
    };
  }, [result.error]);

  useEffect(() => {
    if (pollingIntervalMs) {
      const interval = setInterval(() => reexecuteQuery(), pollingIntervalMs);
      return () => clearInterval(interval);
    }
  }, [pollingIntervalMs, reexecuteQuery]);

  return [result, reexecuteQuery] as const;
};
