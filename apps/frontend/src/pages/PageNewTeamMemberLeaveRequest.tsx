import { CreateTeamMemberLeaveRequest } from "../components/CreateTeamMemberLeaveRequest";
import { Suspense } from "../components/atoms/Suspense";

export const PageNewTeamMemberLeaveRequest = () => {
  return (
    <Suspense>
      <div>
        <CreateTeamMemberLeaveRequest />
      </div>
    </Suspense>
  );
};
