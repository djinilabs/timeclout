import { database } from "@/tables";
import { nanoid } from "nanoid";
import type { MutationResolvers } from "./../../../../types.generated";
import { requireSession } from "../../../../session/requireSession";

export const createCompany: NonNullable<MutationResolvers['createCompany']> = async (_parent, arg, _ctx) => {
  const session = await requireSession(_ctx);
  const userPk = `users/${session.user.id}`;
  const companyPk = `companies/${nanoid()}`;
  const company = {
    pk: companyPk,
    createdBy: userPk,
    createdAt: new Date().toISOString(),
    name: arg.name,
  };
  const { entity, permission } = await database();
  await entity.create(company);

  await permission.create({
    pk: companyPk,
    createdBy: userPk,
    createdAt: new Date().toISOString(),
    entityId: userPk,
    resourceType: "companies",
  });
  return company;
};
