import { resourceRef } from "@/utils";
import { database, PERMISSION_LEVELS } from "@/tables";
import type { QueryResolvers, User } from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import { forbidden } from "@hapi/boom";
import { isUserAuthorized } from "@/business-logic";

export const teamMember: NonNullable<QueryResolvers["teamMember"]> = async (
  _parent,
  { teamPk, memberPk },
  ctx
) => {
  console.log("### teamMember", teamPk, memberPk);
  const teamRef = resourceRef("teams", teamPk);
  // ensure user has write access to team
  await ensureAuthorized(ctx, teamRef, PERMISSION_LEVELS.WRITE);
  const { entity } = await database();
  const userRef = resourceRef("users", memberPk);
  if (!(await isUserAuthorized(userRef, teamRef, PERMISSION_LEVELS.READ))) {
    throw forbidden("User is not a member of this team");
  }

  return entity.get(userRef) as unknown as User;
};
