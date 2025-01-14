import { LeaveRequestRecord } from "@/tables";
import { parseLeaveRequestPk } from "./parseLeaveRequestPk";
import { getUserUnitsPks } from "../users/getUserUnitsPks";
import { getUnitManagersPks } from "../unit/getUnitManagerPks";

export const isLeaveRequestFullyApproved = async (
  leaveRequest: LeaveRequestRecord
) => {
  if (leaveRequest.approved) {
    return true;
  }
  const { userRef } = parseLeaveRequestPk(leaveRequest.pk);
  const unitPks = await getUserUnitsPks(userRef);
  const unitManagerPks = await getUnitManagersPks(unitPks);

  return unitManagerPks.every(
    (managerPk) =>
      leaveRequest.approvedBy?.includes(managerPk) ||
      leaveRequest.createdBy === managerPk
  );
};
