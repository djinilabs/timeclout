import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";

import type {
  MutationResolvers,
  ShiftPosition,
} from "./../../../../types.generated";

import { DayDate } from "@/day-date";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";



export const publishShiftPositions: NonNullable<MutationResolvers['publishShiftPositions']> = async (_parent, { input }, ctx) => {
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
    await shift_positions.merge(position.pk, position.sk, "staging");
    updatedPositions.push(position);
  }

  return updatedPositions as unknown as ShiftPosition[];
};
