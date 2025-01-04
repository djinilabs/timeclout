import { database } from "@/tables";

import type { TeamResolvers } from "./../../../types.generated";
export const Team: TeamResolvers = {
  createdBy: async (parent) => {
    const { entity } = await database();
    const user = await entity.get(parent.createdBy as unknown as string);
    return user;
  },
  updatedBy: async (parent) => {
    if (!parent.updatedBy) {
      return null;
    }
    const { entity } = await database();
    return entity.get(parent.updatedBy as unknown as string);
  },
};
