import { getResourceRef } from "@/utils";
import type { LeaveRequestResolvers, User } from "./../../../types.generated";

export const LeaveRequest: LeaveRequestResolvers = {
  /* Implement LeaveRequest resolver logic here */
  async approvedBy(leaveRequest, _args, ctx) {
    if (!leaveRequest.approvedBy) {
      return null;
    }
    return Promise.all(
      leaveRequest.approvedBy.map(async (userRef) => {
        // Cast to access the raw database field where approvedBy is an array of strings
        const user = await ctx.userCache.getUser(
          getResourceRef(userRef as unknown as string)
        );
        return user as unknown as User;
      })
    );
  },
  async beneficiary(leaveRequest, _args, ctx) {
    // Cast to access the raw database field where beneficiary is a string
    const userRef = (leaveRequest as unknown as { beneficiary: string })
      .beneficiary;
    const user = await ctx.userCache.getUser(getResourceRef(userRef));
    return user as unknown as User;
  },
  async createdBy(leaveRequest, _args, ctx) {
    // Cast to access the raw database field where createdBy is a string
    const userRef = (leaveRequest as unknown as { createdBy: string })
      .createdBy;
    const user = await ctx.userCache.getUser(getResourceRef(userRef));
    return user as unknown as User;
  },
};
