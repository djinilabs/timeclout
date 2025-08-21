import { notFound } from "@hapi/boom";

import { getUnitManagersPks } from "../unit/getUnitManagerPks";
import { getUserUnitsPks } from "../users/getUserUnitsPks";

import { parseLeaveRequestPk } from "./parseLeaveRequestPk";


import { i18n } from "@/locales";
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
