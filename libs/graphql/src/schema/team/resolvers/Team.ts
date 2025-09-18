import { requireSession } from "../../../session/requireSession";

import type {
  Team as TeamType,
  TeamResolvers,
  User,
  UserSchedule,
} from "./../../../types.generated";

import {
  teamSchedule,
  getEntitySettings,
  teamMembersUsers,
  teamMembersQualifications,
  getUserAuthorizationLevelForResource,
} from "@/business-logic";
import { DayDate } from "@/day-date";
import { SettingsTypeKey } from "@/settings";
import { database, EntityRecord } from "@/tables";
import { getDefined, getResourceRef, resourceRef, ResourceRef } from "@/utils";

export const Team: TeamResolvers = {
  createdBy: async (parent, _args, ctx) => {
    // Cast to access the raw database field where createdBy is a string
    const userRef = (parent as unknown as { createdBy: string }).createdBy;
    const user = await ctx.userCache.getUser(getResourceRef(userRef));
    return user as unknown as User;
  },
  updatedBy: async (parent, _args, ctx) => {
    // Cast to access the raw database field where updatedBy is a string
    const userRef = (parent as unknown as { updatedBy?: string }).updatedBy;
    if (!userRef) {
      return null;
    }
    const user = await ctx.userCache.getUser(getResourceRef(userRef));
    return user as unknown as User;
  },
  members: async (parent, args) => {
    return teamMembersUsers(
      parent.pk as ResourceRef,
      args.qualifications ?? undefined
    ) as unknown as Promise<User[]>;
  },
  schedule: async (parent, { startDate, endDate }) => {
    const { entity } = await database();
    const unit = getDefined(
      await entity.get(getDefined((parent as unknown as EntityRecord).parentPk))
    );
    const schedule = await teamSchedule(
      getResourceRef(unit.parentPk, "companies"),
      getResourceRef(parent.pk, "teams"),
      new DayDate(startDate),
      new DayDate(endDate)
    );
    return {
      ...schedule,
      pk: `${
        schedule.team.pk
      }:${schedule.startDate.toString()}:${schedule.endDate.toString()}`,
      team: schedule.team as unknown as TeamType,
      startDate: schedule.startDate.toString(),
      endDate: schedule.endDate.toString(),
      userSchedules: schedule.userSchedules.map((userSchedule) => ({
        ...userSchedule,
        pk: `${
          userSchedule.user?.pk
        }:${userSchedule.startDate.toString()}:${userSchedule.endDate.toString()}`,
        startDate: userSchedule.startDate.toString(),
        endDate: userSchedule.endDate.toString(),
      })) as unknown as UserSchedule[],
    };
  },
  approvedSchedule: async (parent, { startDate, endDate }) => {
    const { entity } = await database();
    const unit = getDefined(
      await entity.get(getDefined((parent as unknown as EntityRecord).parentPk))
    );
    const schedule = await teamSchedule(
      getResourceRef(unit.parentPk, "companies"),
      getResourceRef(parent.pk, "teams"),
      new DayDate(startDate),
      new DayDate(endDate),
      { approved: true }
    );
    return {
      ...schedule,
      pk: `${
        schedule.team.pk
      }:${schedule.startDate.toString()}:${schedule.endDate.toString()}`,
      team: schedule.team as unknown as TeamType,
      startDate: schedule.startDate.toString(),
      endDate: schedule.endDate.toString(),
      userSchedules: schedule.userSchedules.map((userSchedule) => ({
        ...userSchedule,
        pk: `${
          userSchedule.user?.pk
        }:${userSchedule.startDate.toString()}:${userSchedule.endDate.toString()}`,
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
  teamMembersQualifications: async (parent) => {
    return teamMembersQualifications(getResourceRef(parent.pk));
  },
  resourcePermission: async (parent, _, ctx) => {
    const session = await requireSession(ctx);
    return session.user?.id
      ? getUserAuthorizationLevelForResource(
          resourceRef("teams", parent.pk),
          resourceRef("users", session.user.id)
        )
      : null;
  },
  unitPk: async (parent) => {
    // The database stores parentPk, but GraphQL expects unitPk
    return getDefined(
      (parent as unknown as EntityRecord).parentPk,
      "no parent pk in team"
    );
  },
  companyPk: async (parent) => {
    // The database stores parentPk for team, but GraphQL expects companyPk
    // We need to get the team's parent (unit) and then the unit's parent (company)
    const unitPk = getDefined(
      (parent as unknown as EntityRecord).parentPk,
      "no parent pk in team"
    );
    const { entity } = await database();
    const unit = await entity.get(unitPk);
    return getDefined(
      getDefined(unit, "no unit").parentPk,
      "no parent pk in unit"
    );
  },
};
