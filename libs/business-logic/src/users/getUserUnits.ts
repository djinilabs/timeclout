import { getEntityPksUserHasPermissionFor } from "../permission/getEntityPksUserHasPermissionFor";

import { database, EntityRecord } from "@/tables";
import { ResourceRef } from "@/utils";

export const getUserUnits = async (
  userReference: ResourceRef
): Promise<EntityRecord[]> => {
  const { entity } = await database();
  const unitReferences = await getEntityPksUserHasPermissionFor(userReference, "units");
  const unitResults = await Promise.all(unitReferences.map((unitReference) => entity.get(unitReference)));
  const units = unitResults.filter(Boolean) as EntityRecord[];
  return units;
};
