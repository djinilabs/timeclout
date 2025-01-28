import { getResourceRef, ResourceRef } from "@/utils";
import { database } from "@/tables";
export const teamMembers = async (
  teamId: ResourceRef<"teams">
): Promise<ResourceRef<"users">[]> => {
  const { permission } = await database();
  const permissions = await permission.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": teamId,
    },
  });

  return permissions.map((p) => getResourceRef(p.sk, "users"));
};
