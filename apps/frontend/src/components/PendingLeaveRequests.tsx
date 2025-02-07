import ReactTimeAgo from "react-time-ago";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import pendingLeaveRequestsQuery from "@/graphql-client/queries/myPendingLeaveRequests.graphql";
import { useQuery } from "../hooks/useQuery";
import { Query } from "../graphql/graphql";
import { Avatar } from "./stateless/Avatar";

export const PendingLeaveRequests = () => {
  const [pendingLeaveRequestResult] = useQuery<{
    pendingLeaveRequests: Query["pendingLeaveRequests"];
  }>({
    query: pendingLeaveRequestsQuery,
    pollingIntervalMs: 10000,
  });
  const pendingLeaveRequests =
    pendingLeaveRequestResult.data?.pendingLeaveRequests;

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {pendingLeaveRequests?.length ? (
        pendingLeaveRequests?.map((leaveRequest) => {
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
                    >
                      {leaveRequest.beneficiary.email}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-4">
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm/6 text-gray-900">
                    <Link to={url}>{leaveRequest.type}</Link>
                  </p>
                  <p className="mt-1 text-xs/5 text-gray-500">
                    From {leaveRequest.startDate} to {leaveRequest.endDate}
                  </p>
                  <p className="mt-1 text-xs/5 text-gray-500">
                    Created{" "}
                    <ReactTimeAgo date={new Date(leaveRequest.createdAt)} />
                  </p>
                </div>
                <Link to={url}>
                  <ChevronRightIcon
                    aria-hidden="true"
                    className="size-5 flex-none text-gray-400"
                  />
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
                You have no pending leave requests
              </p>
            </div>
          </div>
        </li>
      )}
    </ul>
  );
};
