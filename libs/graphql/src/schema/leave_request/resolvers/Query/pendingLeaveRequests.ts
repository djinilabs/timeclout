import { requireSessionUser } from "../../../../session/requireSessionUser";

import type {
  LeaveRequest,
  QueryResolvers,
} from "./../../../../types.generated";

import { getUserPendingLeaveRequests } from "@/business-logic";
import { getResourceRef, resourceRef } from "@/utils";

export const pendingLeaveRequests: NonNullable<QueryResolvers['pendingLeaveRequests']> = async (_parent, { companyPk }, ctx) => {
  const user = await requireSessionUser(ctx);
  return (
    await getUserPendingLeaveRequests(
      getResourceRef(user.pk),
      companyPk != null ? resourceRef("companies", companyPk) : null
    )
  ).sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  ) as unknown as LeaveRequest[];
};
