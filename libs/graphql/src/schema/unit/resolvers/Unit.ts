import { database } from "@/tables";
import type { Team, UnitResolvers, User } from "./../../../types.generated";
import { getAuthorized } from "../../../../src/auth/getAuthorized";

export const Unit: UnitResolvers = {
  createdBy: async (parent) => {
    const { entity } = await database();
    const user = await entity.get(parent.createdBy as unknown as string);
    return user as unknown as User;
  },
  updatedBy: async (parent) => {
    if (!parent.updatedBy) {
      return null;
    }
    const { entity } = await database();
    return entity.get(parent.updatedBy as unknown as string) as unknown as User;
  },
  teams: async (parent, _args, ctx) => {
    const permissions = await getAuthorized(ctx, "teams");
    const { entity } = await database();
    return entity.batchGet(permissions.map((p) => p.pk)) as unknown as Team[];
  },
};
