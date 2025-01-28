import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useParams } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import toast from "react-hot-toast";
import { Button } from "./Button";
import teamWithMembersQuery from "@/graphql-client/queries/teamWithMembers.graphql";
import { useQuery } from "../hooks/useQuery";
import { Avatar } from "./Avatar";
import { permissionTypeToString } from "../utils/permissionTypeToString";
import { useMutation } from "../hooks/useMutation";
import removeUserFromTeamMutation from "@/graphql-client/mutations/removeUserFromTeam.graphql";
import { QueryTeamArgs, Team, User } from "../graphql/graphql";
import { getDefined } from "@/utils";

export const TeamMembers = () => {
  const { company, unit, team: teamPk } = useParams();

  const [queryResponse] = useQuery<{ team: Team }, QueryTeamArgs>({
    query: teamWithMembersQuery,
    variables: {
      teamPk: getDefined(teamPk, "No team provided"),
    },
  });

  const teamMembers = queryResponse.data?.team?.members;

  const [, removeUserFromTeam] = useMutation(removeUserFromTeamMutation);

  if (!teamMembers) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex justify-end">
        <Button
          to={`/companies/${company}/units/${unit}/teams/${teamPk}/invites/new`}
        >
          <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />{" "}
          Invite to team
        </Button>
      </div>
      <ul role="list" className="divide-y divide-gray-100">
        {teamMembers.map((person: User) => (
          <li key={person.email} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <Avatar email={person.email} emailMd5={person.emailMd5} />
              <div className="min-w-0 flex-auto">
                <p className="text-sm/6 font-semibold text-gray-900">
                  {person.name}
                </p>
                <p className="mt-1 flex text-xs/5 text-gray-500">
                  <a
                    href={`mailto:${person.email}`}
                    className="truncate hover:underline"
                  >
                    {person.email}
                  </a>
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-6">
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="text-sm/6 text-gray-900">
                  {permissionTypeToString(person.resourcePermission)}
                </p>
                {person.resourcePermissionGivenAt && (
                  <p className="mt-1 text-xs/5 text-gray-500">
                    Joined{" "}
                    <ReactTimeAgo
                      date={new Date(person.resourcePermissionGivenAt)}
                    />
                  </p>
                )}
              </div>
              <Menu as="div" className="relative flex-none">
                <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <a
                      onClick={async () => {
                        const response = await removeUserFromTeam({
                          teamPk,
                          userPk: person.pk,
                        });
                        if (!response.error) {
                          toast.success("User removed from team");
                        }
                      }}
                      className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                    >
                      Remove from team
                      <span className="sr-only">, {person.name}</span>
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
