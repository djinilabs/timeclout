import { notFound } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { MutationResolvers, Team } from "./../../../../types.generated";

import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";

export const deleteTeam: NonNullable<MutationResolvers["deleteTeam"]> = async (
  _parent,
  _argument,
  _context
) => {
  const teamReference = resourceRef("teams", _argument.pk);
  await ensureAuthorized(_context, teamReference, PERMISSION_LEVELS.OWNER);
  const { entity, permission } = await database();
  const team = await entity.get(teamReference);
  if (!team) {
    throw notFound("Team with pk ${_arg.pk} not found");
  }
  await entity.delete(teamReference);
  await permission.deleteAll(teamReference);
  return team as unknown as Team;
};
