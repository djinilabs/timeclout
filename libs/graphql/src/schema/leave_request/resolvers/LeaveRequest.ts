import { ResourceRef } from "@/utils";
import type { LeaveRequestResolvers, User } from "./../../../types.generated";
import { database } from "@/tables";
import { parseLeaveRequestPk } from "@/business-logic";

export const LeaveRequest: LeaveRequestResolvers = {
  /* Implement LeaveRequest resolver logic here */
  async approvedBy(leaveRequest) {
    if (!leaveRequest.approvedBy) {
      return null;
    }
    const { entity } = await database();
    console.log("leaveRequest.approvedBy", leaveRequest.approvedBy);
    const users = await Promise.all(
      leaveRequest.approvedBy.map(async (userRef) => {
        return entity.get(
          userRef as unknown as ResourceRef
        ) as unknown as Promise<User>;
      })
    );
    console.log("users", users);
    return users;
  },
  createdBy: async (parent) => {
    const { entity } = await database();
    return entity.get(
      parent.createdBy as unknown as ResourceRef
    ) as unknown as Promise<User>;
  },
  beneficiary: async (parent) => {
    const { entity } = await database();
    const { userRef } = parseLeaveRequestPk(parent.pk);
    return entity.get(userRef) as unknown as Promise<User>;
  },
};
