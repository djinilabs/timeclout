import { getAuthorized } from "libs/graphql/src/auth/getAuthorized";

import type { QueryResolvers, Unit } from "./../../../../types.generated";

import { database } from "@/tables";
export const units: NonNullable<QueryResolvers['units']> = async (
  _parent,
  _arg,
  ctx
) => {
  const permissions = await getAuthorized(ctx, "units");
  const { entity } = await database();
  const units = (await entity.batchGet(
    permissions.map((p) => p.pk)
  )) as unknown as Unit[];
  
  // Sort by creation date to ensure consistent ordering
  return units.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateA - dateB;
  });
};
