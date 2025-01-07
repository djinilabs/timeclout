import { database, resourceRef } from "@/tables";
import type { MutationResolvers, Team } from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import { PERMISSION_LEVELS } from "@/tables";
import { notFound } from "@hapi/boom";
import { notAcceptable } from "@hapi/boom";

export const removeUserFromTeam: NonNullable<MutationResolvers['removeUserFromTeam']> = async (_parent, arg, ctx) => {
  const teamRef = resourceRef("teams", arg.teamPk);
  const actorUserPk = await ensureAuthorized(
    ctx,
    teamRef,
    PERMISSION_LEVELS.WRITE
  );
  if (actorUserPk === arg.userPk) {
    throw notAcceptable("You cannot remove yourself from the team");
  }
  const { entity, permission } = await database();
  const team = await entity.get(teamRef);
  if (!team) {
    throw notFound("Team not found");
  }
  await permission.delete(teamRef, arg.userPk);
  return team as unknown as Team;
};
