import { getUnitPksTheUserManages } from "../unit/getUnitPksTheUserManages";

import { database } from "@/tables";
import { getDefined, getResourceRef, ResourceRef } from "@/utils";

export const getCompanyPksTheUserManages = async (
  userPk: ResourceRef
): Promise<ResourceRef[]> => {
  const unitPks = await getUnitPksTheUserManages(userPk);
  console.log("unitPks", unitPks);

  const { entity } = await database();
  const unitResults = await Promise.all(
    unitPks.map(async (unitPk) => {
      const unit = await entity.get(unitPk);
      return unit?.parentPk;
    })
  );
  return unitResults.map((r) => getResourceRef(getDefined(r)));
};
