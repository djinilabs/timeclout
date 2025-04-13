import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";
import type {
  MutationResolvers,
  ShiftPosition,
} from "./../../../../types.generated";
import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";

export const unassignShiftPositions: NonNullable<
  MutationResolvers["unassignShiftPositions"]
> = async (
  _parent: unknown,
  arg: { input: { team: string; startDay: string; endDay: string } },
  ctx
) => {
  const { shift_positions } = await database();
  const { input } = arg;
  const { team, startDay, endDay } = input;
  const pk = resourceRef("teams", team);
  const userPk = await ensureAuthorized(ctx, pk, PERMISSION_LEVELS.WRITE);

  const positions = await shift_positions.query({
    KeyConditionExpression: "pk = :pk AND sk BETWEEN :startDay AND :endDay",
    ExpressionAttributeValues: {
      ":pk": pk,
      ":startDay": startDay,
      ":endDay": endDay,
    },
  });

  const updatedPositions = await Promise.all(
    positions.map(async (position) => {
      if (position.assignedTo) {
        position.assignedTo = undefined;
        position.updatedBy = userPk;
        position.updatedAt = new Date().toISOString();
        await shift_positions.update(position);
      }
      return position;
    })
  );

  return updatedPositions as unknown as ShiftPosition[];
};
