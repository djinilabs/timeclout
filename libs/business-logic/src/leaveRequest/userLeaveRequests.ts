import { database, LeaveRequestRecord } from "@/tables";
import { ResourceRef } from "@/utils";

export const userLeaveRequests = async (
  companyPk: ResourceRef<"companies">,
  userPk: ResourceRef<"users">
): Promise<LeaveRequestRecord[]> => {
  const { leave_request } = await database();
  const result = await leave_request.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": `${companyPk}/${userPk}`,
    },
    ScanIndexForward: false,
  });
  return result.items;
};
