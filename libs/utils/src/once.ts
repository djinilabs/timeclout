export const once = <T>(fn: () => T): (() => T) => {
  let called = false;
  let result: T | null = null;
  return () => {
    if (!called) {
      called = true;
      result = fn();
    }
    return result as T;
  };
};
