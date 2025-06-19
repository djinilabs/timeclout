import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";
import type {
  MutationResolvers,
  ShiftPosition,
} from "./../../../../types.generated";
import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";
import { DayDate } from "@/day-date";

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

  console.log("unassign shift positions", pk, startDay, endDay);

  const endDayDate = new DayDate(endDay);

  const { items: positions } = await shift_positions.query(
    {
      KeyConditionExpression: "pk = :pk AND sk BETWEEN :startDay AND :endDay",
      ExpressionAttributeValues: {
        ":pk": pk,
        ":startDay": startDay,
        ":endDay": endDayDate.nextDay().toString(),
      },
    },
    "staging"
  );

  const updatedPositions = await Promise.all(
    positions.map(async (position) => {
      if (position.assignedTo) {
        position.assignedTo = undefined;
        position.updatedBy = userPk;
        position.updatedAt = new Date().toISOString();
        await shift_positions.update(position, "staging");
      }
      return position;
    })
  );

  return updatedPositions as unknown as ShiftPosition[];
};
