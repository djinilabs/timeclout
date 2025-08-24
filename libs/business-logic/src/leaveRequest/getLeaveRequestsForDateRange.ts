import { DayDate } from "@/day-date";
import { LeaveRequestRecord , database } from "@/tables";
import { ResourceRef } from "@/utils";

export interface GetLeaveRequestsForDateRangeOptions {
  approved?: boolean;
}

export const getLeaveRequestsForDateRange = async (
  companyReference: ResourceRef<"companies">,
  userReference: ResourceRef<"users">,
  startDate: DayDate,
  endDate: DayDate,
  { approved }: GetLeaveRequestsForDateRangeOptions = {}
): Promise<LeaveRequestRecord[]> => {
  const { leave_request } = await database();
  let filterExpression = "endDate >= :startDate";
  const expressionAttributeValues: Record<string, unknown> = {
    ":pk": `${companyReference}/${userReference}`,
    ":startDate": startDate.toString(),
    ":endDate": endDate.toString(),
  };
  if (approved != undefined) {
    filterExpression += " AND approved = :approved";
    expressionAttributeValues[":approved"] = approved;
  }
  const result = await leave_request.query({
    IndexName: "byPkAndStartDate",
    KeyConditionExpression: "pk = :pk AND startDate <= :endDate",
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  });
  return result.items;
};
