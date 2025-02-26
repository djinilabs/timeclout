import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import leaveRequestQuery from "@/graphql-client/queries/leaveRequest.graphql";
import approveLeaveRequestMutation from "@/graphql-client/mutations/approveLeaveRequest.graphql";
import rejectLeaveRequestMutation from "@/graphql-client/mutations/rejectLeaveRequest.graphql";
import deleteLeaveRequestMutation from "@/graphql-client/mutations/deleteLeaveRequest.graphql";
import { useQuery } from "../hooks/useQuery";
import {
  LeaveRequest as LeaveRequestType,
  QueryLeaveRequestArgs,
} from "../graphql/graphql";
import { LeaveRequest as LeaveRequestComponent } from "../components/stateless/LeaveRequest";
import { Button } from "../components/stateless/Button";
import { useMutation } from "../hooks/useMutation";
import { useCallback } from "react";

export const LeaveRequest = () => {
  const navigate = useNavigate();
  const { company, user, startDate, endDate, leaveType } = useParams();
  const [queryResult] = useQuery<
    { leaveRequest: LeaveRequestType },
    QueryLeaveRequestArgs
  >({
    query: leaveRequestQuery,
    variables: {
      pk: `companies/${company}/users/${user}`,
      sk: `${startDate}/${endDate}/${leaveType}`,
    },
  });
  const leaveRequest = queryResult.data?.leaveRequest;

  const [, rejectLeaveRequest] = useMutation(rejectLeaveRequestMutation);

  const onRejectLeaveRequest = useCallback(async () => {
    if (!leaveRequest) {
      return;
    }
    const result = await rejectLeaveRequest({
      input: { pk: leaveRequest.pk, sk: leaveRequest.sk },
    });
    if (!result.error) {
      toast.success("Leave request rejected");
      navigate(`/companies/${company}`);
    }
  }, [leaveRequest, company, navigate, rejectLeaveRequest]);

  const [, approveLeaveRequest] = useMutation(approveLeaveRequestMutation);
  const onApproveLeaveRequest = useCallback(async () => {
    if (!leaveRequest) {
      return;
    }
    const result = await approveLeaveRequest({
      input: { pk: leaveRequest.pk, sk: leaveRequest.sk },
    });
    if (!result.error) {
      toast.success("Leave request approved");
      navigate(`/companies/${company}`);
    }
  }, [leaveRequest, company, navigate, approveLeaveRequest]);

  const [, removeLeaveRequest] = useMutation(deleteLeaveRequestMutation);
  const onRemoveLeaveRequest = useCallback(async () => {
    if (!leaveRequest) {
      return;
    }
    const result = await removeLeaveRequest({
      input: { pk: leaveRequest.pk, sk: leaveRequest.sk },
    });
    if (!result.error) {
      toast.success("Leave request removed");
      navigate(`/companies/${company}`);
    }
  }, [leaveRequest, company, navigate, removeLeaveRequest]);

  if (!leaveRequest) {
    return <div>LeaveRequest not found</div>;
  }
  console.log("leaveRequest", leaveRequest);
  return (
    <div className="flex flex-col gap-4">
      <LeaveRequestComponent {...leaveRequest} />
      <div className="flex gap-4 justify-end">
        <>
          <Button cancel onClick={() => navigate(`/companies/${company}`)}>
            Back to company
          </Button>
          {leaveRequest.approved ? (
            <Button onClick={onRemoveLeaveRequest}>Remove leave request</Button>
          ) : (
            <>
              <Button cancel onClick={onRejectLeaveRequest}>
                Reject leave request
              </Button>
              <Button onClick={onApproveLeaveRequest}>
                Approve leave request
              </Button>
            </>
          )}
        </>
      </div>
    </div>
  );
};
