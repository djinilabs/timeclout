import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";
import type { Company, MutationResolvers } from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import { notFound } from "@hapi/boom";

export const updateCompany: NonNullable<MutationResolvers['updateCompany']> = async (_parent, _arg, _ctx) => {
  const companyRef = resourceRef("companies", _arg.pk);
  await ensureAuthorized(_ctx, companyRef, PERMISSION_LEVELS.WRITE);
  const { entity } = await database();
  const company = await entity.get(companyRef);
  if (!company) {
    throw notFound("Company with pk ${_arg.pk} not found");
  }
  company.name = _arg.name;
  await entity.update(company);
  return company as unknown as Company;
};
