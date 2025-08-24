import { notFound } from "@hapi/boom";
import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";

import type {
  MutationResolvers,
  ShiftPosition,
} from "./../../../../types.generated";

import { i18n } from "@/locales";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";


export const unassignShiftPosition: NonNullable<
  MutationResolvers["unassignShiftPosition"]
> = async (_parent, argument, context) => {
  const { shift_positions } = await database();
  const { input } = argument;
  const { team, shiftPositionSk } = input;
  const pk = resourceRef("teams", team);
  const userPk = await ensureAuthorized(context, pk, PERMISSION_LEVELS.WRITE);

  console.log("unassign shift position", pk, shiftPositionSk);

  const position = await shift_positions.get(pk, shiftPositionSk, "staging");
  if (!position) {
    throw notFound(
      i18n._("Shift position {shiftPositionSk} not found", { shiftPositionSk })
    );
  }

  position.assignedTo = undefined;
  position.updatedBy = userPk;
  position.updatedAt = new Date().toISOString();
  await shift_positions.update(position, "staging");

  return position as unknown as ShiftPosition;
};
