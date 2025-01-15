import { useParams } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import { LeaveRequest, QueryLeaveRequestArgs } from "../graphql/graphql";
import leaveRequestQuery from "@/graphql-client/queries/leaveRequest.graphql";
import { LeaveRequest as LeaveRequestComponent } from "../components/LeaveRequest";

export const PageLeaveRequest = () => {
  console.log("PageLeaveRequest");
  const { company, user, startDate, endDate, leaveType } = useParams();
  const [queryResult] = useQuery<
    { leaveRequest: LeaveRequest },
    QueryLeaveRequestArgs
  >({
    query: leaveRequestQuery,
    variables: {
      pk: `companies/${company}/users/${user}`,
      sk: `${startDate}/${endDate}/${leaveType}`,
    },
  });
  const leaveRequest = queryResult.data?.leaveRequest;
  if (!leaveRequest) {
    return <div>LeaveRequest not found</div>;
  }
  console.log("leaveRequest", leaveRequest);
  return <LeaveRequestComponent {...leaveRequest} />;
};
