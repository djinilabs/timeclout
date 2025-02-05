import { selectRandom } from "./selectRandom";

export const selectUniqueRandom = <T>(
  from: Array<T>,
  count: number
): Array<T> => {
  if (count > from.length) {
    throw new TypeError("count must be smaller or equal to from array");
  }
  const selected: Array<T> = [];
  for (let i = 0; i < count; i++) {
    let tryFrom: T;
    tryFrom = selectRandom(from.filter((v) => !selected.includes(v)));
    if (tryFrom == null) {
      throw new TypeError("tryFrom is undefined");
    }
    selected.push(tryFrom);
  }
  return selected;
};
