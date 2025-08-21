import { database } from "@/tables";
import { getResourceRef, ResourceRef, ResourceType } from "@/utils";

export const getEntityPksUserHasPermissionFor = async (
  userRef: ResourceRef,
  resourceType: ResourceType
): Promise<ResourceRef[]> => {
  const { permission } = await database();
  return (
    await permission.query({
      IndexName: "byResourceTypeAndEntityId",
      KeyConditionExpression: "resourceType = :resourceType AND sk = :sk",
      ExpressionAttributeValues: {
        ":resourceType": resourceType,
        ":sk": userRef,
      },
    })
  ).items.map(({ pk }) => getResourceRef(pk));
};
