import { database, PERMISSION_LEVELS, resourceRef } from "@/tables";
import { nanoid } from "nanoid";
import type { Company, MutationResolvers } from "./../../../../types.generated";
import { requireSession } from "../../../../session/requireSession";
import { giveAuthorization } from "../../../../auth/giveAuthorization";

export const createCompany: NonNullable<MutationResolvers['createCompany']> = async (_parent, arg, ctx) => {
  const session = await requireSession(ctx);
  const userPk = resourceRef("users", session.user.id);
  const companyPk = resourceRef("companies", nanoid());
  const company = {
    pk: companyPk,
    createdBy: userPk,
    createdAt: new Date().toISOString(),
    name: arg.name,
  };
  const { entity } = await database();
  await entity.create(company);
  await giveAuthorization(companyPk, userPk, PERMISSION_LEVELS.OWNER, userPk);
  return company as unknown as Company;
};
