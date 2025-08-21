import { Trans } from "@lingui/react/macro";
import {
  AssignableTeamMembersInput,
  ShiftPosition,
  User,
} from "libs/graphql/src/types.generated";

import { useQuery } from "../../hooks/useQuery";
import { Avatar } from "../particles/Avatar";

import { Suspense } from "./Suspense";

import assignableTeamMembers from "@/graphql-client/queries/assignableTeamMembers.graphql";


export interface AssignableTeamMembersProps {
  teamPk: string;
  shiftPosition: ShiftPosition;
  onSelect: (member: User) => void;
}

const AssignableTeamMembersContent = ({
  teamPk,
  shiftPosition,
  onSelect,
}: AssignableTeamMembersProps) => {
  const [abc] = useQuery<
    { assignableTeamMembers: User[] },
    { input: AssignableTeamMembersInput }
  >({
    query: assignableTeamMembers,
    variables: {
      input: {
        shiftPositionPk: shiftPosition.pk,
        shiftPositionSk: shiftPosition.sk,
        teamPk,
      },
    },
  });
  const teamMembers = abc?.data?.assignableTeamMembers;

  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="px-4 py-2 text-sm text-gray-500">
        <Trans>No assignable team members</Trans>
      </div>
    );
  }

  return (
    <>
      {teamMembers.map((member) => (
        <button
          key={member.pk}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center gap-2 cursor-pointer hover:bg-gray-100"
          onClick={(ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            onSelect(member);
          }}
        >
          <Avatar size={20} {...member} />
          <span className="font-bold">{member.name}</span>
        </button>
      ))}
    </>
  );
};

export const AssignableTeamMembers = (props: AssignableTeamMembersProps) => {
  return (
    <Suspense>
      <AssignableTeamMembersContent {...props} />
    </Suspense>
  );
};
