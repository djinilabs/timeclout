import { PlusIcon } from "@heroicons/react/20/solid";
import { Button } from "./Button";
import { useNavigate, useParams } from "react-router-dom";

export const TeamInvites = () => {
  const navigate = useNavigate();
  const { company, unit, team } = useParams();

  return (
    <div>
      Invites
      <Button
        onClick={() =>
          navigate(
            `/companies/${company}/units/${unit}/teams/${team}/invites/new`
          )
        }
      >
        <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" /> New
        Invite
      </Button>
    </div>
  );
};
