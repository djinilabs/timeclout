import { ResourceRef } from "@/utils";
import { database } from "@/tables";
export const teamMembers = async (
  teamId: ResourceRef
): Promise<ResourceRef[]> => {
  const { permission } = await database();
  const permissions = await permission.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": teamId,
    },
  });

  return permissions.map((p) => p.sk as ResourceRef);
};
