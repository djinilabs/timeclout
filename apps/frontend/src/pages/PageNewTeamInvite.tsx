import { useNavigate, useParams } from "react-router-dom";
import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { InviteToTeam } from "../components/InviteToTeam";
import { Suspense } from "../components/stateless/Suspense";

export const PageNewTeamInvite = () => {
  const navigate = useNavigate();
  const { company, unit, team } = useParams();
  return (
    <Suspense>
      <div>
        <BreadcrumbNav />
        <InviteToTeam
          teamPk={`teams/${team}`}
          onDone={() =>
            navigate(
              `/companies/${company}/units/${unit}/teams/${team}?tab=invitations`
            )
          }
        />
      </div>
    </Suspense>
  );
};
