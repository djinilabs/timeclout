import { requireSession } from "libs/graphql/src/session/requireSession";
import type { MutationResolvers } from "./../../../../types.generated";
import { database } from "@/tables";
import { notFound } from "@hapi/boom";
import { nanoid } from "nanoid";

export const createUnit: NonNullable<MutationResolvers["createUnit"]> = async (
  _parent,
  arg,
  _ctx
) => {
  const session = await requireSession(_ctx);
  const userPk = `users/${session.user.id}`;

  const { entity, permission } = await database();
  const companyPk = `companies/${arg.companyPk}`;
  const permissionRecord = await permission.query({
    KeyConditionExpression: "pk = :pk AND entityId = :entityId",
    ExpressionAttributeValues: {
      ":pk": companyPk,
      ":entityId": userPk,
    },
  });
  if (!permissionRecord) {
    throw new Error("User does not have permission to access this company");
  }
  const company = await entity.get(companyPk);
  if (!company) {
    throw notFound("Company with pk ${arg.companyPk} not found");
  }

  const unitPk = `units/${nanoid()}`;
  const unit = {
    pk: unitPk,
    createdBy: userPk,
    createdAt: new Date().toISOString(),
    name: arg.name,
  };
  await entity.create(unit);
  return unit;
};
