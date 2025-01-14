import { useParams } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import { LeaveRequest } from "../graphql/graphql";

export const PageLeaveRequest = () => {
  const { company, user, startDate, endDate, leavetype } = useParams();
  const [leaveRequest] = useQuery<{ leaveRequest: LeaveRequest }, QueryLeaveRequestArgs>({
    getLeaveRequest,
    {
      pk: company,
      sk: user,
    }
  );
  return <div>LeaveRequest</div>;
};
