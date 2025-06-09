import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/20/solid";
import { Link, useParams } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import toast from "react-hot-toast";
import { Trans } from "@lingui/react/macro";
import { i18n } from "@lingui/core";
import { getDefined } from "@/utils";
import teamWithMembersQuery from "@/graphql-client/queries/teamWithMembers.graphql";
import removeUserFromTeamMutation from "@/graphql-client/mutations/removeUserFromTeam.graphql";
import { QueryTeamArgs, Team, User } from "../../graphql/graphql";
import { useQuery } from "../../hooks/useQuery";
import { useMutation } from "../../hooks/useMutation";
import { permissionTypeToString } from "../../utils/permissionTypeToString";
import { TeamMemberQualifications } from "./TeamMemberQualifications";
import { Avatar } from "../particles/Avatar";
import { Button } from "../particles/Button";

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
      <div className="flex justify-end gap-x-2">
        <Button
          to={`/companies/${company}/units/${unit}/teams/${teamPk}/members/new`}
          className="new-team-member-button"
        >
          <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />{" "}
          <Trans>Create member user</Trans>
        </Button>
        <Button
          to={`/companies/${company}/units/${unit}/teams/${teamPk}/invites/new`}
        >
          <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />{" "}
          <Trans>Invite to team</Trans>
        </Button>
      </div>
      <ul role="list" className="team-members-list divide-y divide-gray-100">
        {teamMembers.map((person: User) => (
          <li key={person.pk} className="flex justify-between gap-x-6 py-5">
            <div className="grid grid-cols-[1fr_3fr_1fr] items-center w-full gap-x-6">
              <div className="grid grid-cols-[60px_1fr] gap-x-2">
                <div className="hidden sm:block">
                  <Link
                    to={`/companies/${company}/units/${unit}/teams/${teamPk}/${person.pk}`}
                  >
                    <Avatar {...person} />
                  </Link>
                </div>
                <div>
                  <p className="text-sm/6 font-semibold text-gray-900">
                    <Link
                      to={`/companies/${company}/units/${unit}/teams/${teamPk}/${person.pk}`}
                      className="hover:underline"
                    >
                      {person.name}
                    </Link>
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

              <div className="hidden sm:flex justify-end">
                <TeamMemberQualifications
                  qualifications={
                    queryResponse.data?.team?.teamMembersQualifications.find(
                      (qualification) => qualification.userPk === person.pk
                    )?.qualifications ?? []
                  }
                  memberPk={person.pk}
                />
              </div>

              <div className="flex gap-x-6 justify-end min-w-[200px] max-w-[260px]">
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm/6 text-gray-900">
                    {permissionTypeToString(person.resourcePermission)}
                  </p>
                  {person.resourcePermissionGivenAt && (
                    <p className="mt-1 text-xs/5 text-gray-500">
                      <Trans>Joined</Trans>{" "}
                      <ReactTimeAgo
                        date={new Date(person.resourcePermissionGivenAt)}
                      />
                    </p>
                  )}
                </div>
                <Menu as="div" className="relative flex-none">
                  <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">
                      <Trans>Open options</Trans>
                    </span>
                    <EllipsisVerticalIcon
                      aria-hidden="true"
                      className="size-5"
                    />
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
                  >
                    <MenuItem>
                      <Link
                        to={`/companies/${company}/units/${unit}/teams/${teamPk}/${person.pk}`}
                        className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                      >
                        <Trans>Edit</Trans>
                        <span className="sr-only">, {person.name}</span>
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <a
                        onClick={async () => {
                          if (
                            !confirm(
                              i18n.t(
                                "Are you sure you want to remove this user from the team?"
                              )
                            )
                          ) {
                            return;
                          }
                          const response = await removeUserFromTeam({
                            teamPk,
                            userPk: person.pk,
                          });
                          if (!response.error) {
                            toast.success(
                              <Trans>User removed from team</Trans>
                            );
                          }
                        }}
                        className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                      >
                        <Trans>Remove from team</Trans>
                        <span className="sr-only">, {person.name}</span>
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
