import { PlusIcon } from "@heroicons/react/20/solid";
import { useParams } from "react-router-dom";
import { Button } from "./Button";

export const TeamInvites = () => {
  const { company, unit, team } = useParams();

  return (
    <div>
      Invitations
      <Button
        to={`/companies/${company}/units/${unit}/teams/${team}/invites/new`}
      >
        <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" /> New
        Invitation
      </Button>
    </div>
  );
};
