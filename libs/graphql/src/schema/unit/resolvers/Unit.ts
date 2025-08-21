import { ensureAuthorized } from "../../../auth/ensureAuthorized";
import { getAuthorized } from "../../../auth/getAuthorized";
import { requireSession } from "../../../session/requireSession";

import type { Team, UnitResolvers, User } from "./../../../types.generated";

import {
  getAuthorizedForResource,
  getUserAuthorizationLevelForResource,
} from "@/business-logic";
import { database, EntityRecord, PERMISSION_LEVELS } from "@/tables";
import { getDefined, getResourceRef, resourceRef } from "@/utils";



export const Unit: UnitResolvers = {
  createdBy: async (parent, _args, ctx) => {
    // Cast to access the raw database field where createdBy is a string
    const userRef = (parent as unknown as { createdBy: string }).createdBy;
    const user = await ctx.userCache.getUser(getResourceRef(userRef));
    return user as unknown as User;
  },
  updatedBy: async (parent, _args, ctx) => {
    // Cast to access the raw database field where updatedBy is a string
    const userRef = (parent as unknown as { updatedBy?: string }).updatedBy;
    if (!userRef) {
      return null;
    }
    const user = await ctx.userCache.getUser(getResourceRef(userRef));
    return user as unknown as User;
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
  resourcePermission: async (parent, _, ctx) => {
    const session = await requireSession(ctx);
    return session.user?.id
      ? getUserAuthorizationLevelForResource(
          resourceRef("units", parent.pk),
          resourceRef("users", session.user.id)
        )
      : null;
  },
  companyPk: async (parent) => {
    return getDefined(
      (parent as unknown as EntityRecord).parentPk,
      "no parent pk in unit"
    );
  },
};
