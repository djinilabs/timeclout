import {
  AssignableTeamMembersInput,
  ShiftPosition,
  User,
} from "libs/graphql/src/types.generated";
import { Suspense } from "./Suspense";
import { useQuery } from "../../hooks/useQuery";
import assignableTeamMembers from "@/graphql-client/queries/assignableTeamMembers.graphql";
import { Menu, MenuItem } from "@headlessui/react";
import { classNames } from "../../utils/classNames";
import { Avatar } from "../particles/Avatar";
import { Trans } from "@lingui/react/macro";

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
  return teamMembers && teamMembers.length > 0 ? (
    <Menu>
      {teamMembers.map((member) => (
        <MenuItem key={member.pk}>
          <button
            className={classNames(
              "hover:bg-gray-100 w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center gap-2 cursor-pointer"
            )}
            onClick={() => {
              onSelect(member);
            }}
          >
            <Avatar size={20} {...member} />{" "}
            <span className="font-bold">{member.name}</span>
          </button>
        </MenuItem>
      ))}
    </Menu>
  ) : (
    <span className="text-gray-500">
      <Trans>No assignable team members</Trans>
    </span>
  );
};

export const AssignableTeamMembers = (props: AssignableTeamMembersProps) => {
  return (
    <Suspense>
      <AssignableTeamMembersContent {...props} />
    </Suspense>
  );
};
