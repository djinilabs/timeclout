export const getDefined = <T>(
  value: T | null | undefined,
  errorMessage = "Value is null or undefined"
): T => {
  if (value === null || value === undefined) {
    throw new Error(errorMessage);
  }
  return value;
};
