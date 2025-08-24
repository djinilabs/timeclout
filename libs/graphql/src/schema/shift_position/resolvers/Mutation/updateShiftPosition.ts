import { nanoid } from "nanoid";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type {
  MutationResolvers,
  ShiftPosition,
} from "./../../../../types.generated";

import { i18n } from "@/locales";
import { database, PERMISSION_LEVELS } from "@/tables";
import { getResourceRef } from "@/utils";

export const updateShiftPosition: NonNullable<
  MutationResolvers["updateShiftPosition"]
> = async (_parent, argument, context) => {
  const { shift_positions } = await database();
  const { input } = argument;
  const {
    pk: _pk,
    sk,
    day,
    name,
    color,
    requiredSkills,
    schedules,
    assignedTo,
    replaces,
  } = input;
  const pk = getResourceRef(_pk, "teams");
  const userPk = await ensureAuthorized(context, pk, PERMISSION_LEVELS.WRITE);
  const shiftPosition = await shift_positions.get(pk, sk, "staging");
  if (!shiftPosition) {
    throw new Error(i18n._("Shift position not found"));
  }
  const newSk = `${day}/${nanoid()}`;
  await shift_positions.delete(pk, sk, "staging");
  const newShiftPosition = {
    ...shiftPosition,
    sk: newSk,
    day,
    name: name ?? undefined,
    color: color ?? undefined,
    requiredSkills,
    schedules,
    assignedTo: assignedTo ?? undefined,
    replaces: replaces ?? undefined,
    updatedBy: userPk,
    updatedAt: new Date().toISOString(),
  };
  return shift_positions.create(
    newShiftPosition,
    "staging"
  ) as unknown as ShiftPosition;
};
