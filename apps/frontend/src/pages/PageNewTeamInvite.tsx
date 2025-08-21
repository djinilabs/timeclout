import { useNavigate, useParams } from "react-router-dom";

import { InviteToTeam } from "../components/InviteToTeam";

export const PageNewTeamInvite = () => {
  const navigate = useNavigate();
  const { company, unit, team } = useParams();
  return (
    <InviteToTeam
      teamPk={`teams/${team}`}
      onDone={() =>
        navigate(
          `/companies/${company}/units/${unit}/teams/${team}?tab=invitations`
        )
      }
    />
  );
};
