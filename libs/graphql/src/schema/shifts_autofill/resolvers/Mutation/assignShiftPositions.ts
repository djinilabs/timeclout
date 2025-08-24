import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";

import type {
  MutationResolvers,
  ShiftPosition,
} from "./../../../../types.generated";

import { assignShiftPositions as assignShiftPositionsLogic } from "@/business-logic";
import { PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";

export const assignShiftPositions: NonNullable<MutationResolvers['assignShiftPositions']> = async (_parent, argument, context) => {
  const {
    input: { team, assignments },
  } = argument;
  const pk = resourceRef("teams", team);
  const actorPk = await ensureAuthorized(context, pk, PERMISSION_LEVELS.WRITE);
  return assignShiftPositionsLogic(
    pk,
    assignments,
    actorPk
  ) as unknown as ShiftPosition[];
};
