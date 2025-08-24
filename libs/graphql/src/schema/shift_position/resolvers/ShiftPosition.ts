import type { ShiftPositionResolvers, User } from "./../../../types.generated";

import { getResourceRef } from "@/utils";

export const ShiftPosition: ShiftPositionResolvers = {
  assignedTo: async (parent, _arguments, context) => {
    // Cast to access the raw database field where assignedTo is a string
    const userReference = (parent as { assignedTo?: string }).assignedTo;
    if (!userReference) {
      return null;
    }
    const user = await context.userCache.getUser(getResourceRef(userReference));
    return user as unknown as User;
  },
};
