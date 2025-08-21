import { getAuthorized } from "libs/graphql/src/auth/getAuthorized";

import type { Company, QueryResolvers } from "./../../../../types.generated";

import { database } from "@/tables";

export const companies: NonNullable<QueryResolvers['companies']> = async (
  _parent,
  _arg,
  _ctx
) => {
  const permissions = await getAuthorized(_ctx, "companies");
  const { entity } = await database();
  return entity.batchGet(permissions.map((p) => p.pk)) as unknown as Promise<
    Company[]
  >;
};
