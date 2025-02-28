import { FC } from "react";
import { Trans } from "@lingui/react/macro";
import memberQuotaFulfilmentQuery from "@/graphql-client/queries/memberQuotaFulfilment.graphql";
import { useQuery } from "../hooks/useQuery";
import { Query, QueryMemberQuotaFulfilmentArgs } from "../graphql/graphql";

export interface MemberQuotaFulfilmentProps {
  companyPk: string;
  teamPk: string;
  userPk: string;
  simulatesLeave: boolean;
  simulatesLeaveType: string;
  startDate: string;
  endDate: string;
}

export const MemberQuotaFulfilment: FC<MemberQuotaFulfilmentProps> = ({
  companyPk,
  teamPk,
  userPk,
  startDate,
  endDate,
  simulatesLeave,
  simulatesLeaveType,
}) => {
  const [myQuotaFulfilment] = useQuery<
    { memberQuotaFulfilment: Query["memberQuotaFulfilment"] },
    QueryMemberQuotaFulfilmentArgs
  >({
    query: memberQuotaFulfilmentQuery,
    pause: !startDate || !endDate,
    variables: {
      companyPk,
      teamPk,
      userPk,
      startDate,
      endDate,
      simulatesLeave,
      simulatesLeaveType,
    },
  });

  return (
    <ul>
      {myQuotaFulfilment.data?.memberQuotaFulfilment.map((quota) => {
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
              <Trans>
                For the quota starting at {quota.quotaStartDate} and ending at{" "}
                {quota.quotaEndDate} they have used{" "}
                <b>{quota.approvedUsed} days</b> and have{" "}
                <b>{quota.pendingApprovalUsed} days</b> pending approval.
              </Trans>
            </span>
            {simulatesLeave && quota.simulatedUsed ? (
              <>
                <span>
                  <Trans>
                    These leave days will deduct{" "}
                    <b>{quota.simulatedUsed} days</b> from your quota{" "}
                  </Trans>
                  {simulatedDaysLeft >= 0 ? (
                    <>
                      <Trans>
                        leaving them with <b>{simulatedDaysLeft} days</b> left.
                      </Trans>
                    </>
                  ) : (
                    "."
                  )}
                </span>
                <span>
                  {simulatedDaysLeft < 0 && (
                    <Trans>
                      They will have exceeded their quota by{" "}
                      <b>{-simulatedDaysLeft} days</b>.
                    </Trans>
                  )}
                </span>
              </>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};
