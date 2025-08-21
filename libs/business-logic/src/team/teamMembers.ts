import { database } from "@/tables";
import { getResourceRef, ResourceRef } from "@/utils";
export const teamMembers = async (
  teamId: ResourceRef<"teams">
): Promise<ResourceRef<"users">[]> => {
  const { permission } = await database();
  const { items: permissions } = await permission.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": teamId,
    },
  });

  return permissions.map((p) => getResourceRef(p.sk, "users"));
};
