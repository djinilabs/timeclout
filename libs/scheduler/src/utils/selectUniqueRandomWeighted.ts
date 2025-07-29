import { i18n } from "@/locales";
import { selectRandomWeighted } from "./selectRandomWeighted";

export const selectUniqueRandomWeighted = <T>(
  from: Array<T>,
  weights: Array<number>,
  count: number
): Array<T> => {
  if (count > from.length) {
    throw new TypeError(i18n._("not enough items to select"));
  }
  const selected: Array<T> = [];
  for (let i = 0; i < count; i++) {
    const tryFrom = selectRandomWeighted(
      from.filter((v) => !selected.includes(v)),
      weights.filter((_, index) => !selected.includes(from[index] as T))
    );
    if (tryFrom == null) {
      throw new TypeError(i18n._("tryFrom is undefined"));
    }
    selected.push(tryFrom);
  }
  return selected;
};
