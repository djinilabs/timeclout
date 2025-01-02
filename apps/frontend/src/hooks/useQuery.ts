import { useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery as urqlUseQuery } from "urql";

export const useQuery = <TData = any>(
  ...args: Parameters<typeof urqlUseQuery<TData>>
): ReturnType<typeof urqlUseQuery<TData>> => {
  const [result, reexecuteQuery] = urqlUseQuery(...args);
  useEffect(() => {
    let handle: string | undefined;
    if (result.error) {
      handle = toast.error("Error fetching companies: " + result.error.message);
    }
    return () => {
      if (handle) {
        toast.remove(handle);
      }
    };
  }, [result.error]);
  return [result, reexecuteQuery] as const;
};
