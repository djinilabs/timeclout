import { selectRandomWeighted } from "./selectRandomWeighted";

export const selectUniqueRandomWeighted = <T>(
  from: Array<T>,
  weights: Array<number>,
  count: number
): Array<T> => {
  if (count > from.length) {
    throw new TypeError("count must be smaller or equal to from array");
  }
  const selected: Array<T> = [];
  for (let i = 0; i < count; i++) {
    let tryFrom: T;
    tryFrom = selectRandomWeighted(
      from.filter((v) => !selected.includes(v)),
      weights.filter((_, index) => !selected.includes(from[index] as T))
    );
    if (tryFrom == null) {
      throw new TypeError("tryFrom is undefined");
    }
    selected.push(tryFrom);
  }
  return selected;
};
