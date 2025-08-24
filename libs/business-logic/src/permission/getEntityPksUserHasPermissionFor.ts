import { database } from "@/tables";
import { getResourceRef, ResourceRef, ResourceType } from "@/utils";

export const getEntityPksUserHasPermissionFor = async (
  userReference: ResourceRef,
  resourceType: ResourceType
): Promise<ResourceRef[]> => {
  const { permission } = await database();
  const result = await permission.query({
    IndexName: "byResourceTypeAndEntityId",
    KeyConditionExpression: "resourceType = :resourceType AND sk = :sk",
    ExpressionAttributeValues: {
      ":resourceType": resourceType,
      ":sk": userReference,
    },
  });
  return result.items.map(({ pk }) => getResourceRef(pk));
};
