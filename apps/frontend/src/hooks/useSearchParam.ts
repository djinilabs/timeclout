import { useMemo } from "react";
import { useSearchParams } from "react-router";

export interface UseSearchParameterReturnValue<T extends string> {
  current: T | null;
  set: (newValue: T | null) => unknown;
  params: URLSearchParams;
}

export const useSearchParam = <T extends string>(
  parameterName: string
): UseSearchParameterReturnValue<T> => {
  const [parameters, setParameters] = useSearchParams();
  return useMemo(
    () => ({
      current: parameters.get(parameterName) as T | null,
      set: (newValue: T | null) => {
        if (newValue === null) {
          parameters.delete(parameterName);
          setParameters(parameters);
        } else {
          console.log("setting params", parameters);
          parameters.set(parameterName, newValue);
          setParameters(parameters);
        }
      },
      params: parameters,
    }),
    [parameters, parameterName, setParameters]
  );
};
