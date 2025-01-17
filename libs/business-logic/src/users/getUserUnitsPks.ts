import { ResourceRef } from "@/utils";
import { getUserUnits } from "./getUserUnits";

export const getUserUnitsPks = async (
  userRef: ResourceRef
): Promise<ResourceRef[]> =>
  (await getUserUnits(userRef)).map((unit) => unit.pk) as ResourceRef[];
