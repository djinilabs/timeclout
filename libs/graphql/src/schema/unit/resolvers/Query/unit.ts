import { database } from "@/tables";
import type { QueryResolvers } from "./../../../../types.generated";
import { notFound } from "@hapi/boom";
export const unit: NonNullable<QueryResolvers["unit"]> = async (
  _parent,
  arg,
  _ctx
) => {
  const { entity } = await database();
  const unitPk = `units/${arg.unitPk}`;
  console.log("unitPk", unitPk);
  const u = await entity.get(unitPk);
  if (!u) {
    throw notFound("Unit not found");
  }
  return u;
};
