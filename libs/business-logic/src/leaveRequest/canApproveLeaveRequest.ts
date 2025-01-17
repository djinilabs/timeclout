import { ResourceRef } from "@/utils";

import { EntityRecord } from "@/tables";
import { parseLeaveRequestPk } from "./parseLeaveRequestPk";
import { getUserUnitsPks } from "../users";
import { getUnitManagersPks } from "../unit";
import { getUserUnits } from "../users/getUserUnits";

export const canApproveLeaveRequest = async (
  userPk: ResourceRef,
  leaveRequestPk: string
): Promise<boolean> => {
  const { companyRef } = parseLeaveRequestPk(leaveRequestPk);
  // get all units for user
  const units = await getUserUnits(userPk);
  if (!units.some((unit) => unit.parentPk === companyRef)) {
    return false;
  }

  // get all unit managers
  const unitManagerPks = await getUnitManagersPks(
    units.map((unit) => unit.pk as ResourceRef)
  );

  return unitManagerPks.includes(userPk);
};
