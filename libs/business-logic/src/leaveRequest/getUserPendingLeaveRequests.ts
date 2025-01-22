import { getResourceRef, ResourceRef } from "@/utils";
import { database, LeaveRequestRecord } from "@/tables";
import { getCompanyPksTheUserManages } from "../company/getCompanyPksTheUserManages";

export const getUserPendingLeaveRequests = async (
  userPk: ResourceRef
): Promise<LeaveRequestRecord[]> => {
  const companyPksUserManages = await getCompanyPksTheUserManages(userPk);
  const { leave_request } = await database();
  return (
    await Promise.all(
      companyPksUserManages.map((companyPk) =>
        leave_request.query({
          KeyConditionExpression: "starts_with(pk, :companyPk)",
          ExpressionAttributeValues: {
            ":companyPk": getResourceRef(companyPk),
          },
        })
      )
    )
  ).flat();
};
