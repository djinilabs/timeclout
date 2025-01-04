import { database } from "@/tables";
import type { UnitResolvers } from "./../../../types.generated";
import { requireSession } from "libs/graphql/src/session/requireSession";

export const Unit: UnitResolvers = {
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
  teams: async (parent, _args, ctx) => {
    const { permission, entity } = await database();
    const session = await requireSession(ctx);
    const userPk = `users/${session.user.id}`;
    const permissions = await permission.query({
      IndexName: "byResourceTypeAndEntityId",
      KeyConditionExpression:
        "resourceType = :resourceType AND entityId = :entityId",
      FilterExpression: "parentPk = :parentPk",
      ExpressionAttributeValues: {
        ":resourceType": "teams",
        ":entityId": userPk,
        ":parentPk": parent.pk,
      },
    });

    if (permissions.length === 0) {
      return [];
    }

    return entity.batchGet(permissions.map((p) => p.pk));
  },
};
