import { getUserUnits } from "./getUserUnits";

import { ResourceRef } from "@/utils";

export const getUserUnitsPks = async (
  userReference: ResourceRef
): Promise<ResourceRef[]> => {
  const units = await getUserUnits(userReference);
  return units.map((unit) => unit.pk) as ResourceRef[];
};
