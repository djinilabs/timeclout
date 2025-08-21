import { ResolverContext } from "../resolverContext";
import { requireSession } from "../session/requireSession";

import { database, PermissionRecord } from "@/tables";
import { getDefined, resourceRef, ResourceType } from "@/utils";

export const getAuthorized = async (
  ctx: ResolverContext,
  resourceType: ResourceType
): Promise<PermissionRecord[]> => {
  const session = await requireSession(ctx);
  const { permission } = await database();
  const userPk = resourceRef(
    "users",
    getDefined(session.user?.id, "User ID is undefined")
  );
  return (
    await permission.query({
      IndexName: "byResourceTypeAndEntityId",
      KeyConditionExpression: "resourceType = :resourceType AND sk = :sk  ",
      ExpressionAttributeValues: {
        ":resourceType": resourceType,
        ":sk": userPk,
      },
    })
  ).items;
};
