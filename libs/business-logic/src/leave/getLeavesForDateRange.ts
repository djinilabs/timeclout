import { database, LeaveRecord } from "@/tables";
import { ResourceRef } from "@/utils";

export const getLeavesForDateRange = async (
  companyRef: ResourceRef,
  userRef: ResourceRef,
  startDate: string,
  endDate: string
): Promise<LeaveRecord[]> => {
  const { leave } = await database();
  return leave.query({
    KeyConditionExpression: "pk = :pk AND sk BETWEEN :startDate AND :endDate",
    ExpressionAttributeValues: {
      ":pk": `${companyRef}/${userRef}`,
      ":startDate": startDate,
      ":endDate": endDate,
    },
  });
};
