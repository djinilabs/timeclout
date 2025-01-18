import { ResourceRef, unique } from "@/utils";
import { getEntitySettings } from "../entity/getEntitySettings";

export const getUnitManagersPks = async (
  unitPks: ResourceRef[]
): Promise<ResourceRef[]> => {
  return unique(
    (
      await Promise.all(
        unitPks.map(async (unitPk) =>
          getEntitySettings<"managers">(unitPk, "managers")
        )
      )
    )
      .flat()
      .filter(Boolean)
  ) as ResourceRef[];
};
