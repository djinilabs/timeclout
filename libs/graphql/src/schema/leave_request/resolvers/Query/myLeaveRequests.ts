import { userLeaveRequests } from "@/business-logic";
import { resourceRef } from "@/utils";
import { requireSessionUser } from "../../../../session/requireSessionUser";
import type {
  LeaveRequest,
  QueryResolvers,
} from "./../../../../types.generated";

export const myLeaveRequests: NonNullable<QueryResolvers['myLeaveRequests']> = async (_parent, { companyPk }, ctx) => {
  const user = await requireSessionUser(ctx);
  return (
    await userLeaveRequests(
      resourceRef("companies", companyPk),
      resourceRef("users", user.pk)
    )
  ).sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  ) as unknown as LeaveRequest[];
};
