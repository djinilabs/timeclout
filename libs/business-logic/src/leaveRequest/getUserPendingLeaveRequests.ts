import { getCompanyPksTheUserManages } from "../company/getCompanyPksTheUserManages";

import { database, LeaveRequestRecord } from "@/tables";
import { getResourceRef, ResourceRef } from "@/utils";

export const getUserPendingLeaveRequests = async (
  userPk: ResourceRef<"users">,
  companyPk?: ResourceRef<"companies"> | null
): Promise<LeaveRequestRecord[]> => {
  let companyPksUserManages = await getCompanyPksTheUserManages(userPk);
  if (companyPk) {
    companyPksUserManages = companyPksUserManages.filter(
      (c) => c === companyPk
    );
  }
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
  ).flatMap(({ items }) => items);
};
