import { useParams } from "react-router-dom";
import { useQuery } from "../../hooks/useQuery";
import myLeaveRequestsQuery from "@/graphql-client/queries/myLeaveRequests.graphql";
import { Query } from "../../graphql/graphql";
import { LeaveRequests } from "../stateless/LeaveRequests";

const MyLeaveRequests = () => {
  const { company } = useParams();

  const [myLeaveRequestResult] = useQuery<{
    myLeaveRequests: Query["myLeaveRequests"];
  }>({
    query: myLeaveRequestsQuery,
    variables: { companyPk: company },
    pollingIntervalMs: 10000,
  });
  const myLeaveRequests = myLeaveRequestResult.data?.myLeaveRequests;
  return <LeaveRequests leaveRequests={myLeaveRequests} showState />;
};

export default MyLeaveRequests;
