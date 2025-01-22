import { getResourceRef, ResourceRef } from "@/utils";
import { database, LeaveRequestRecord } from "@/tables";
import { getCompanyPksTheUserManages } from "../company/getCompanyPksTheUserManages";

export const getUserPendingLeaveRequests = async (
  userPk: ResourceRef
): Promise<LeaveRequestRecord[]> => {
  console.log("getUserPendingLeaveRequests", userPk);
  const companyPksUserManages = await getCompanyPksTheUserManages(userPk);
  console.log("companyPksUserManages", companyPksUserManages);
  const { leave_request } = await database();
  return (
    await Promise.all(
      companyPksUserManages.map((companyPk) =>
        leave_request.query({
          IndexName: "byCompanyPk",
          KeyConditionExpression: "companyPk = :companyPk",
          FilterExpression: "approved = :approved",
          ExpressionAttributeValues: {
            ":companyPk": getResourceRef(companyPk),
            ":approved": false,
          },
        })
      )
    )
  ).flat();
};
