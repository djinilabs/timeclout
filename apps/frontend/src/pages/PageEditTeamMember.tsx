import { useNavigate, useParams } from "react-router-dom";
import { getDefined } from "@/utils";
import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { CreateOrEditTeamMember } from "../components/CreateOrEditTeamMember";
import { Suspense } from "../components/stateless/Suspense";

export const PageEditTeamMember = () => {
  const navigate = useNavigate();
  const { company, unit, team, member } = useParams();
  return (
    <Suspense>
      <div>
        <BreadcrumbNav />
        <CreateOrEditTeamMember
          teamPk={getDefined(team, "Team PK is required")}
          memberPk={getDefined(member, "Member PK is required")}
          onDone={() =>
            navigate(`/companies/${company}/units/${unit}/teams/${team}`)
          }
        />
      </div>
    </Suspense>
  );
};
