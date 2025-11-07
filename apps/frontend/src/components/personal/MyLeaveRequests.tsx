import { useParams } from "react-router-dom";

import { Query } from "../../graphql/graphql";
import { useQuery } from "../../hooks/useQuery";
import { LeaveRequests } from "../atoms/LeaveRequests";

import myLeaveRequestsQuery from "@/graphql-client/queries/myLeaveRequests.graphql";

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
