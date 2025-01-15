import { LeaveRequest as LeaveRequestType } from "../graphql/graphql";

export const LeaveRequest = ({
  createdBy,
  createdAt,
  startDate,
  endDate,
  type,
  reason,
}: LeaveRequestType) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
      <div className="px-4 py-5 sm:p-4">
        <div className="px-4 sm:px-0">
          <h2 className="text-base/7 font-semibold text-gray-900">
            Leave Request Details
          </h2>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-500">Created By:</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {createdBy}
              </dd>
            </div>
            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-500">Created At:</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {new Date(createdAt).toLocaleString()}
              </dd>
            </div>
            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-500">Start Date:</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {startDate}
              </dd>
            </div>
            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-500">End Date:</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {endDate}
              </dd>
            </div>
            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-500">Type:</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {type}
              </dd>
            </div>
            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-500">Reason:</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {reason}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};
