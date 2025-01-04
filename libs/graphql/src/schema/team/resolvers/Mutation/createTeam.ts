import { requireSession } from "../../../../session/requireSession";
import type { MutationResolvers } from "./../../../../types.generated";
import { database } from "@/tables";
import { notFound } from "@hapi/boom";
import { nanoid } from "nanoid";

export const createTeam: NonNullable<MutationResolvers['createTeam']> = async (
  _parent,
  arg,
  _ctx
) => {
  const session = await requireSession(_ctx);
  const userPk = `users/${session.user.id}`;

  const { entity, permission } = await database();
  const unitPk = `units/${arg.unitPk}`;
  const permissionRecord = await permission.query({
    KeyConditionExpression: "pk = :pk AND entityId = :entityId",
    ExpressionAttributeValues: {
      ":pk": unitPk,
      ":entityId": userPk,
    },
  });
  if (!permissionRecord) {
    throw new Error("User does not have permission to access this company");
  }
  const unit = await entity.get(unitPk);
  if (!unit) {
    throw notFound("Unit with pk ${arg.unitPk} not found");
  }

  const teamPk = `teams/${nanoid()}`;
  const team = {
    pk: teamPk,
    createdBy: userPk,
    createdAt: new Date().toISOString(),
    name: arg.name,
  };
  await entity.create(team);

  await permission.create({
    pk: teamPk,
    createdBy: userPk,
    createdAt: new Date().toISOString(),
    entityId: userPk,
    resourceType: "teams",
    parentPk: unitPk,
  });
  return unit;
};
