export const decreasingRandomLinearWeights = (
  length: number
): Array<number> => {
  return Array.from({ length }, (_, index) => Math.random() * (length - index));
};
