import { notFound } from "@hapi/boom";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";
import type { Company, QueryResolvers } from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

export const company: NonNullable<QueryResolvers['company']> = async (
  _parent,
  arg,
  ctx
) => {
  await ensureAuthorized(
    ctx,
    resourceRef("companies", arg.companyPk),
    PERMISSION_LEVELS.READ
  );
  const { entity } = await database();
  const c = await entity.get(resourceRef("companies", arg.companyPk));
  if (!c) {
    throw notFound("Company not found");
  }
  return c as unknown as Company;
};
