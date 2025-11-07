import { selectRandom } from "./selectRandom";

import { i18n } from "@/locales";

export const selectUniqueRandom = <T>(
  from: Array<T>,
  count: number
): Array<T> => {
  if (count > from.length) {
    throw new TypeError(i18n._("count must be smaller or equal to from array"));
  }
  const selected: Array<T> = [];
  for (let i = 0; i < count; i++) {
    const tryFrom = selectRandom(from.filter((v) => !selected.includes(v)));
    if (tryFrom == null) {
      throw new TypeError(i18n._("tryFrom is undefined"));
    }
    selected.push(tryFrom);
  }
  return selected;
};
