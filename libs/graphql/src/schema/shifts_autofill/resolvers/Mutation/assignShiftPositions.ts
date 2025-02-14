import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";
import type {
  MutationResolvers,
  ShiftPosition,
} from "./../../../../types.generated";
import { resourceRef } from "@/utils";
import { PERMISSION_LEVELS } from "@/tables";
import { assignShiftPositions as assignShiftPositionsLogic } from "@/business-logic";

export const assignShiftPositions: NonNullable<MutationResolvers['assignShiftPositions']> = async (_parent, arg, ctx) => {
  const {
    input: { team, assignments },
  } = arg;
  const pk = resourceRef("teams", team);
  const actorPk = await ensureAuthorized(ctx, pk, PERMISSION_LEVELS.WRITE);
  return assignShiftPositionsLogic(
    pk,
    assignments,
    actorPk
  ) as unknown as ShiftPosition[];
};
