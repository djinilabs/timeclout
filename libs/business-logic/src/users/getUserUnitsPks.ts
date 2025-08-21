import { getUserUnits } from "./getUserUnits";

import { ResourceRef } from "@/utils";

export const getUserUnitsPks = async (
  userRef: ResourceRef
): Promise<ResourceRef[]> =>
  (await getUserUnits(userRef)).map((unit) => unit.pk) as ResourceRef[];
