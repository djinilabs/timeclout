import { useMemo } from "react";
import { useSearchParams } from "react-router";

export interface UseSearchParamReturnValue<T extends string> {
  current: T | null;
  set: (newValue: T | null) => unknown;
  params: URLSearchParams;
}

export const useSearchParam = <T extends string>(
  paramName: string
): UseSearchParamReturnValue<T> => {
  const [params, setParams] = useSearchParams();
  return useMemo(
    () => ({
      current: params.get(paramName) as T | null,
      set: (newValue: T | null) => {
        if (newValue === null) {
          params.delete(paramName);
          setParams(params);
        } else {
          console.log("setting params", params);
          params.set(paramName, newValue);
          setParams(params);
        }
      },
      params,
    }),
    [params, paramName, setParams]
  );
};
