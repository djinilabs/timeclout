export const variance = (mean: number, values: number[]): number => {
  return (
    values.reduce((acc, value) => acc + (value - mean) ** 2, 0) / values.length
  );
};
