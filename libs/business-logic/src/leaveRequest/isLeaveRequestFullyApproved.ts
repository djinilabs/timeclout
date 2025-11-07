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

  /**
   * SECURITY NOTE: If there are no unit managers for the user's units, the leave request is considered fully approved.
   * This logic is intentional to prevent leave requests from being stuck in a pending state with no possible approvers.
   * However, this could be a security concern if units are misconfigured or if managers are accidentally removed.
   * It is assumed that all units should have at least one manager, and unit creation/removal is tightly controlled.
   * If this situation occurs, it should be logged and reviewed by administrators to ensure it is not abused.
   */
  if (unitManagerPks.length === 0) {
    return true;
  }

  return unitManagerPks.some(
    (managerPk) =>
      leaveRequest.approvedBy?.includes(managerPk) ||
      leaveRequest.createdBy === managerPk
  );
};
