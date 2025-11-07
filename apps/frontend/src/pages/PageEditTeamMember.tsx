import { useNavigate, useParams } from "react-router-dom";

import { Suspense } from "../components/atoms/Suspense";
import { CreateOrEditTeamMember } from "../components/team/CreateOrEditTeamMember";

import { getDefined } from "@/utils";

export const PageEditTeamMember = () => {
  const navigate = useNavigate();
  const { company, unit, team, member } = useParams();
  return (
    <Suspense>
      <CreateOrEditTeamMember
        teamPk={getDefined(team, "Team PK is required")}
        memberPk={getDefined(member, "Member PK is required")}
        onDone={() =>
          navigate(`/companies/${company}/units/${unit}/teams/${team}`)
        }
      />
    </Suspense>
  );
};
