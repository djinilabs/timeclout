import { CreateTeamMemberLeaveRequest } from "../components/team/CreateTeamMemberLeaveRequest";
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
