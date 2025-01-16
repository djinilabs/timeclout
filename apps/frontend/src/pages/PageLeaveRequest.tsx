import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import leaveRequestQuery from "@/graphql-client/queries/leaveRequest.graphql";
import approveLeaveRequestMutation from "@/graphql-client/mutations/approveLeaveRequest.graphql";
import rejectLeaveRequestMutation from "@/graphql-client/mutations/rejectLeaveRequest.graphql";
import { useQuery } from "../hooks/useQuery";
import { LeaveRequest, QueryLeaveRequestArgs } from "../graphql/graphql";
import { LeaveRequest as LeaveRequestComponent } from "../components/LeaveRequest";
import { Button } from "../components/Button";
import { useMutation } from "../hooks/useMutation";

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

  const [, approveLeaveRequest] = useMutation(approveLeaveRequestMutation);
  const [, rejectLeaveRequest] = useMutation(rejectLeaveRequestMutation);

  const navigate = useNavigate();

  if (!leaveRequest) {
    return <div>LeaveRequest not found</div>;
  }
  console.log("leaveRequest", leaveRequest);
  return (
    <div className="flex flex-col gap-4">
      <LeaveRequestComponent {...leaveRequest} />
      <div className="flex gap-4 justify-end">
        <Button
          cancel
          onClick={async () => {
            const result = await rejectLeaveRequest({
              input: { pk: leaveRequest.pk, sk: leaveRequest.sk },
            });
            if (!result.error) {
              toast.success("Leave request rejected");
              navigate(`/companies/${company}`);
            }
          }}
        >
          Reject leave request
        </Button>
        <Button
          onClick={async () => {
            const result = await approveLeaveRequest({
              input: { pk: leaveRequest.pk, sk: leaveRequest.sk },
            });
            if (!result.error) {
              toast.success("Leave request approved");
              navigate(`/companies/${company}`);
            }
          }}
        >
          Approve leave request
        </Button>
      </div>
    </div>
  );
};
