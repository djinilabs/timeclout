import { database } from "@/tables";
import { ResourceRef } from "@/utils";

export const getUserUnits = async (userRef: ResourceRef) => {
  const { permission } = await database();
  return await permission.query({
    IndexName: "byResourceTypeAndEntityId",
    KeyConditionExpression: "resourceType = :resourceType AND sk = :sk",
    ExpressionAttributeValues: {
      ":resourceType": "units",
      ":sk": userRef,
    },
  });
};
