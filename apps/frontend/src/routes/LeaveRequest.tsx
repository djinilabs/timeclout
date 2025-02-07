import { Suspense } from "../components/stateless/Suspense";
import { PageLeaveRequest } from "../pages/PageLeaveRequest";

export const LeaveRequest = () => (
  <Suspense>
    <PageLeaveRequest />
  </Suspense>
);
