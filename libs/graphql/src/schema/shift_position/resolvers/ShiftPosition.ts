import type { ShiftPositionResolvers, User } from "./../../../types.generated";
import { getResourceRef } from "@/utils";

export const ShiftPosition: ShiftPositionResolvers = {
  assignedTo: async (parent, _args, ctx) => {
    // Cast to access the raw database field where assignedTo is a string
    const userRef = (parent as { assignedTo?: string }).assignedTo;
    if (!userRef) {
      return null;
    }
    const user = await ctx.userCache.getUser(getResourceRef(userRef));
    return user as unknown as User;
  },
};
