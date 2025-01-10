import { database, Permission, resourceRef } from "@/tables";
import { requireSession } from "../session/requireSession";
import { ResolverContext } from "../resolverContext";

export const getAuthorizedForResource = async (
  resourcePk: string
): Promise<Permission[]> => {
  const { permission } = await database();
  return permission.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": resourcePk,
    },
  });
};
