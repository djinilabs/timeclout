import { database } from "libs/tables/src/database";
import { resourceRef } from "@/utils";
import { PERMISSION_LEVELS } from "@/tables";
import type { QueryResolvers } from "./../../../../types.generated";
import { ensureAuthorized } from "../../../../auth/ensureAuthorized";

export const myLeaveCalendar: NonNullable<
  QueryResolvers["myLeaveCalendar"]
> = async (_parent, arg, ctx) => {
  const { companyPk, year } = arg;
  const companyRef = resourceRef("companies", companyPk);
  const userRef = await ensureAuthorized(
    ctx,
    companyRef,
    PERMISSION_LEVELS.READ
  );
  const leavePk = `${companyRef}/${userRef}`;

  const { leave_request, leave } = await database();
  const leaveRequests = (
    await Promise.all(
      [year - 1, year].map((year) =>
        leave_request.query({
          KeyConditionExpression:
            "pk = :pk AND begins_with(sk, :currentYearPrefix)",
          FilterExpression:
            "begins_with(endDate, :currentYearPrefix) OR begins_with(endDate, :nextYearPrefix)",
          ExpressionAttributeValues: {
            ":pk": leavePk,
            ":currentYearPrefix": `${year}-`,
            ":nextYearPrefix": `${year + 1}-`,
          },
        })
      )
    )
  ).flat();

  const leaves = await leave.query({
    KeyConditionExpression: "pk = :pk AND begins_with(sk, :currentYearPrefix)",
    ExpressionAttributeValues: {
      ":pk": leavePk,
      ":currentYearPrefix": `${year}-`,
    },
  });

  console.log("leaves", leaves);

  return {
    year,
    leaves,
    leaveRequests,
  };
};
