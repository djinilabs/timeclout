import { database } from "@/tables";
import type { ShiftPositionResolvers, User } from "./../../../types.generated";
import { getResourceRef } from "@/utils";
export const ShiftPosition: ShiftPositionResolvers = {
  assignedTo: async (parent) => {
    const userRef = parent.assignedTo;
    if (!userRef) {
      return null;
    }
    const { entity } = await database();
    return entity.get(
      getResourceRef(parent.assignedTo as unknown as string)
    ) as unknown as User;
  },
};
