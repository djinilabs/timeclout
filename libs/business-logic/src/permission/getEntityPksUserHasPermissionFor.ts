import { getResourceRef, ResourceRef, ResourceType } from "@/utils";
import { database } from "@/tables";

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
  ).map(({ pk }) => getResourceRef(pk));
};
