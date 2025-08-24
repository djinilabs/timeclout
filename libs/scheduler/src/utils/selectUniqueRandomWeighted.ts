import { selectRandomWeighted } from "./selectRandomWeighted";

import { i18n } from "@/locales";

export const selectUniqueRandomWeighted = <T>(
  from: Array<T>,
  weights: Array<number>,
  count: number
): Array<T> => {
  if (count > from.length) {
    throw new TypeError(i18n._("not enough items to select"));
  }
  const selected: Array<T> = [];
  for (let index = 0; index < count; index++) {
    const tryFrom = selectRandomWeighted(
      from.filter((v) => !selected.includes(v)),
      weights.filter((_, index) => !selected.includes(from[index] as T))
    );
    if (tryFrom == undefined) {
      throw new TypeError(i18n._("tryFrom is undefined"));
    }
    selected.push(tryFrom);
  }
  return selected;
};
