import type { LeaveRequestResolvers, User } from "./../../../types.generated";

import { getResourceRef } from "@/utils";

export const LeaveRequest: LeaveRequestResolvers = {
  /* Implement LeaveRequest resolver logic here */
  async approvedBy(leaveRequest, _arguments, context) {
    if (!leaveRequest.approvedBy) {
      return null;
    }
    return Promise.all(
      leaveRequest.approvedBy.map(async (userReference) => {
        // Cast to access the raw database field where approvedBy is an array of strings
        const user = await context.userCache.getUser(
          getResourceRef(userReference as unknown as string)
        );
        return user as unknown as User;
      })
    );
  },
  async beneficiary(leaveRequest, _arguments, context) {
    // Cast to access the raw database field where beneficiary is a string
    const userReference = (leaveRequest as unknown as { beneficiary: string })
      .beneficiary;
    const user = await context.userCache.getUser(getResourceRef(userReference));
    return user as unknown as User;
  },
  async createdBy(leaveRequest, _arguments, context) {
    // Cast to access the raw database field where createdBy is a string
    const userReference = (leaveRequest as unknown as { createdBy: string })
      .createdBy;
    const user = await context.userCache.getUser(getResourceRef(userReference));
    return user as unknown as User;
  },
};
