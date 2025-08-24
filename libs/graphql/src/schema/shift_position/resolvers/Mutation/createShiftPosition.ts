import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";
import { nanoid } from "nanoid";

import type {
  MutationResolvers,
  ShiftPosition,
} from "./../../../../types.generated";

import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";

export const createShiftPosition: NonNullable<MutationResolvers['createShiftPosition']> = async (_parent, argument, context) => {
  const { shift_positions } = await database();
  const { input } = argument;
  const { team, day, name, color, requiredSkills, schedules, assignedTo } =
    input;
  const pk = resourceRef("teams", team);
  const userPk = await ensureAuthorized(context, pk, PERMISSION_LEVELS.WRITE);
  const sk = `${day}/${nanoid()}`;
  const shiftPosition = {
    pk,
    sk,
    createdBy: userPk,
    createdAt: new Date().toISOString(),
    teamPk: pk,
    day,
    name: name ?? undefined,
    color: color ?? undefined,
    requiredSkills,
    schedules,
    assignedTo: assignedTo ?? undefined,
    replaces: undefined,
  };
  console.log("shiftPosition:", shiftPosition);
  await shift_positions.create(shiftPosition, "staging");
  return shiftPosition as unknown as ShiftPosition;
};
