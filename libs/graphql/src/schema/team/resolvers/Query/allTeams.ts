import { getAuthorized } from "libs/graphql/src/auth/getAuthorized";

import type { QueryResolvers, Team } from "./../../../../types.generated";

import { database } from "@/tables";
export const allTeams: NonNullable<QueryResolvers['allTeams']> = async (
  _parent,
  _argument,
  context
) => {
  const permissions = await getAuthorized(context, "teams");
  const { entity } = await database();
  return entity.batchGet(permissions.map((p) => p.pk)) as unknown as Promise<
    Team[]
  >;
};
