import { getAuthorized } from "libs/graphql/src/auth/getAuthorized";

import type { Company, QueryResolvers } from "./../../../../types.generated";

import { database } from "@/tables";

export const companies: NonNullable<QueryResolvers['companies']> = async (
  _parent,
  _argument,
  _context
) => {
  const permissions = await getAuthorized(_context, "companies");
  const { entity } = await database();
  return entity.batchGet(permissions.map((p) => p.pk)) as unknown as Promise<
    Company[]
  >;
};
