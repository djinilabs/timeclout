import { requireSessionUser } from "../../../../session/requireSessionUser";

import type {
  LeaveRequest,
  QueryResolvers,
} from "./../../../../types.generated";

import { getUserPendingLeaveRequests } from "@/business-logic";
import { getResourceRef, resourceRef } from "@/utils";

export const pendingLeaveRequests: NonNullable<QueryResolvers['pendingLeaveRequests']> = async (_parent, { companyPk }, context) => {
  const user = await requireSessionUser(context);
  const leaveRequests = await getUserPendingLeaveRequests(
    getResourceRef(user.pk),
    companyPk == undefined ? null : resourceRef("companies", companyPk)
  );
  return leaveRequests.sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  ) as unknown as LeaveRequest[];
};
