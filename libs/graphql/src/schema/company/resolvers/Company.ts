// @ts-ignore
import { database } from "@/tables";
import { CompanyResolvers } from "../../../types.generated";
import { requireSession } from "../../../session/requireSession";

export const Company: CompanyResolvers = {
  createdBy: async (parent) => {
    const { entity } = await database();
    const user = await entity.get(parent.createdBy as unknown as string);
    return user;
  },
  updatedBy: async (parent) => {
    if (!parent.updatedBy) {
      return null;
    }
    const { entity } = await database();
    return entity.get(parent.updatedBy as unknown as string);
  },
  units: async (parent, _args, _ctx) => {
    const { permission, entity } = await database();
    const session = await requireSession(_ctx);
    const userPk = `users/${session.user.id}`;
    const permissions = await permission.query({
      IndexName: "byResourceTypeAndEntityId",
      KeyConditionExpression:
        "resourceType = :resourceType AND entityId = :entityId",
      FilterExpression: "parentPk = :parentPk",
      ExpressionAttributeValues: {
        ":resourceType": "units",
        ":entityId": userPk,
        ":parentPk": parent.pk,
      },
    });
    console.log("units: permissions:", permissions);

    if (permissions.length === 0) {
      return [];
    }

    return entity.batchGet(permissions.map((p) => p.pk));
  },
};
