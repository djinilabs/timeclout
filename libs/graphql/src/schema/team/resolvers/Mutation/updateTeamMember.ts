import { forbidden, notFound } from "@hapi/boom";
import { requireSession } from "../../../../session/requireSession";
import { database, PERMISSION_LEVELS } from "@/tables";
import { getDefined, resourceRef } from "@/utils";
import { authConfig } from "@/auth-config";
import { isUserAuthorized, ensureExactAuthorization } from "@/business-logic";
import type { MutationResolvers, User } from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

export const updateTeamMember: NonNullable<MutationResolvers['updateTeamMember']> = async (_parent, { input }, ctx) => {
  const teamRef = resourceRef("teams", input.teamPk);
  // ensure user has write access to team
  await ensureAuthorized(ctx, teamRef, PERMISSION_LEVELS.WRITE);
  const session = await requireSession(ctx);
  const createdByPk = session.user?.id;
  if (!createdByPk) {
    throw notFound("User not found");
  }
  const updatedBy = resourceRef("users", createdByPk);
  const userRef = resourceRef("users", input.memberPk);

  const { entity } = await database();
  if (!(await isUserAuthorized(userRef, teamRef, PERMISSION_LEVELS.READ))) {
    throw forbidden("User is not a member of this team");
  }

  const auth = await authConfig();
  await getDefined(auth.adapter?.updateUser)({
    id: input.memberPk,
    email: input.email,
    name: input.name,
  });

  const user = {
    pk: userRef,
    name: input.name,
    email: input.email,
    updatedBy,
  };
  (await entity.update(user)) as unknown as Promise<User>;

  await ensureExactAuthorization(teamRef, userRef, input.permission, updatedBy);

  return user as unknown as User;
};
