import { notFound } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { Company, MutationResolvers } from "./../../../../types.generated";

import { i18n } from "@/locales";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";



export const updateCompany: NonNullable<
  MutationResolvers["updateCompany"]
> = async (_parent, _argument, context) => {
  await ensureAuthorized(
    context,
    resourceRef("companies", _argument.pk),
    PERMISSION_LEVELS.WRITE
  );
  const { entity } = await database();
  const c = await entity.get(resourceRef("companies", _argument.pk));
  if (!c) {
    throw notFound(
      i18n._("Company with pk {companyPk} not found", { companyPk: _argument.pk })
    );
  }
  const updatedCompany = await entity.upsert({
    ...c,
    name: _argument.name,
  });
  return updatedCompany as unknown as Company;
};
