import { resourceRef } from "@/utils";
import type { QueryResolvers } from "./../../../../types.generated";
import { ensureAuthorized } from "libs/graphql/src/auth/ensureAuthorized";
import { PERMISSION_LEVELS } from "@/tables";
import { getQuotaFulfilment } from "@/business-logic";

export const myQuotaFulfilment: NonNullable<QueryResolvers['myQuotaFulfilment']> = async (_parent, arg, ctx) => {
  const { companyPk, startDate, endDate } = arg;
  const companyRef = resourceRef("companies", companyPk);
  const userRef = await ensureAuthorized(
    ctx,
    companyRef,
    PERMISSION_LEVELS.READ
  );

  return getQuotaFulfilment({
    companyRef,
    userRef,
    startDate,
    endDate,
  });
};
