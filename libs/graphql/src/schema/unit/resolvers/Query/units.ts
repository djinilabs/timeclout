import { getAuthorized } from "libs/graphql/src/auth/getAuthorized";

import type { QueryResolvers, Unit } from "./../../../../types.generated";

import { database } from "@/tables";
export const units: NonNullable<QueryResolvers['units']> = async (
  _parent,
  _argument,
  context
) => {
  const permissions = await getAuthorized(context, "units");
  const { entity } = await database();
  return entity.batchGet(permissions.map((p) => p.pk)) as unknown as Promise<
    Unit[]
  >;
};
