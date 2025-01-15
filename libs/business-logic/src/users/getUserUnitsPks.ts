import { database } from "@/tables";
import { ResourceRef } from "@/utils";
import { getUserUnits } from "./getUserUnits";

export const getUserUnitsPks = async (userRef: ResourceRef) =>
  (await getUserUnits(userRef)).map((unit) => unit.pk);
