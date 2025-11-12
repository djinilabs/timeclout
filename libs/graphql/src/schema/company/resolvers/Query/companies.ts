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
  const companies = (await entity.batchGet(
    permissions.map((p) => p.pk)
  )) as unknown as Company[];
  
  // Sort by creation date to ensure consistent ordering
  return companies.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateA - dateB;
  });
};
