import { getResourceRef } from "@/utils";

import { database } from "@/tables";
import { ResourceRef } from "@/utils";
import { filterUsersByQualificationsInTeam } from "./filterUsersByQualificationsInTeam";

export const teamMembersUsers = async (
  teamId: ResourceRef,
  qualifications?: string[]
) => {
  const { permission, entity } = await database();
  const { items: permissions } = await permission.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": teamId,
    },
  });

  const members = Object.fromEntries(
    permissions.filter((p) => p.sk.startsWith("users/")).map((p) => [p.sk, p])
  );

  let users = await entity.batchGet(Object.keys(members));

  if (qualifications && qualifications.length > 0) {
    users = await filterUsersByQualificationsInTeam(
      users,
      qualifications,
      getResourceRef(teamId)
    );
  }

  return users
    .map((user) => {
      const permission = members[user.pk];
      const userWithPermission = {
        ...user,
        resourcePermission: permission.type,
        resourcePermissionGivenAt: new Date(permission.createdAt),
      };
      return userWithPermission;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};
