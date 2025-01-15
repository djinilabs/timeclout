import { Suspense } from "react";
import { PageLeaveRequest } from "../pages/PageLeaveRequest";

export const LeaveRequest = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PageLeaveRequest />
  </Suspense>
);
