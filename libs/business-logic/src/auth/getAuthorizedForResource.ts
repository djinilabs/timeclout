import { database, PermissionRecord } from "@/tables";
import { ResourceRef } from "@/utils";
export const getAuthorizedForResource = async (
  resourcePk: ResourceRef
): Promise<PermissionRecord[]> => {
  const { permission } = await database();
  return (
    await permission.query({
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": resourcePk,
      },
    })
  ).items;
};
