import { Suspense } from "react";
import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { InviteToTeam } from "../components/InviteToTeam";
import { useNavigate, useParams } from "react-router-dom";

export const PageNewTeamInvite = () => {
  const navigate = useNavigate();
  const { company, unit, team } = useParams();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <BreadcrumbNav />
        <InviteToTeam
          teamPk={`teams/${team}`}
          onDone={() =>
            navigate(
              `/companies/${company}/units/${unit}/teams/${team}#invitations`
            )
          }
        />
      </div>
    </Suspense>
  );
};
