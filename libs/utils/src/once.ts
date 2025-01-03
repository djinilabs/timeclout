import { getDefined } from "./getDefined";

export const once = <T>(fn: () => NonNullable<T>): (() => NonNullable<T>) => {
  let called = false;
  let result: T | null = null;
  return () => {
    if (!called) {
      called = true;
      result = fn();
    }
    return getDefined(result);
  };
};
