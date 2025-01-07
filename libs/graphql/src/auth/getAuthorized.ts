import { database, Permission, resourceRef, ResourceType } from "@/tables";
import { ResolverContext } from "../resolverContext";
import { requireSession } from "../session/requireSession";

export const getAuthorized = async (
  ctx: ResolverContext,
  resourceType: ResourceType
): Promise<Permission[]> => {
  const session = await requireSession(ctx);
  const { permission } = await database();
  const userPk = resourceRef("users", session.user.id);
  console.log("getAuthorized", { userPk, resourceType });
  return permission.query({
    IndexName: "byResourceTypeAndEntityId",
    KeyConditionExpression: "resourceType = :resourceType AND sk = :sk  ",
    ExpressionAttributeValues: {
      ":resourceType": resourceType,
      ":sk": userPk,
    },
  });
};
