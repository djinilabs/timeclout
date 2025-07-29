import { resourceRef } from "@/utils";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import type { QueryResolvers, User } from "./../../../../types.generated";
import { database, PERMISSION_LEVELS } from "@/tables";
import { notFound } from "@hapi/boom";
import { teamMembersUsers } from "@/business-logic";
import { i18n } from "@/locales";

export const assignableTeamMembers: NonNullable<
  QueryResolvers["assignableTeamMembers"]
> = async (_parent, { input }, ctx) => {
  const { shiftPositionPk, shiftPositionSk, teamPk } = input;
  const pk = resourceRef("teams", teamPk);
  await ensureAuthorized(ctx, pk, PERMISSION_LEVELS.WRITE);
  const { shift_positions } = await database();
  const shiftPosition = await shift_positions.get(
    shiftPositionPk,
    shiftPositionSk,
    "staging"
  );
  if (!shiftPosition) {
    throw notFound(i18n._("Shift position not found"));
  }
  return teamMembersUsers(
    pk,
    shiftPosition.requiredSkills
  ) as unknown as User[];
};
