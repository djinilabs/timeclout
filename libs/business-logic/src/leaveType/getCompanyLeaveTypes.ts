import { getDefined } from "@/utils";
import { LeaveType, LeaveTypes } from "@/settings";
import { getEntitySettings } from "../entity/getEntitySettings";

export const getCompanyLeaveTypes = async (
  companyRef: string
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
