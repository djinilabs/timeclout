import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";

import type {
  MutationResolvers,
  ShiftPosition,
} from "./../../../../types.generated";

import { DayDate } from "@/day-date";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";



export const revertShiftPositions: NonNullable<MutationResolvers['revertShiftPositions']> = async (_parent, { input }, ctx) => {
  const { team, startDay, endDay } = input;
  const pk = resourceRef("teams", team);
  await ensureAuthorized(ctx, pk, PERMISSION_LEVELS.WRITE);

  console.log("unassign shift positions", pk, startDay, endDay);

  const endDayDate = new DayDate(endDay);

  const { shift_positions } = await database();
  const { items: positions } = await shift_positions.query({
    KeyConditionExpression: "pk = :pk AND sk BETWEEN :startDay AND :endDay",
    ExpressionAttributeValues: {
      ":pk": pk,
      ":startDay": startDay,
      ":endDay": endDayDate.nextDay().toString(),
    },
  });

  const updatedPositions = [];
  for (const position of positions) {
    const updatedPosition = await shift_positions.revert(
      position.pk,
      position.sk,
      "staging"
    );
    updatedPositions.push(updatedPosition);
  }

  return updatedPositions as unknown as ShiftPosition[];
};
