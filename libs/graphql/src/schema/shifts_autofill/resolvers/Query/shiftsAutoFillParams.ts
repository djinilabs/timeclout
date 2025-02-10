import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";
import type {
  QueryResolvers,
  ShiftsAutoFillParams,
} from "./../../../../types.generated";
import { resourceRef } from "@/utils";
import { PERMISSION_LEVELS } from "@/tables";
import { shiftsAutoFillParams as shiftsAutoFillParamsLogic } from "@/business-logic";

export const shiftsAutoFillParams: NonNullable<QueryResolvers['shiftsAutoFillParams']> = async (_parent, arg, ctx) => {
  const {
    input: { team, startDay, endDay },
  } = arg;
  const pk = resourceRef("teams", team);
  await ensureAuthorized(ctx, pk, PERMISSION_LEVELS.WRITE);
  return shiftsAutoFillParamsLogic(
    pk,
    startDay,
    endDay
  ) as unknown as ShiftsAutoFillParams;
};
