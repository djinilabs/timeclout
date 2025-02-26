// @ts-ignore
import { database } from "@/tables";
import { getUserAuthorizationLevelForResource } from "@/business-logic";
import { resourceRef } from "@/utils";
import { CompanyResolvers, Unit, User } from "../../../types.generated";
import { getAuthorized } from "../../../auth/getAuthorized";
import { requireSession } from "../../../session/requireSession";

export const Company: CompanyResolvers = {
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
    return entity.get(
      parent.updatedBy as unknown as string
    ) as unknown as Promise<User>;
  },
  units: async (_parent, _args, ctx) => {
    const { entity } = await database();
    const permissions = await getAuthorized(ctx, "units");
    return entity.batchGet(permissions.map((p) => p.pk)) as unknown as Promise<
      Unit[]
    >;
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
