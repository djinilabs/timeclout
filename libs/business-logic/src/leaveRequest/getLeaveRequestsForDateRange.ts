import { LeaveRequestRecord } from "@/tables";
import { database } from "@/tables";
import { ResourceRef } from "@/utils";
import { DayDate } from "@/day-date";

export interface GetLeaveRequestsForDateRangeOptions {
  approved?: boolean;
}

export const getLeaveRequestsForDateRange = async (
  companyRef: ResourceRef<"companies">,
  userRef: ResourceRef<"users">,
  startDate: DayDate,
  endDate: DayDate,
  { approved }: GetLeaveRequestsForDateRangeOptions = {}
): Promise<LeaveRequestRecord[]> => {
  const { leave_request } = await database();
  let filterExpression = "endDate >= :startDate";
  const expressionAttributeValues: Record<string, unknown> = {
    ":pk": `${companyRef}/${userRef}`,
    ":startDate": startDate.toString(),
    ":endDate": endDate.toString(),
  };
  if (approved != null) {
    filterExpression += " AND approved = :approved";
    expressionAttributeValues[":approved"] = approved;
  }
  return (
    await leave_request.query({
      IndexName: "byPkAndStartDate",
      KeyConditionExpression: "pk = :pk AND startDate <= :endDate",
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    })
  ).items;
};
