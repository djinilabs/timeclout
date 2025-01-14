import { nanoid } from "nanoid";
import { database, PERMISSION_LEVELS } from "@/tables";
import { getDefined, resourceRef } from "@/utils";
import type { Company, MutationResolvers } from "./../../../../types.generated";
import { requireSession } from "../../../../session/requireSession";
import { giveAuthorization } from "../../../../auth/giveAuthorization";
import { defaultLeaveTypes } from "./defaultLeaveTypes";

export const createCompany: NonNullable<
  MutationResolvers["createCompany"]
> = async (_parent, arg, ctx) => {
  const session = await requireSession(ctx);
  const userPk = resourceRef(
    "users",
    getDefined(session.user?.id, "User ID is required")
  );
  const companyPk = resourceRef("companies", nanoid());
  const company = {
    pk: companyPk,
    createdBy: userPk,
    createdAt: new Date().toISOString(),
    name: arg.name,
  };
  console.log("company", company);
  const { entity, entity_settings } = await database();
  await entity.create(company);
  await giveAuthorization(companyPk, userPk, PERMISSION_LEVELS.OWNER, userPk);

  const settings = {
    leaveTypes: defaultLeaveTypes,
  };
  for (const [key, value] of Object.entries(settings)) {
    await entity_settings.create({
      pk: companyPk,
      sk: key,
      createdBy: userPk,
      settings: value,
    });
  }

  return company as unknown as Company;
};
