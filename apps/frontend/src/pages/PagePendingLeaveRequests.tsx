import { PendingLeaveRequests } from "../components/PendingLeaveRequests";
import { Suspense } from "../components/Suspense";

export const PagePendingLeaveRequests = () => {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
      <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="ml-4 mt-2">
          <h3 className="text-base font-semibold text-gray-900">
            Pending Leave Requests
          </h3>
        </div>
      </div>
      <Suspense>
        <PendingLeaveRequests />
      </Suspense>
    </div>
  );
};
