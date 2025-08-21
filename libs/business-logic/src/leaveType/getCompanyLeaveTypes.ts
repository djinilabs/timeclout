import { getEntitySettings } from "../entity/getEntitySettings";

import { LeaveType } from "@/settings";
import { getDefined, ResourceRef } from "@/utils";

export const getCompanyLeaveTypes = async (
  companyRef: ResourceRef
): Promise<Record<string, LeaveType>> => {
  const leaveTypes = getDefined(
    await getEntitySettings<"leaveTypes">(companyRef, "leaveTypes")
  );
  // group leave types by name
  return leaveTypes.reduce(
    (acc, type) => {
      acc[type.name] = type;
      return acc;
    },
    {} as Record<string, LeaveType>
  );
};
