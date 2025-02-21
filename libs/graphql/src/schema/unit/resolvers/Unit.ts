import { database, PERMISSION_LEVELS } from "@/tables";
import { getAuthorizedForResource } from "@/business-logic";
import { getResourceRef } from "@/utils";
import type { Team, UnitResolvers, User } from "./../../../types.generated";
import { getAuthorized } from "../../../../src/auth/getAuthorized";
import { ensureAuthorized } from "../../../../src/auth/ensureAuthorized";

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
  teams: async (_parent, _args, ctx) => {
    const permissions = await getAuthorized(ctx, "teams");
    const { entity } = await database();
    return entity.batchGet(permissions.map((p) => p.pk)) as unknown as Team[];
  },
  members: async (parent, _args, ctx) => {
    await ensureAuthorized(
      ctx,
      getResourceRef(parent.pk),
      PERMISSION_LEVELS.WRITE
    );
    const permissions = await getAuthorizedForResource(
      getResourceRef(parent.pk)
    );
    const { entity } = await database();
    const users = (await entity.batchGet(
      permissions.map((p) => p.sk)
    )) as unknown as User[];
    console.log("members of unit:", users);
    return users;
  },
  settings: async (parent, args) => {
    const { entity_settings } = await database();
    return (await entity_settings.get(parent.pk, args.name))?.settings;
  },
};
