import { LeaveRequestRecord } from "@/tables";

import { database } from "@/tables";
import { ResourceRef } from "@/utils";
export const getLeaveRequestsForDateRange = async (
  companyRef: ResourceRef,
  userRef: ResourceRef,
  startDate: string,
  endDate: string
): Promise<LeaveRequestRecord[]> => {
  const { leave_request } = await database();
  return leave_request.query({
    IndexName: "byPkAndStartDate",
    KeyConditionExpression: "pk = :pk AND startDate <= :endDate",
    FilterExpression: "endDate >= :startDate",
    ExpressionAttributeValues: {
      ":pk": `${companyRef}/${userRef}`,
      ":startDate": startDate,
      ":endDate": endDate,
    },
  });
};
