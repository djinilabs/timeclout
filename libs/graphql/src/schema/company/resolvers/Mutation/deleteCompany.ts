import { notFound, badData } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { Company, MutationResolvers } from "./../../../../types.generated";

import { i18n } from "@/locales";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";



export const deleteCompany: NonNullable<
  MutationResolvers["deleteCompany"]
> = async (_parent, _argument, context) => {
  await ensureAuthorized(
    context,
    resourceRef("companies", _argument.pk),
    PERMISSION_LEVELS.WRITE
  );
  const { entity } = await database();
  const company = await entity.get(resourceRef("companies", _argument.pk));
  if (!company) {
    throw notFound(
      i18n._("Company with pk {companyPk} not found", { companyPk: _argument.pk })
    );
  }

  // Check if company has units
  const { items: units } = await entity.query({
    IndexName: "byParentPk",
    KeyConditionExpression: "parentPk = :parentPk",
    ExpressionAttributeValues: {
      ":parentPk": company.pk,
    },
  });

  if (units.length > 0) {
    throw badData(i18n._("Company has units, cannot delete"));
  }

  await entity.delete(company.pk);
  return company as unknown as Company;
};
