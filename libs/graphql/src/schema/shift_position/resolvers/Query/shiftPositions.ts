import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

import type {
  QueryResolvers,
  ShiftPosition,
} from "./../../../../types.generated";

import { DayDate } from "@/day-date";
import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";

export const shiftPositions: NonNullable<QueryResolvers['shiftPositions']> = async (_parent, argument, context) => {
  const { shift_positions } = await database();
  const { input } = argument;
  const { team, startDay, endDay, version } = input;
  const pk = resourceRef("teams", team);
  await ensureAuthorized(context, pk, PERMISSION_LEVELS.READ);
  const result = await shift_positions.query(
    {
      KeyConditionExpression: "pk = :pk AND sk BETWEEN :startDay AND :endDay",
      ExpressionAttributeValues: {
        ":pk": pk,
        ":startDay": startDay,
        ":endDay": new DayDate(endDay).nextDay().toString(),
      },
    },
    version
  );
  return {
    shiftPositions: result.items.sort((a, b) =>
      a.name && b.name
        ? a.name.localeCompare(b.name)
        : a.createdAt.localeCompare(b.createdAt)
    ) as ShiftPosition[],
    areAnyUnpublished: result.areAnyUnpublished,
  };
};
