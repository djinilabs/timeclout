import { database } from "@/tables";
import { ResourceRef } from "@/utils";

export const userLeaveRequests = async (
  companyPk: ResourceRef<"companies">,
  userPk: ResourceRef<"users">
) => {
  const { leave_request } = await database();
  return leave_request.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": `${companyPk}/${userPk}`,
    },
    ScanIndexForward: false,
  });
};
