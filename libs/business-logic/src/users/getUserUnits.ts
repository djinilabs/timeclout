import { database, EntityRecord } from "@/tables";
import { ResourceRef } from "@/utils";
import { getEntityPksUserHasPermissionFor } from "../permission/getEntityPksUserHasPermissionFor";

export const getUserUnits = async (
  userRef: ResourceRef
): Promise<EntityRecord[]> => {
  const { entity } = await database();
  const unitRefs = await getEntityPksUserHasPermissionFor(userRef, "units");
  const units = (
    await Promise.all(unitRefs.map((unitRef) => entity.get(unitRef)))
  ).filter(Boolean) as EntityRecord[];
  return units;
};
