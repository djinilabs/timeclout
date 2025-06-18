import { nanoid } from "nanoid";
import { getResourceRef } from "@/utils";
import { database, PERMISSION_LEVELS } from "@/tables";
import type {
  MutationResolvers,
  ShiftPosition,
} from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

export const moveShiftPosition: NonNullable<MutationResolvers['moveShiftPosition']> = async (_parent, arg, ctx) => {
  const { shift_positions } = await database();
  const { input } = arg;
  const { pk: team, sk, day } = input;
  const pk = getResourceRef(team, "teams");
  const userPk = await ensureAuthorized(ctx, pk, PERMISSION_LEVELS.WRITE);
  const shiftPosition = await shift_positions.get(pk, sk);
  if (!shiftPosition) {
    throw new Error("Shift position not found");
  }
  await shift_positions.delete(pk, sk);
  const newSk = `${day}/${nanoid()}`;
  const newShiftPosition = {
    ...shiftPosition,
    sk: newSk,
    day,
    updatedBy: userPk,
    updatedAt: new Date().toISOString(),
  };
  return shift_positions.create(newShiftPosition) as unknown as ShiftPosition;
};
