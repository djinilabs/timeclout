import { getAuthorized } from "../../../auth/getAuthorized";
import { requireSession } from "../../../session/requireSession";
import { CompanyResolvers, Unit, User } from "../../../types.generated";

import { getUserAuthorizationLevelForResource } from "@/business-logic";
import { database, EntityRecord } from "@/tables";
import { resourceRef, getResourceRef } from "@/utils";

export const Company: CompanyResolvers = {
  createdBy: async (parent, _args, ctx) => {
    // Cast to access the raw database field where createdBy is a string
    const userRef = (parent as unknown as { createdBy?: string }).createdBy;
    if (!userRef) {
      return null;
    }
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
  units: async (parent, _args, ctx) => {
    const { entity } = await database();
    const permissions = await getAuthorized(ctx, "units");
    const units = (
      await (entity.batchGet(
        permissions.map((p) => p.pk)
      ) as unknown as Promise<Unit[]>)
    ).filter((u) => (u as unknown as EntityRecord).parentPk === parent.pk);
    
    // Sort by creation date to ensure consistent ordering
    return units.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB;
    });
  },
  settings: async (parent, args) => {
    const { entity_settings } = await database();
    return (await entity_settings.get(parent.pk, args.name))?.settings;
  },
  resourcePermission: async (parent, _, ctx) => {
    const session = await requireSession(ctx);
    return session.user?.id
      ? getUserAuthorizationLevelForResource(
          resourceRef("companies", parent.pk),
          resourceRef("users", session.user.id)
        )
      : null;
  },
};
