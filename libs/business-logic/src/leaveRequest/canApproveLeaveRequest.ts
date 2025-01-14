import { ResourceRef } from "@/utils";

import { EntityRecord } from "@/tables";
import { parseLeaveRequestPk } from "./parseLeaveRequestPk";
import { getUserUnitsPks } from "../users";
import { getUnitManagersPks } from "../unit";

export const canApproveLeaveRequest = async (
  userPk: ResourceRef,
  leaveRequestPk: string
) => {
  const { companyRef } = parseLeaveRequestPk(leaveRequestPk);
  // get all units for user
  const unitPks = await getUserUnitsPks(userPk);

  // get all unit managers
  const unitManagerPks = await getUnitManagersPks(unitPks);

  return unitManagerPks.includes(userPk);
};
