import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";
import type {
  MutationResolvers,
  ShiftPosition,
} from "./../../../../types.generated";
import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";
import { notFound } from "@hapi/boom";

export const unassignShiftPosition: NonNullable<
  MutationResolvers["unassignShiftPosition"]
> = async (_parent, arg, ctx) => {
  const { shift_positions } = await database();
  const { input } = arg;
  const { team, shiftPositionSk } = input;
  const pk = resourceRef("teams", team);
  const userPk = await ensureAuthorized(ctx, pk, PERMISSION_LEVELS.WRITE);

  console.log("unassign shift position", pk, shiftPositionSk);

  const position = await shift_positions.get(pk, shiftPositionSk, "staging");
  if (!position) {
    throw notFound(`Shift position ${shiftPositionSk} not found`);
  }

  position.assignedTo = undefined;
  position.updatedBy = userPk;
  position.updatedAt = new Date().toISOString();
  await shift_positions.update(position, "staging");

  return position as unknown as ShiftPosition;
};
