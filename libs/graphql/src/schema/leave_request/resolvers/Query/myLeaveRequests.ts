import { requireSessionUser } from "../../../../session/requireSessionUser";

import type {
  LeaveRequest,
  QueryResolvers,
} from "./../../../../types.generated";

import { userLeaveRequests } from "@/business-logic";
import { resourceRef } from "@/utils";

export const myLeaveRequests: NonNullable<QueryResolvers['myLeaveRequests']> = async (_parent, { companyPk }, context) => {
  const user = await requireSessionUser(context);
  const leaveRequests = await userLeaveRequests(
    resourceRef("companies", companyPk),
    resourceRef("users", user.pk)
  );
  return leaveRequests.sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  ) as unknown as LeaveRequest[];
};
