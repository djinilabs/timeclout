import { notFound } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { Company, MutationResolvers } from "./../../../../types.generated";

import { i18n } from "@/locales";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";

export const updateCompanySettings: NonNullable<
  MutationResolvers["updateCompanySettings"]
> = async (_parent, arg, _ctx) => {
  console.log("updateCompanySettings", arg);
  const companyRef = resourceRef("companies", arg.companyPk);
  const userPk = await ensureAuthorized(
    _ctx,
    companyRef,
    PERMISSION_LEVELS.WRITE
  );
  const { entity, entity_settings } = await database();
  const company = await entity.get(companyRef);
  if (!company) {
    throw notFound(
      i18n._("Company with pk {companyPk} not found", {
        companyPk: arg.companyPk,
      })
    );
  }
  await entity_settings.upsert({
    pk: companyRef,
    sk: arg.name,
    settings: arg.settings,
    createdBy: userPk,
    createdAt: new Date().toISOString(),
    updatedBy: userPk,
    updatedAt: new Date().toISOString(),
  });
  return company as unknown as Company;
};
