import { database } from "@/tables";
import type { QueryResolvers } from "./../../../../types.generated";

export const company: NonNullable<QueryResolvers["company"]> = async (
  _parent,
  _arg,
  _ctx
) => {
  const { entity } = await database();
  return entity.get(_arg.pk);
};
