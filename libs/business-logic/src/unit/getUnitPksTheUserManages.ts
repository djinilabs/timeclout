import { getEntitySettings } from "../entity/getEntitySettings";
import { getUserUnitPks } from "../unit/getUserUnitPks";

import { getDefined, ResourceRef , getResourceRef } from "@/utils";

export const getUnitPksTheUserManages = async (
  userPk: ResourceRef
): Promise<ResourceRef[]> => {
  const unitPks = await getUserUnitPks(userPk);
  return (
    await Promise.all(
      unitPks.map(async (unitPk) => {
        const managers = await getEntitySettings(
          getResourceRef(unitPk),
          "managers"
        );
        if (managers?.includes(userPk)) {
          return unitPk;
        }
      })
    )
  )
    .filter(Boolean)
    .map((r) => getResourceRef(getDefined(r)));
};
