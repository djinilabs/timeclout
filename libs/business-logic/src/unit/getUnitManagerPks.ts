import { getEntitySettings } from "../entity/getEntitySettings";

import { ResourceRef, unique } from "@/utils";

export const getUnitManagersPks = async (
  unitPks: ResourceRef[]
): Promise<ResourceRef[]> => {
  const results = await Promise.all(
    unitPks.map(async (unitPk) =>
      getEntitySettings<"managers">(unitPk, "managers")
    )
  );
  return unique(
    results.flat().filter(Boolean)
  ) as ResourceRef[];
};
