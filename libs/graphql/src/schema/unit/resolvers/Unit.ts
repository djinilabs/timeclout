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
  teams: async (_parent, _arguments, context) => {
    const permissions = await getAuthorized(context, "teams");
    const { entity } = await database();
    const teams = await entity.batchGet(permissions.map((p) => p.pk));
    return teams as unknown as Team[];
  },
  members: async (parent, _arguments, context) => {
    await ensureAuthorized(
      context,
      getResourceRef(parent.pk),
      PERMISSION_LEVELS.WRITE
    );
    const permissions = await getAuthorizedForResource(
      getResourceRef(parent.pk)
    );
    const { entity } = await database();
    const usersResult = await entity.batchGet(
      permissions.map((p) => p.sk)
    );
    const users = usersResult as unknown as User[];
    console.log("members of unit:", users);
    return users;
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
