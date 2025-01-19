import myQuotaFulfilmentQuery from "@/graphql-client/queries/myQuotaFulfilment.graphql";
import { useQuery } from "../hooks/useQuery";
import { Query, QueryMyQuotaFulfilmentArgs } from "../graphql/graphql";

export interface MyQuotaFulfilmentProps {
  companyPk: string;
  startDate: string;
  endDate: string;
}

export const MyQuotaFulfilment = ({
  companyPk,
  startDate,
  endDate,
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
    },
  });

  return (
    <ul>
      {myQuotaFulfilment.data?.myQuotaFulfilment.map((quota) => {
        return (
          <li
            key={quota.quotaStartDate}
            className="flex flex-col text-gray-500"
          >
            <span>
              For the quota starting at {quota.quotaStartDate} and ending at{" "}
              {quota.quotaEndDate} you have used{" "}
              <b>{quota.approvedUsed} days</b> and have{" "}
              <b>{quota.pendingApprovalUsed} days</b> pending approval.
            </span>
          </li>
        );
      })}
    </ul>
  );
};
