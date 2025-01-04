import { database } from "@/tables";
import type { QueryResolvers } from "./../../../../types.generated";
import { requireSession } from "../../../../session/requireSession";

export const companies: NonNullable<QueryResolvers['companies']> = async (
  _parent,
  _arg,
  _ctx
) => {
  const session = await requireSession(_ctx);
  console.log("session:", session);
  const { permission, entity } = await database();
  const userPk = `users/${session.user.id}`;
  console.log("userPk:", userPk);
  const permissions = await permission.query({
    IndexName: "byResourceTypeAndEntityId",
    KeyConditionExpression:
      "resourceType = :resourceType AND entityId = :entityId  ",
    ExpressionAttributeValues: {
      ":resourceType": "companies",
      ":entityId": userPk,
    },
  });
  console.log("permissions:", permissions);

  if (permissions.length === 0) {
    return [];
  }

  return entity.batchGet(permissions.map((p) => p.pk));
};
