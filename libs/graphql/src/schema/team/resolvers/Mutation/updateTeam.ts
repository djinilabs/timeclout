import { notFound } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { MutationResolvers, Team } from "./../../../../types.generated";

import { database , PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";

export const updateTeam: NonNullable<MutationResolvers['updateTeam']> = async (
  _parent,
  _argument,
  _context
) => {
  const reference = resourceRef("teams", _argument.pk);
  await ensureAuthorized(_context, reference, PERMISSION_LEVELS.WRITE);
  const { entity } = await database();
  const team = await entity.get(reference);
  if (!team) {
    throw notFound("Team with pk ${_arg.pk} not found");
  }
  team.name = _argument.name;
  await entity.update(team);
  return team as unknown as Team;
};
