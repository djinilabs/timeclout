import pendingLeaveRequestsQuery from "@/graphql-client/queries/myPendingLeaveRequests.graphql";
import { useQuery } from "../hooks/useQuery";
import { Query } from "../graphql/graphql";
import { LeaveRequests } from "./stateless/LeaveRequests";

export interface PendingLeaveRequestsProps {
  companyPk?: string;
}

export const PendingLeaveRequests = ({
  companyPk,
}: PendingLeaveRequestsProps) => {
  const [pendingLeaveRequestResult] = useQuery<{
    pendingLeaveRequests: Query["pendingLeaveRequests"];
  }>({
    query: pendingLeaveRequestsQuery,
    variables: { companyPk },
    pollingIntervalMs: 10000,
  });
  const pendingLeaveRequests =
    pendingLeaveRequestResult.data?.pendingLeaveRequests;

  return <LeaveRequests leaveRequests={pendingLeaveRequests} />;
};
