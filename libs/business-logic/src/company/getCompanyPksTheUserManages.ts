import { getDefined, getResourceRef, ResourceRef } from "@/utils";
import { getEntityPksUserHasPermissionFor } from "../permission/getEntityPksUserHasPermissionFor";
import { getUnitPksTheUserManages } from "../unit/getUnitPksTheUserManages";
import { database } from "@/tables";

export const getCompanyPksTheUserManages = async (
  userPk: ResourceRef
): Promise<ResourceRef[]> => {
  const unitPks = await getUnitPksTheUserManages(userPk);
  console.log("unitPks", unitPks);

  const { entity } = await database();
  return (
    await Promise.all(
      unitPks.map(async (unitPk) => (await entity.get(unitPk))?.parentPk)
    )
  ).map((r) => getResourceRef(getDefined(r)));
};
