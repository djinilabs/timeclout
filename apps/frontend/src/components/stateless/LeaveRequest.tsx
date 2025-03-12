import { memo } from "react";
import { Trans } from "@lingui/react/macro";
import { LeaveRequest as LeaveRequestType } from "../../graphql/graphql";
import { Avatar } from "./Avatar";
export type LeaveRequestProps = Pick<
  LeaveRequestType,
  | "createdBy"
  | "beneficiary"
  | "createdAt"
  | "startDate"
  | "endDate"
  | "type"
  | "reason"
  | "approved"
  | "approvedBy"
  | "approvedAt"
>;

export const LeaveRequest: React.FC<LeaveRequestProps> = memo(
  ({
    createdBy,
    beneficiary,
    createdAt,
    startDate,
    endDate,
    type,
    reason,
    approved,
    approvedBy,
    approvedAt,
  }: LeaveRequestType) => {
    return (
      <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-base font-semibold text-gray-900">
                {approved ? <Trans>Approved</Trans> : <Trans>Pending</Trans>}{" "}
                <Trans>Leave Request</Trans>
              </h3>
            </div>
          </div>
        </div>
        <div className="px-4 sm:p-4">
          <div className="mt-6">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium text-gray-500">
                  <Trans>Created By</Trans>:
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <Avatar {...createdBy} size={30} />
                  <p>{createdBy.name}</p>
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium text-gray-500">
                  <Trans>Beneficiary</Trans>:
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <Avatar {...beneficiary} size={30} />
                  <p>{beneficiary.name}</p>
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium text-gray-500">
                  <Trans>Created At</Trans>:
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {new Date(createdAt).toLocaleString()}
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium text-gray-500">
                  <Trans>Start Date</Trans>:
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {new Date(startDate).toLocaleDateString()}
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium text-gray-500">
                  <Trans>End Date</Trans>:
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {new Date(endDate).toLocaleDateString()}
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium text-gray-500">
                  <Trans>Type</Trans>:
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {type}
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium text-gray-500">
                  <Trans>Reason</Trans>:
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {reason}
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium text-gray-500">
                  <Trans>Status</Trans>:
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {approved ? <Trans>Approved</Trans> : <Trans>Pending</Trans>}
                </dd>
              </div>
              {approved && approvedBy && approvedAt && (
                <>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium text-gray-500">
                      <Trans>Approved By</Trans>:
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {approvedBy.map((user, index) => (
                        <div key={user.email} className="gap-2 mb-2">
                          <Avatar {...user} size={30} />
                          <p>{user.name}</p>
                          <span className="text-gray-500">
                            ({new Date(approvedAt[index]).toLocaleString()})
                          </span>
                        </div>
                      ))}
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </div>
      </div>
    );
  }
);
