import { notFound } from "@hapi/boom";
import { database , PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";
import type { MutationResolvers, Team } from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

export const updateTeam: NonNullable<MutationResolvers['updateTeam']> = async (
  _parent,
  _arg,
  _ctx
) => {
  const ref = resourceRef("teams", _arg.pk);
  await ensureAuthorized(_ctx, ref, PERMISSION_LEVELS.WRITE);
  const { entity } = await database();
  const team = await entity.get(ref);
  if (!team) {
    throw notFound("Team with pk ${_arg.pk} not found");
  }
  team.name = _arg.name;
  await entity.update(team);
  return team as unknown as Team;
};
