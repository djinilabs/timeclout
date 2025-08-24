export const variance = (mean: number, values: number[]): number => {
  return (
    values.reduce((accumulator, value) => accumulator + (value - mean) ** 2, 0) / values.length
  );
};
