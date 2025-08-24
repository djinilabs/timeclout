import { forbidden, notFound } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import { requireSession } from "../../../../session/requireSession";

import type { MutationResolvers, User } from "./../../../../types.generated";

import { authConfig } from "@/auth-config";
import { isUserAuthorized, ensureExactAuthorization } from "@/business-logic";
import { database, PERMISSION_LEVELS } from "@/tables";
import { getDefined, resourceRef } from "@/utils";


export const updateTeamMember: NonNullable<MutationResolvers['updateTeamMember']> = async (_parent, { input }, context) => {
  const teamReference = resourceRef("teams", input.teamPk);
  // ensure user has write access to team
  await ensureAuthorized(context, teamReference, PERMISSION_LEVELS.WRITE);
  const session = await requireSession(context);
  const createdByPk = session.user?.id;
  if (!createdByPk) {
    throw notFound("User not found");
  }
  const updatedBy = resourceRef("users", createdByPk);
  const userReference = resourceRef("users", input.memberPk);

  const { entity } = await database();
  if (!(await isUserAuthorized(userReference, teamReference, PERMISSION_LEVELS.READ))) {
    throw forbidden("User is not a member of this team");
  }

  const auth = await authConfig();
  await getDefined(auth.adapter?.updateUser)({
    id: input.memberPk,
    email: input.email,
    name: input.name,
  });

  const user = {
    pk: userReference,
    name: input.name,
    email: input.email,
    updatedBy,
  };
  (await entity.update(user)) as unknown as Promise<User>;

  await ensureExactAuthorization(teamReference, userReference, input.permission, updatedBy);

  return user as unknown as User;
};
