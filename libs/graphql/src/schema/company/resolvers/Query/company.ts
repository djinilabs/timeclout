import { notFound } from "@hapi/boom";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type { Company, QueryResolvers } from "./../../../../types.generated";

import { i18n } from "@/locales";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";



export const company: NonNullable<QueryResolvers["company"]> = async (
  _parent,
  argument,
  context
) => {
  await ensureAuthorized(
    context,
    resourceRef("companies", argument.companyPk),
    PERMISSION_LEVELS.READ
  );
  const { entity } = await database();
  const c = await entity.get(resourceRef("companies", argument.companyPk));
  if (!c) {
    throw notFound(i18n._("Company not found"));
  }
  return c as unknown as Company;
};
