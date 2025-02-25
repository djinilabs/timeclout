import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { CreateTeamMemberLeaveRequest } from "../components/CreateTeamMemberLeaveRequest";
import { Suspense } from "../components/stateless/Suspense";

export const PageNewTeamMemberLeaveRequest = () => {
  return (
    <Suspense>
      <div>
        <BreadcrumbNav />
        <CreateTeamMemberLeaveRequest />
      </div>
    </Suspense>
  );
};
