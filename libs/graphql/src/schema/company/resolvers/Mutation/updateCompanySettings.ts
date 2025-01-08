import { resourceRef } from "@/tables";
import { database, PERMISSION_LEVELS } from "@/tables";
import { notFound } from "@hapi/boom";
import type { Company, MutationResolvers } from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

export const updateCompanySettings: NonNullable<MutationResolvers['updateCompanySettings']> = async (_parent, arg, _ctx) => {
  const companyRef = resourceRef("companies", arg.companyPk);
  await ensureAuthorized(_ctx, companyRef, PERMISSION_LEVELS.WRITE);
  const { entity, entity_settings } = await database();
  const company = await entity.get(companyRef);
  if (!company) {
    throw notFound(`Company with pk ${arg.companyPk} not found`);
  }
  await entity_settings.upsert({
    pk: companyRef,
    sk: arg.name,
    settings: arg.settings,
  });
  return company as unknown as Company;
};
