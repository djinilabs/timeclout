import { database } from "@/tables";
import { resourceRef } from "@/utils";
import type { Company, MutationResolvers } from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import { PERMISSION_LEVELS } from "@/tables";
import { badData, notFound } from "@hapi/boom";

export const deleteCompany: NonNullable<
  MutationResolvers["deleteCompany"]
> = async (_parent, arg, _ctx) => {
  const companyRef = resourceRef("companies", arg.pk);
  await ensureAuthorized(_ctx, companyRef, PERMISSION_LEVELS.OWNER);
  const { entity, permission } = await database();
  const company = await entity.get(companyRef);
  if (!company) {
    throw notFound("Company with pk ${_arg.pk} not found");
  }

  // Check if the company has any units
  const units = await entity.query({
    IndexName: "byParentPk",
    KeyConditionExpression: "parentPk = :parentPk",
    ExpressionAttributeValues: {
      ":parentPk": companyRef,
    },
  });
  if (units.items.length > 0) {
    throw badData("Company has units, cannot delete");
  }

  console.log("Company has no units, can delete");

  await entity.delete(companyRef);

  console.log("Deleted company");

  await permission.deleteAll(companyRef);

  console.log("Deleted company permissions");

  return company as unknown as Company;
};
