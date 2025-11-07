import { Suspense } from "../components/atoms/Suspense";
import { CreateTeamMemberLeaveRequest } from "../components/team/CreateTeamMemberLeaveRequest";

export const PageNewTeamMemberLeaveRequest = () => {
  return (
    <Suspense>
      <div>
        <CreateTeamMemberLeaveRequest />
      </div>
    </Suspense>
  );
};
