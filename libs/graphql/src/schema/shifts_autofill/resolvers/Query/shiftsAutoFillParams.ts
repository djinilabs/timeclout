import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";

import type {
  QueryResolvers,
  ShiftsAutoFillParams as ShiftsAutoFillParameters,
} from "./../../../../types.generated";

import { shiftsAutoFillParams as shiftsAutoFillParametersLogic } from "@/business-logic";
import { PERMISSION_LEVELS } from "@/tables";
import { resourceRef } from "@/utils";

export const shiftsAutoFillParams: NonNullable<QueryResolvers['shiftsAutoFillParams']> = async (_parent, argument, context) => {
  const {
    input: { team, startDay, endDay },
  } = argument;
  const pk = resourceRef("teams", team);
  await ensureAuthorized(context, pk, PERMISSION_LEVELS.WRITE);
  return shiftsAutoFillParametersLogic(
    pk,
    startDay,
    endDay
  ) as unknown as ShiftsAutoFillParameters;
};
