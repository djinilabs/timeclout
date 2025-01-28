import { database, EntityRecord } from "@/tables";
import type {
  Team as TeamType,
  TeamResolvers,
  User,
  UserSchedule,
} from "./../../../types.generated";
import {
  teamSchedule,
  filterUsersBySkillsInTeam,
  getEntitySettings,
} from "@/business-logic";
import { getDefined, getResourceRef, resourceRef, ResourceRef } from "@/utils";
import { DayDate } from "@/day-date";
import { SettingsTypeKey } from "@/settings";

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
  members: async (parent, args) => {
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

    let users = await entity.batchGet(Object.keys(members));

    if (args.skills) {
      users = await filterUsersBySkillsInTeam(
        users,
        args.skills,
        getResourceRef(parent.pk)
      );
    }

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
  schedule: async (parent, { startDate, endDate }) => {
    const { entity } = await database();
    const unit = getDefined(
      await entity.get(getDefined((parent as unknown as EntityRecord).parentPk))
    );
    const schedule = await teamSchedule(
      getDefined(unit.parentPk) as ResourceRef,
      parent.pk as ResourceRef,
      new DayDate(startDate),
      new DayDate(endDate)
    );
    return {
      ...schedule,
      pk: `${schedule.team.pk}:${schedule.startDate.toString()}:${schedule.endDate.toString()}`,
      team: schedule.team as unknown as TeamType,
      startDate: schedule.startDate.toString(),
      endDate: schedule.endDate.toString(),
      userSchedules: schedule.userSchedules.map((userSchedule) => ({
        ...userSchedule,
        pk: `${userSchedule.user?.pk}:${userSchedule.startDate.toString()}:${userSchedule.endDate.toString()}`,
        startDate: userSchedule.startDate.toString(),
        endDate: userSchedule.endDate.toString(),
      })) as unknown as UserSchedule[],
    };
  },
  settings: async (parent, args) => {
    return getEntitySettings(
      getResourceRef(parent.pk),
      args.name as SettingsTypeKey
    );
  },
};
