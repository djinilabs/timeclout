import { database, resourceRef } from "@/tables";
import type { Company, QueryResolvers } from "./../../../../types.generated";
import { notFound } from "@hapi/boom";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import { PERMISSION_LEVELS } from "@/tables";

export const company: NonNullable<QueryResolvers["company"]> = async (
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
  console.log("get company", resourceRef("companies", arg.companyPk));
  const c = await entity.get(resourceRef("companies", arg.companyPk));
  if (!c) {
    throw notFound("Company not found");
  }
  return c as unknown as Company;
};
