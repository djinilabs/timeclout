import type { LeaveRequestResolvers, User } from "./../../../types.generated";

import { getResourceRef } from "@/utils";

export const LeaveRequest: LeaveRequestResolvers = {
  /* Implement LeaveRequest resolver logic here */
  async approvedBy(leaveRequest, _args, ctx) {
    if (!leaveRequest.approvedBy || leaveRequest.approvedBy.length === 0) {
      return [];
    }

    const approvedBy = await Promise.all(
      leaveRequest.approvedBy
        .filter((userRef) => userRef != null)
        .map(async (userRef) => {
          // Cast to access the raw database field where approvedBy is an array of strings
          const user = await ctx.userCache.getUser(
            getResourceRef(userRef as unknown as string)
          );
          return user as unknown as User | null;
        })
    );

    return approvedBy.filter(Boolean) as User[];
  },
  async beneficiary(leaveRequest, _args, ctx) {
    // The beneficiary is the user who is requesting the leave (stored as userPk)
    const userRef = (leaveRequest as unknown as { userPk: string }).userPk;
    if (!userRef) {
      return null;
    }
    const user = await ctx.userCache.getUser(getResourceRef(userRef));
    return user as unknown as User | null;
  },
  async createdBy(leaveRequest, _args, ctx) {
    // Cast to access the raw database field where createdBy is a string
    const userRef = (leaveRequest as unknown as { createdBy?: string })
      .createdBy;
    if (!userRef) {
      return null;
    }
    const user = await ctx.userCache.getUser(getResourceRef(userRef));
    return user as unknown as User | null;
  },
};
