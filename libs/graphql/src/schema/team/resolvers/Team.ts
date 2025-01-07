import { database } from "@/tables";
import type { TeamResolvers, User } from "./../../../types.generated";

export const Team: TeamResolvers = {
  createdBy: async (parent) => {
    const { entity } = await database();
    return entity.get(parent.createdBy as unknown as string) as unknown as User;
  },
  updatedBy: async (parent) => {
    if (!parent.updatedBy) {
      return null;
    }
    const { entity } = await database();
    return entity.get(parent.updatedBy as unknown as string) as unknown as User;
  },
  members: async (parent) => {
    const { permission, entity } = await database();
    const permissions = await permission.query({
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": parent.pk,
      },
    });

    const members = Object.fromEntries(
      permissions.filter((p) => p.sk.startsWith("users/")).map((p) => [p.sk, p])
    );

    const users = await entity.batchGet(Object.keys(members));

    return users.map((user) => {
      const permission = members[user.pk];
      const userWithPermission = {
        ...user,
        resourcePermission: permission.type,
        resourcePermissionGivenAt: new Date(permission.createdAt),
      };
      return userWithPermission;
    }) as unknown as User[];
  },
};
