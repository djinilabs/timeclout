import { getAuthorized } from "libs/graphql/src/auth/getAuthorized";

import type { QueryResolvers, Team } from "./../../../../types.generated";

import { database } from "@/tables";
export const allTeams: NonNullable<QueryResolvers['allTeams']> = async (
  _parent,
  _arg,
  ctx
) => {
  const permissions = await getAuthorized(ctx, "teams");
  const { entity } = await database();
  const teams = (await entity.batchGet(
    permissions.map((p) => p.pk)
  )) as unknown as Team[];
  
  // Sort by creation date to ensure consistent ordering
  return teams.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateA - dateB;
  });
};
