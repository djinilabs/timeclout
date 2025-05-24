import { useNavigate, useParams } from "react-router-dom";
import { getDefined } from "@/utils";
import { CreateOrEditTeamMember } from "../components/team/CreateOrEditTeamMember";
import { Suspense } from "../components/atoms/Suspense";

export const PageNewTeamMember = () => {
  const navigate = useNavigate();
  const { company, unit, team } = useParams();
  return (
    <Suspense>
      <div>
        <CreateOrEditTeamMember
          teamPk={getDefined(team, "Team PK is required")}
          onDone={() =>
            navigate(`/companies/${company}/units/${unit}/teams/${team}`)
          }
        />
      </div>
    </Suspense>
  );
};
