import { nanoid } from "nanoid";
import { database, PERMISSION_LEVELS } from "@/tables";
import { getDefined, resourceRef } from "@/utils";
import { giveAuthorization } from "@/business-logic";
import type { Company, MutationResolvers } from "./../../../../types.generated";
import { requireSession } from "../../../../session/requireSession";
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
    yearlyQuota: {
      resetMonth: 1,
      defaultQuota: 20,
    },
    workSchedule: {
      monday: {
        isWorkDay: true,
        start: "09:00",
        end: "17:00",
      },
      tuesday: {
        isWorkDay: true,
        start: "09:00",
        end: "17:00",
      },
      wednesday: {
        isWorkDay: true,
        start: "09:00",
        end: "17:00",
      },
      thursday: {
        isWorkDay: true,
        start: "09:00",
        end: "17:00",
      },
      friday: {
        isWorkDay: true,
        start: "09:00",
        end: "17:00",
      },
      saturday: {
        isWorkDay: false,
      },
      sunday: {
        isWorkDay: false,
      },
    },
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
