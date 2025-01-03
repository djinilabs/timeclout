import { database } from "@/tables";
import type { QueryResolvers } from "./../../../../types.generated";

export const companies: NonNullable<QueryResolvers["companies"]> = async (
  _parent,
  _arg,
  _ctx
) => {
  const { entity } = await database();
  return entity.query({});
};
