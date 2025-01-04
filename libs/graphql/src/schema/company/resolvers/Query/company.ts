import { database } from "@/tables";
import type { QueryResolvers } from "./../../../../types.generated";
import { notFound } from "@hapi/boom";

export const company: NonNullable<QueryResolvers['company']> = async (
  _parent,
  arg
) => {
  const { entity } = await database();
  const companyPk = `companies/${arg.companyPk}`;
  console.log("companyPk", companyPk);
  const c = await entity.get(companyPk);
  if (!c) {
    throw notFound("Company not found");
  }
  return c;
};
