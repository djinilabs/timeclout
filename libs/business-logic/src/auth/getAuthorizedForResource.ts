import { database, PermissionRecord } from "@/tables";
import { ResourceRef } from "@/utils";
export const getAuthorizedForResource = async (
  resourcePk: ResourceRef
): Promise<PermissionRecord[]> => {
  const { permission } = await database();
  return permission.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": resourcePk,
    },
  });
};
