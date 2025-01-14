import { database, PermissionRecord, ResourceRef } from "@/tables";

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
