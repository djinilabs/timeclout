import { DayDate } from "@/day-date";
import { database, LeaveRecord } from "@/tables";
import { ResourceRef } from "@/utils";

export const getLeavesForDateRange = async (
  companyReference: ResourceRef<"companies">,
  userReference: ResourceRef<"users">,
  startDate: DayDate,
  endDate: DayDate
): Promise<LeaveRecord[]> => {
  const { leave } = await database();
  const result = await leave.query({
    KeyConditionExpression: "pk = :pk AND sk BETWEEN :startDate AND :endDate",
    ExpressionAttributeValues: {
      ":pk": `${companyReference}/${userReference}`,
      ":startDate": startDate.toString(),
      ":endDate": endDate.toString(),
    },
  });
  return result.items;
};
