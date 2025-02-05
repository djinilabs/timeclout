export const selectRandomWeighted = <T>(
  from: Array<T>,
  weights: Array<number>
): T => {
  if (from.length !== weights.length) {
    throw new TypeError("from and weights must have the same length");
  }

  const cumulativeWeights = [];
  let totalWeights = 0;

  for (const weight of weights) {
    totalWeights += weight;
    cumulativeWeights.push(totalWeights);
  }

  const randomNumber = Math.floor(Math.random() * totalWeights);
  for (const [index, weight] of cumulativeWeights.entries()) {
    if (randomNumber <= weight) {
      return from[index] as T;
    }
  }

  throw new Error("No element selected");
};
