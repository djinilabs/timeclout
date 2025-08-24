import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";

import type { QueryResolvers, Team } from "./../../../../types.generated";

import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";

export const team: NonNullable<QueryResolvers['team']> = async (
  _parent,
  argument,
  context
) => {
  const teamReference = resourceRef("teams", argument.teamPk);
  await ensureAuthorized(context, teamReference, PERMISSION_LEVELS.READ);
  const { entity } = await database();
  return entity.get(teamReference) as unknown as Team;
};
