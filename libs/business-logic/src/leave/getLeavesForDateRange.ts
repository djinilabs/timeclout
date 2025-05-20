import { database, LeaveRecord } from "@/tables";
import { ResourceRef } from "@/utils";
import { DayDate } from "@/day-date";

export const getLeavesForDateRange = async (
  companyRef: ResourceRef,
  userRef: ResourceRef,
  startDate: DayDate,
  endDate: DayDate
): Promise<LeaveRecord[]> => {
  const { leave } = await database();
  return leave.query({
    KeyConditionExpression: "pk = :pk AND sk BETWEEN :startDate AND :endDate",
    ExpressionAttributeValues: {
      ":pk": `${companyRef}/${userRef}`,
      ":startDate": startDate.toString(),
      ":endDate": endDate.nextDay().toString(),
    },
  });
};
