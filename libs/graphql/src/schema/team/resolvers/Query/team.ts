import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";
import type { QueryResolvers, Team } from "./../../../../types.generated";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";

export const team: NonNullable<QueryResolvers['team']> = async (
  _parent,
  arg,
  ctx
) => {
  const teamRef = resourceRef("teams", arg.teamPk);
  await ensureAuthorized(ctx, teamRef, PERMISSION_LEVELS.READ);
  const { entity } = await database();
  return entity.get(teamRef) as unknown as Team;
};
