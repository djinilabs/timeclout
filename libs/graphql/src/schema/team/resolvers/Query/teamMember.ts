import { forbidden } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { QueryResolvers, User } from "./../../../../types.generated";

import { isUserAuthorized } from "@/business-logic";
import { i18n } from "@/locales";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";

export const teamMember: NonNullable<QueryResolvers["teamMember"]> = async (
  _parent,
  { teamPk, memberPk },
  context
) => {
  const teamReference = resourceRef("teams", teamPk);
  // ensure user has write access to team
  await ensureAuthorized(context, teamReference, PERMISSION_LEVELS.WRITE);
  const { entity } = await database();
  const userReference = resourceRef("users", memberPk);
  const [isAuthorized, , permission] = await isUserAuthorized(
    userReference,
    teamReference,
    PERMISSION_LEVELS.READ
  );
  if (!isAuthorized) {
    throw forbidden(i18n._("User is not a member of this team"));
  }

  return {
    ...((await entity.get(userReference)) as unknown as User),
    resourcePermission: permission,
  };
};
