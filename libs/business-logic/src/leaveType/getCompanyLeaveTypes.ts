import { getEntitySettings } from "../entity/getEntitySettings";

import { LeaveType } from "@/settings";
import { getDefined, ResourceRef } from "@/utils";

export const getCompanyLeaveTypes = async (
  companyReference: ResourceRef
): Promise<Record<string, LeaveType>> => {
  const leaveTypes = getDefined(
    await getEntitySettings<"leaveTypes">(companyReference, "leaveTypes")
  );
  // group leave types by name
  return leaveTypes.reduce(
    (accumulator, type) => {
      accumulator[type.name] = type;
      return accumulator;
    },
    {} as Record<string, LeaveType>
  );
};
