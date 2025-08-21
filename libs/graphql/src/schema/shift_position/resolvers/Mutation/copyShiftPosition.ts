import { notFound } from "@hapi/boom";
import { nanoid } from "nanoid";

import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type {
  MutationResolvers,
  ShiftPosition,
} from "./../../../../types.generated";

import { i18n } from "@/locales";
import { database, PERMISSION_LEVELS } from "@/tables";
import { getResourceRef } from "@/utils";

export const copyShiftPosition: NonNullable<
  MutationResolvers["copyShiftPosition"]
> = async (_parent, arg, ctx) => {
  const { shift_positions } = await database();
  const { input } = arg;
  const { pk: team, sk, day } = input;
  const pk = getResourceRef(team, "teams");
  const userPk = await ensureAuthorized(ctx, pk, PERMISSION_LEVELS.WRITE);
  const shiftPosition = await shift_positions.get(pk, sk, "staging");
  if (!shiftPosition) {
    throw notFound(i18n._("Shift position not found"));
  }
  const newSk = `${day}/${nanoid()}`;
  const newShiftPosition = {
    ...shiftPosition,
    sk: newSk,
    day,
    updatedBy: userPk,
    updatedAt: new Date().toISOString(),
  };
  return shift_positions.create(
    newShiftPosition,
    "staging"
  ) as unknown as ShiftPosition;
};
