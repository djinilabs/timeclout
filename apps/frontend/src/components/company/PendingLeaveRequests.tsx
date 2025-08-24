import { Query } from "../../graphql/graphql";
import { useQuery } from "../../hooks/useQuery";
import { LeaveRequests } from "../atoms/LeaveRequests";

import pendingLeaveRequestsQuery from "@/graphql-client/queries/myPendingLeaveRequests.graphql";

export interface PendingLeaveRequestsProperties {
  companyPk?: string;
}

export const PendingLeaveRequests = ({
  companyPk,
}: PendingLeaveRequestsProperties) => {
  const [pendingLeaveRequestResult] = useQuery<{
    pendingLeaveRequests: Query["pendingLeaveRequests"];
  }>({
    query: pendingLeaveRequestsQuery,
    variables: { companyPk },
    pollingIntervalMs: 10_000,
  });
  const pendingLeaveRequests =
    pendingLeaveRequestResult.data?.pendingLeaveRequests;

  return <LeaveRequests leaveRequests={pendingLeaveRequests} />;
};
