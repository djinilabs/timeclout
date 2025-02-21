import { useNavigate, useParams } from "react-router-dom";
import { getDefined } from "@/utils";
import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { CreateTeamMember } from "../components/CreateTeamMember";
import { Suspense } from "../components/stateless/Suspense";

export const PageNewTeamMember = () => {
  const navigate = useNavigate();
  const { company, unit, team } = useParams();
  return (
    <Suspense>
      <div>
        <BreadcrumbNav />
        <CreateTeamMember
          teamPk={getDefined(team, "Team PK is required")}
          onDone={() =>
            navigate(`/companies/${company}/units/${unit}/teams/${team}`)
          }
        />
      </div>
    </Suspense>
  );
};
