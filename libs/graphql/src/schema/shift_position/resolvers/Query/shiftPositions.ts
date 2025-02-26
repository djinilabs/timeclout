import { database, PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";
import type {
  QueryResolvers,
  ShiftPosition,
} from "./../../../../types.generated";

export const shiftPositions: NonNullable<
  QueryResolvers["shiftPositions"]
> = async (_parent, arg, ctx) => {
  const { shift_positions } = await database();
  const { input } = arg;
  const { team, startDay, endDay } = input;
  const pk = resourceRef("teams", team);
  await ensureAuthorized(ctx, pk, PERMISSION_LEVELS.READ);
  const result = await shift_positions.query({
    KeyConditionExpression: "pk = :pk AND sk BETWEEN :startDay AND :endDay",
    ExpressionAttributeValues: {
      ":pk": pk,
      ":startDay": startDay,
      ":endDay": endDay,
    },
  });
  return result as unknown as ShiftPosition[];
};
