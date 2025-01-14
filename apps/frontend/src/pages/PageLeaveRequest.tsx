import { useParams } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import { LeaveRequest, QueryLeaveRequestArgs } from "../graphql/graphql";
import leaveRequestQuery from "@/graphql-client/queries/leaveRequest.graphql";
import { getDefined } from "@/utils";
import { LeaveRequest as LeaveRequestComponent } from "../components/LeaveRequest";

export const PageLeaveRequest = () => {
  const { company, user, startDate, endDate, leaveType } = useParams();
  const [leaveRequest] = useQuery<
    { leaveRequest: LeaveRequest },
    QueryLeaveRequestArgs
  >({
    query: leaveRequestQuery,
    variables: {
      pk: `companies/${company}/users/${user}`,
      sk: `${startDate}/${endDate}/${leaveType}`,
    },
  });
  if (!leaveRequest) {
    return <div>LeaveRequest not found</div>;
  }
  return <LeaveRequestComponent {...leaveRequest} />;
};
