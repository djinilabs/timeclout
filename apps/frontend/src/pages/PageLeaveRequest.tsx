import { useSearchParams } from "react-router-dom";

import { Suspense } from "../components/atoms/Suspense";
import { LeaveRequest } from "../components/LeaveRequest";
export const PageLeaveRequest = () => {
  const [searchParameters] = useSearchParams();
  const callbackUrl = searchParameters.get("callbackUrl");
  return (
    <Suspense>
      <LeaveRequest callbackUrl={callbackUrl ?? undefined} />
    </Suspense>
  );
};
