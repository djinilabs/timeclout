import { getUserPendingLeaveRequests } from "@/business-logic";
import { getResourceRef } from "@/utils";
import { requireSessionUser } from "../../../../session/requireSessionUser";
import type {
  LeaveRequest,
  QueryResolvers,
} from "./../../../../types.generated";

export const pendingLeaveRequests: NonNullable<QueryResolvers['pendingLeaveRequests']> = async (_parent, _arg, ctx) => {
  const user = await requireSessionUser(ctx);
  return (await getUserPendingLeaveRequests(getResourceRef(user.pk))).sort(
    (a, b) => a.createdAt.localeCompare(b.createdAt)
  ) as unknown as LeaveRequest[];
};
