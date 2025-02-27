import { database } from "@/tables";
import type { QueryResolvers, Team } from "./../../../../types.generated";
import { getAuthorized } from "libs/graphql/src/auth/getAuthorized";
export const allTeams: NonNullable<QueryResolvers['allTeams']> = async (
  _parent,
  _arg,
  ctx
) => {
  const permissions = await getAuthorized(ctx, "teams");
  const { entity } = await database();
  return entity.batchGet(permissions.map((p) => p.pk)) as unknown as Promise<
    Team[]
  >;
};
