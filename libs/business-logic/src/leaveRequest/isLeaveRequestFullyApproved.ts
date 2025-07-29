import { LeaveRequestRecord } from "@/tables";
import { parseLeaveRequestPk } from "./parseLeaveRequestPk";
import { getUserUnitsPks } from "../users/getUserUnitsPks";
import { getUnitManagersPks } from "../unit/getUnitManagerPks";
import { notFound } from "@hapi/boom";
import { i18n } from "@/locales";

export const isLeaveRequestFullyApproved = async (
  leaveRequest: LeaveRequestRecord
) => {
  if (leaveRequest.approved) {
    return true;
  }
  const { userRef } = parseLeaveRequestPk(leaveRequest.pk);
  const unitPks = await getUserUnitsPks(userRef);
  const unitManagerPks = await getUnitManagersPks(unitPks);
  if (unitManagerPks.length === 0) {
    throw notFound(
      i18n._("No unit managers found for the units the user is in")
    );
  }

  return unitManagerPks.every(
    (managerPk) =>
      leaveRequest.approvedBy?.includes(managerPk) ||
      leaveRequest.createdBy === managerPk
  );
};
