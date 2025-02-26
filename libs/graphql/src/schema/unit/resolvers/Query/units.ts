import { database } from "@/tables";
import type { QueryResolvers, Unit } from "./../../../../types.generated";
import { getAuthorized } from "libs/graphql/src/auth/getAuthorized";
export const units: NonNullable<QueryResolvers['units']> = async (
  _parent,
  _arg,
  ctx
) => {
  const permissions = await getAuthorized(ctx, "units");
  const { entity } = await database();
  return entity.batchGet(permissions.map((p) => p.pk)) as unknown as Promise<
    Unit[]
  >;
};
