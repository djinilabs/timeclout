import { LeaveRequest } from "../components/LeaveRequest";
import { Suspense } from "../components/stateless/Suspense";
export const PageLeaveRequest = () => {
  return (
    <Suspense>
      <LeaveRequest />
    </Suspense>
  );
};
