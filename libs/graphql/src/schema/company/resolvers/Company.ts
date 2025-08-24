import { getAuthorized } from "../../../auth/getAuthorized";
import { requireSession } from "../../../session/requireSession";
import { CompanyResolvers, Unit, User } from "../../../types.generated";

import { getUserAuthorizationLevelForResource } from "@/business-logic";
import { database, EntityRecord } from "@/tables";
import { resourceRef, getResourceRef } from "@/utils";


export const Company: CompanyResolvers = {
  createdBy: async (parent, _arguments, context) => {
    // Cast to access the raw database field where createdBy is a string
    const userReference = (parent as unknown as { createdBy: string }).createdBy;
    const user = await context.userCache.getUser(getResourceRef(userReference));
    return user as unknown as User;
  },
  updatedBy: async (parent, _arguments, context) => {
    // Cast to access the raw database field where updatedBy is a string
    const userReference = (parent as unknown as { updatedBy?: string }).updatedBy;
    if (!userReference) {
      return null;
    }
    const user = await context.userCache.getUser(getResourceRef(userReference));
    return user as unknown as User;
  },
  units: async (parent, _arguments, context) => {
    const { entity } = await database();
    const permissions = await getAuthorized(context, "units");
    const units = await (entity.batchGet(
      permissions.map((p) => p.pk)
    ) as unknown as Promise<Unit[]>);
    return units.filter((u) => (u as unknown as EntityRecord).parentPk === parent.pk);
  },
  settings: async (parent, arguments_) => {
    const { entity_settings } = await database();
    const result = await entity_settings.get(parent.pk, arguments_.name);
    return result?.settings;
  },
  resourcePermission: async (parent, _, context) => {
    const session = await requireSession(context);
    return session.user?.id
      ? getUserAuthorizationLevelForResource(
          resourceRef("companies", parent.pk),
          resourceRef("users", session.user.id)
        )
      : null;
  },
};
