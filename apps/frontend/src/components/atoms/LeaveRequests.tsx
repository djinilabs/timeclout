import { FC } from "react";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Trans } from "@lingui/react/macro";
import { LeaveRequest } from "../../graphql/graphql";
import { Avatar } from "../particles/Avatar";

export interface LeaveRequestsProps {
  leaveRequests?: LeaveRequest[];
  showState?: boolean;
}

export const LeaveRequests: FC<LeaveRequestsProps> = ({
  leaveRequests,
  showState,
}) => {
  return (
    <ul role="list" className="request-actions divide-y divide-gray-100">
      {leaveRequests?.length ? (
        leaveRequests.map((leaveRequest) => {
          const url = `/${leaveRequest.pk}/leave-requests/${leaveRequest.sk}`;
          return (
            <li
              key={leaveRequest.pk}
              className="relative flex justify-between gap-x-6 py-5"
            >
              <div className="flex min-w-0 gap-x-4">
                <Avatar {...leaveRequest.beneficiary} />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm/6 font-semibold text-gray-900">
                    <span className="inset-x-0 -top-px bottom-0" />
                    {leaveRequest.beneficiary.name}
                  </p>
                  <p className="mt-1 flex text-xs/5 text-gray-500">
                    <a
                      href={`mailto:${leaveRequest.beneficiary.email}`}
                      className="relative truncate hover:underline"
                      aria-label={`Send email to ${leaveRequest.beneficiary.name} at ${leaveRequest.beneficiary.email}`}
                      aria-clickable
                      role="link"
                      aria-describedby={`email-${leaveRequest.pk}-description`}
                    >
                      {leaveRequest.beneficiary.email}
                      <span
                        className="sr-only"
                        id={`email-${leaveRequest.pk}-description`}
                      >
                        <Trans>Email address</Trans>
                      </span>
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-4">
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm/6 text-gray-900">
                    <Link
                      aria-clickable
                      role="link"
                      aria-label={`View ${leaveRequest.type} leave request`}
                      to={url}
                      aria-describedby={`leave-type-${leaveRequest.pk}-description`}
                    >
                      {leaveRequest.type}
                      <span
                        className="sr-only"
                        id={`leave-type-${leaveRequest.pk}-description`}
                      >
                        <Trans>Leave request type</Trans>
                      </span>
                    </Link>
                  </p>
                  <p className="mt-1 text-xs/5 text-gray-500">
                    <Trans>From</Trans> {leaveRequest.startDate}{" "}
                    <Trans>to</Trans> {leaveRequest.endDate}
                  </p>
                  {showState && (
                    <p className="mt-1 text-xs/5 text-gray-500">
                      {leaveRequest.approved ? (
                        <Trans>Approved</Trans>
                      ) : (
                        <Trans>Pending</Trans>
                      )}
                    </p>
                  )}
                  <p className="mt-1 text-xs/5 text-gray-500">
                    <Trans>Created</Trans>{" "}
                    <ReactTimeAgo date={new Date(leaveRequest.createdAt)} />
                  </p>
                </div>
                <Link
                  aria-clickable
                  role="link"
                  aria-label={`View ${leaveRequest.type} leave request`}
                  to={url}
                  aria-describedby={`view-details-${leaveRequest.pk}-description`}
                >
                  <ChevronRightIcon
                    aria-hidden="true"
                    className="size-5 flex-none text-gray-400"
                  />
                  <span
                    className="sr-only"
                    id={`view-details-${leaveRequest.pk}-description`}
                  >
                    <Trans>View leave request details</Trans>
                  </span>
                </Link>
              </div>
            </li>
          );
        })
      ) : (
        <li className="relative flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-gray-900">
                <Trans>You have no pending leave requests</Trans>
              </p>
            </div>
          </div>
        </li>
      )}
    </ul>
  );
};
