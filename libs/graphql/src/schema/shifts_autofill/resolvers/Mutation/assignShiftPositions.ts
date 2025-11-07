import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";

import type {
  MutationResolvers,
  ShiftPosition,
} from "./../../../../types.generated";

import { assignShiftPositions as assignShiftPositionsLogic } from "@/business-logic";
import { PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";

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
