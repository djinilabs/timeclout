import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import type { MutationResolvers, Team } from "./../../../../types.generated";
import { database, PERMISSION_LEVELS } from "@/tables";
import { notFound } from "@hapi/boom";
import { resourceRef } from "@/utils";
export const deleteTeam: NonNullable<MutationResolvers['deleteTeam']> = async (
  _parent,
  _arg,
  _ctx
) => {
  const teamRef = resourceRef("teams", _arg.pk);
  await ensureAuthorized(_ctx, teamRef, PERMISSION_LEVELS.OWNER);
  const { entity, permission } = await database();
  const team = await entity.get(teamRef);
  if (!team) {
    throw notFound("Team with pk ${_arg.pk} not found");
  }
  await entity.delete(teamRef);
  await permission.deleteAll(teamRef);
  return team as unknown as Team;
};
