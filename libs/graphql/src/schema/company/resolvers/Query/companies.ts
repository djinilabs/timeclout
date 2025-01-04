import { database } from "@/tables";
import type { QueryResolvers } from "./../../../../types.generated";
import { requireSession } from "../../../../session/requireSession";

export const companies: NonNullable<QueryResolvers["companies"]> = async (
  _parent,
  _arg,
  _ctx
) => {
  const session = await requireSession(_ctx);
  console.log("session:", session);
  const { permission, entity } = await database();
  const permissions = await permission.query({
    IndexName: "byResourceType",
    KeyConditionExpression: "resourceType = :resourceType",
    ExpressionAttributeValues: {
      ":resourceType": "companies",
    },
  });
  console.log("permissions:", permissions);

  if (permissions.length === 0) {
    return [];
  }

  return entity.batchGet(permissions.map((p) => p.pk));
};
