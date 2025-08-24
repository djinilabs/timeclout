import { nanoid } from "nanoid";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type {
  MutationResolvers,
  ShiftPosition,
} from "./../../../../types.generated";

import { database, PERMISSION_LEVELS } from "@/tables";
import { getResourceRef } from "@/utils";


export const moveShiftPosition: NonNullable<MutationResolvers['moveShiftPosition']> = async (_parent, argument, context) => {
  const { shift_positions } = await database();
  const { input } = argument;
  const { pk: team, sk, day } = input;
  const pk = getResourceRef(team, "teams");
  const userPk = await ensureAuthorized(context, pk, PERMISSION_LEVELS.WRITE);
  const shiftPosition = await shift_positions.get(pk, sk, "staging");
  if (!shiftPosition) {
    throw new Error("Shift position not found");
  }
  await shift_positions.delete(pk, sk, "staging");
  const newSk = `${day}/${nanoid()}`;
  const newShiftPosition = {
    ...shiftPosition,
    sk: newSk,
    day,
    updatedBy: userPk,
    updatedAt: new Date().toISOString(),
  };
  console.log(
    "moveShiftPosition: creating new ShiftPosition",
    JSON.stringify(newShiftPosition, null, 2)
  );
  return shift_positions.create(
    newShiftPosition,
    "staging"
  ) as unknown as ShiftPosition;
};
