import { notFound } from "@hapi/boom";

import { getUnitManagersPks } from "../unit";
import { getUserUnits } from "../users/getUserUnits";

import { parseLeaveRequestPk } from "./parseLeaveRequestPk";

import { i18n } from "@/locales";
import { ResourceRef } from "@/utils";

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
  if (unitManagerPks.length === 0) {
    throw notFound(
      i18n._("No unit managers found for the units the user is in")
    );
  }

  return unitManagerPks.includes(userPk);
};
