import { database } from "@/tables";
import { resourceRef } from "@/utils";
import type { Company, MutationResolvers } from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import { PERMISSION_LEVELS } from "@/tables";
import { notFound } from "@hapi/boom";

export const deleteCompany: NonNullable<MutationResolvers['deleteCompany']> = async (_parent, _arg, _ctx) => {
  const companyRef = resourceRef("companies", _arg.pk);
  await ensureAuthorized(_ctx, companyRef, PERMISSION_LEVELS.OWNER);
  const { entity, permission } = await database();
  const company = await entity.get(companyRef);
  if (!company) {
    throw notFound("Company with pk ${_arg.pk} not found");
  }
  await entity.delete(companyRef);
  await permission.deleteAll(companyRef);
  return company as unknown as Company;
};
