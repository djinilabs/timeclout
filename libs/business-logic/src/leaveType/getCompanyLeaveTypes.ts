import { getDefined, ResourceRef } from "@/utils";
import { LeaveType } from "@/settings";
import { getEntitySettings } from "../entity/getEntitySettings";

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
