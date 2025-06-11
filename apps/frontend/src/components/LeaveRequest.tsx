import { useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Trans } from "@lingui/react/macro";
import { i18n } from "@lingui/core";
import leaveRequestQuery from "@/graphql-client/queries/leaveRequest.graphql";
import approveLeaveRequestMutation from "@/graphql-client/mutations/approveLeaveRequest.graphql";
import rejectLeaveRequestMutation from "@/graphql-client/mutations/rejectLeaveRequest.graphql";
import deleteLeaveRequestMutation from "@/graphql-client/mutations/deleteLeaveRequest.graphql";
import { useQuery } from "../hooks/useQuery";
import { useMutation } from "../hooks/useMutation";
import {
  LeaveRequest as LeaveRequestType,
  QueryLeaveRequestArgs,
} from "../graphql/graphql";
import { LeaveRequest as LeaveRequestComponent } from "./atoms/LeaveRequest";
import { Button } from "./particles/Button";
import { useConfirmDialog } from "../hooks/useConfirmDialog";

export const LeaveRequest = ({ callbackUrl }: { callbackUrl?: string }) => {
  const navigate = useNavigate();
  const { showConfirmDialog } = useConfirmDialog();

  const { company, user, startDate, endDate, leaveType } = useParams();
  const backTo = useMemo(() => {
    const url = new URL(
      window.origin + (callbackUrl ?? `/companies/${company}`)
    );
    return {
      pathname: url.pathname,
      search: url.search,
    };
  }, [callbackUrl, company]);

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
      toast.success(i18n.t("Leave request rejected"));
      navigate(backTo);
    }
  }, [leaveRequest, navigate, rejectLeaveRequest, backTo]);

  const [, approveLeaveRequest] = useMutation(approveLeaveRequestMutation);
  const onApproveLeaveRequest = useCallback(async () => {
    if (!leaveRequest) {
      return;
    }
    const result = await approveLeaveRequest({
      input: { pk: leaveRequest.pk, sk: leaveRequest.sk },
    });
    if (!result.error) {
      toast.success(i18n.t("Leave request approved"));
      navigate(backTo);
    }
  }, [leaveRequest, navigate, approveLeaveRequest, backTo]);

  const [, removeLeaveRequest] = useMutation(deleteLeaveRequestMutation);
  const onRemoveLeaveRequest = useCallback(async () => {
    if (!leaveRequest) {
      return;
    }
    if (
      !(await showConfirmDialog({
        text: (
          <Trans>Are you sure you want to remove this leave request?</Trans>
        ),
      }))
    ) {
      return;
    }
    const result = await removeLeaveRequest({
      input: { pk: leaveRequest.pk, sk: leaveRequest.sk },
    });
    if (!result.error) {
      toast.success(i18n.t("Leave request removed"));
      navigate(backTo);
    }
  }, [leaveRequest, showConfirmDialog, removeLeaveRequest, navigate, backTo]);

  if (!leaveRequest) {
    return (
      <div>
        <Trans>LeaveRequest not found</Trans>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <LeaveRequestComponent {...leaveRequest} />
      <div className="flex gap-4 justify-end">
        <>
          <Button
            cancel
            onClick={() => navigate(callbackUrl ?? `/companies/${company}`)}
          >
            <Trans>Cancel</Trans>
          </Button>
          {leaveRequest.approved ? (
            <Button onClick={onRemoveLeaveRequest}>
              <Trans>Remove leave request</Trans>
            </Button>
          ) : (
            <>
              <Button cancel onClick={onRejectLeaveRequest}>
                <Trans>Reject leave request</Trans>
              </Button>
              <Button onClick={onApproveLeaveRequest}>
                <Trans>Approve leave request</Trans>
              </Button>
            </>
          )}
        </>
      </div>
    </div>
  );
};
