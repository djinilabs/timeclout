import { useSearchParams } from "react-router-dom";
import { LeaveRequest } from "../components/LeaveRequest";
import { Suspense } from "../components/atoms/Suspense";
export const PageLeaveRequest = () => {
  const [searchParams] = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  return (
    <Suspense>
      <LeaveRequest callbackUrl={callbackUrl ?? undefined} />
    </Suspense>
  );
};
