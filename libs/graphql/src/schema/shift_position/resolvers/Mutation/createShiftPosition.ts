import { nanoid } from "nanoid";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";
import type {
  MutationResolvers,
  ShiftPosition,
} from "./../../../../types.generated";
import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";

export const createShiftPosition: NonNullable<
  MutationResolvers["createShiftPosition"]
> = async (_parent, arg, ctx) => {
  const { shift_positions } = await database();
  const { input } = arg;
  const { team, day, name, color, requiredSkills, schedules, assignedTo } =
    input;
  const pk = resourceRef("teams", team);
  const userPk = await ensureAuthorized(ctx, pk, PERMISSION_LEVELS.WRITE);
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
    published: false,
    replaces: undefined,
  };
  console.log("shiftPosition:", shiftPosition);
  await shift_positions.create(shiftPosition);
  return shiftPosition as unknown as ShiftPosition;
};
