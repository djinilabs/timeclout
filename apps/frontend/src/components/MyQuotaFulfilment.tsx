import myQuotaFulfilmentQuery from "@/graphql-client/queries/myQuotaFulfilment.graphql";
import { useQuery } from "../hooks/useQuery";
import { Query, QueryMyQuotaFulfilmentArgs } from "../graphql/graphql";

export interface MyQuotaFulfilmentProps {
  companyPk: string;
  simulatesLeave: boolean;
  simulatesLeaveType: string;
  startDate: string;
  endDate: string;
}

export const MyQuotaFulfilment = ({
  companyPk,
  startDate,
  endDate,
  simulatesLeave,
  simulatesLeaveType,
}: MyQuotaFulfilmentProps) => {
  const [myQuotaFulfilment] = useQuery<
    { myQuotaFulfilment: Query["myQuotaFulfilment"] },
    QueryMyQuotaFulfilmentArgs
  >({
    query: myQuotaFulfilmentQuery,
    pause: !startDate || !endDate,
    variables: {
      companyPk,
      startDate,
      endDate,
      simulatesLeave,
      simulatesLeaveType,
    },
  });

  return (
    <ul>
      {myQuotaFulfilment.data?.myQuotaFulfilment.map((quota) => {
        const simulatedDaysLeft =
          quota.quota -
          quota.approvedUsed -
          quota.pendingApprovalUsed -
          (quota.simulatedUsed ?? 0);
        return (
          <li
            key={quota.quotaStartDate}
            className="flex flex-col text-gray-500 text-sm/6"
          >
            <span>
              For the quota starting at {quota.quotaStartDate} and ending at{" "}
              {quota.quotaEndDate} you have used{" "}
              <b>{quota.approvedUsed} days</b> and have{" "}
              <b>{quota.pendingApprovalUsed} days</b> pending approval.
            </span>
            {simulatesLeave && quota.simulatedUsed && (
              <>
                <span>
                  These leave days will deduct <b>{quota.simulatedUsed} days</b>{" "}
                  from your quota{" "}
                  {simulatedDaysLeft >= 0 ? (
                    <>
                      leaving you with <b>{simulatedDaysLeft} days</b> left.
                    </>
                  ) : (
                    "."
                  )}
                </span>
                <span>
                  {simulatedDaysLeft < 0 && (
                    <>
                      You will have exceeded your quota by{" "}
                      <b>{-simulatedDaysLeft} days</b>.
                    </>
                  )}
                </span>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
};
