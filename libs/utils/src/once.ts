export const once = <T>(function_: () => T): (() => T) => {
  let called = false;
  let result: T | null = null;
  return () => {
    if (!called) {
      called = true;
      result = function_();
    }
    return result as T;
  };
};
