export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};
