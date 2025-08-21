import { notFound } from "@hapi/boom";
import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";

import type {
  MutationResolvers,
  ShiftPosition,
} from "./../../../../types.generated";

import { database , PERMISSION_LEVELS } from "@/tables";
import { getResourceRef } from "@/utils";

export const deleteShiftPosition: NonNullable<MutationResolvers['deleteShiftPosition']> = async (_parent, arg, ctx) => {
  const { shift_positions } = await database();
  const { input } = arg;
  const { pk: team, sk } = input;
  const pk = getResourceRef(team, "teams");
  await ensureAuthorized(ctx, pk, PERMISSION_LEVELS.WRITE);
  const shiftPosition = await shift_positions.get(pk, sk, "staging");
  if (!shiftPosition) {
    throw notFound("Shift position not found");
  }
  return shift_positions.delete(
    pk,
    sk,
    "staging"
  ) as unknown as Promise<ShiftPosition>;
};
