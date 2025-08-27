import { getUnitManagersPks } from "../unit/getUnitManagerPks";
import { getUserUnitsPks } from "../users/getUserUnitsPks";

import { parseLeaveRequestPk } from "./parseLeaveRequestPk";

import { LeaveRequestRecord } from "@/tables";

export const isLeaveRequestFullyApproved = async (
  leaveRequest: LeaveRequestRecord
) => {
  if (leaveRequest.approved) {
    return true;
  }
  const { userRef } = parseLeaveRequestPk(leaveRequest.pk);
  const unitPks = await getUserUnitsPks(userRef);
  const unitManagerPks = await getUnitManagersPks(unitPks);

  // If there are no unit managers, the leave request is considered fully approved
  if (unitManagerPks.length === 0) {
    return true;
  }

  return unitManagerPks.every(
    (managerPk) =>
      leaveRequest.approvedBy?.includes(managerPk) ||
      leaveRequest.createdBy === managerPk
  );
};
