import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ClockIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Link, useParams } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import toast from "react-hot-toast";
import { Trans } from "@lingui/react/macro";
import { getDefined } from "@/utils";
import teamWithMembersQuery from "@/graphql-client/queries/teamWithMembers.graphql";
import removeUserFromTeamMutation from "@/graphql-client/mutations/removeUserFromTeam.graphql";
import { QueryTeamArgs, Team, User } from "../../graphql/graphql";
import { useQuery } from "../../hooks/useQuery";
import { useMutation } from "../../hooks/useMutation";
import { useConfirmDialog } from "../../hooks/useConfirmDialog";
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

  const { showConfirmDialog } = useConfirmDialog();

  if (!teamMembers) {
    return null;
  }

  return (
    <div className="mt-4" role="region" aria-label="Team Members">
      <div className="flex justify-end gap-x-2">
        <Button
          to={`/companies/${company}/units/${unit}/teams/${teamPk}/members/new`}
          className="new-team-member-button relative inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 hover:scale-110 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-600 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-teal-600 disabled:hover:scale-100 transition duration-300"
          aria-label="Create new team member"
        >
          <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />{" "}
          <Trans>Create member user</Trans>
        </Button>
        <Button
          to={`/companies/${company}/units/${unit}/teams/${teamPk}/invites/new`}
          aria-label="Invite new member to team"
        >
          <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />{" "}
          <Trans>Invite to team</Trans>
        </Button>
      </div>
      <ul
        role="list"
        className="team-members-list divide-y divide-gray-100"
        aria-label="List of team members"
      >
        {teamMembers.map((person: User) => (
          <li
            key={person.pk}
            className="flex justify-between gap-x-6 py-5"
            role="listitem"
            aria-label={person.name}
          >
            <div className="grid grid-cols-[1fr_3fr_1fr] items-center w-full gap-x-6">
              <div className="grid grid-cols-[60px_1fr] gap-x-2">
                <div className="hidden sm:block">
                  <Link
                    to={`/companies/${company}/units/${unit}/teams/${teamPk}/${person.pk}`}
                    aria-label={`View profile of ${person.name}`}
                    aria-clickable
                    role="link"
                    aria-describedby={`member-${person.pk}-name`}
                  >
                    <Avatar {...person} />
                  </Link>
                </div>
                <div>
                  <p
                    className="text-sm/6 font-semibold text-gray-900"
                    id={`member-${person.pk}-name`}
                  >
                    <Link
                      to={`/companies/${company}/units/${unit}/teams/${teamPk}/${person.pk}`}
                      className="hover:underline"
                      aria-label={`View profile of ${person.name}`}
                      aria-clickable
                      role="link"
                      aria-describedby={`member-${person.pk}-email`}
                    >
                      {person.name}
                    </Link>
                  </p>
                  <p
                    className="mt-1 flex text-xs/5 text-gray-500"
                    id={`member-${person.pk}-email`}
                  >
                    <a
                      href={`mailto:${person.email}`}
                      className="truncate hover:underline"
                      aria-label={`Send email to ${person.name} at ${person.email}`}
                      aria-clickable
                      role="link"
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
                  <p
                    className="text-sm/6 text-gray-900"
                    aria-label={`${person.name}'s permission level`}
                  >
                    {permissionTypeToString(person.resourcePermission)}
                  </p>
                  {person.resourcePermissionGivenAt && (
                    <p
                      className="mt-1 text-xs/5 text-gray-500 flex items-center gap-x-1"
                      aria-label={`${person.name}'s join date`}
                    >
                      <ClockIcon className="size-4" />
                      <Trans>Joined</Trans>{" "}
                      <ReactTimeAgo
                        date={new Date(person.resourcePermissionGivenAt)}
                      />
                    </p>
                  )}
                </div>
                <Menu as="div" className="relative flex-none">
                  <MenuButton
                    className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900"
                    aria-label={`Open options menu for ${person.name}`}
                  >
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
                    className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
                    aria-label={`Options menu for ${person.name}`}
                  >
                    <MenuItem>
                      <Link
                        to={`/companies/${company}/units/${unit}/teams/${teamPk}/${person.pk}`}
                        className="px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden flex items-center gap-x-2"
                        aria-label={`Edit ${person.name}'s profile`}
                        aria-clickable
                        role="link"
                        aria-describedby={`edit-${person.pk}-description`}
                      >
                        <PencilIcon className="size-4" />
                        <Trans>Edit</Trans>
                        <span
                          className="sr-only"
                          id={`edit-${person.pk}-description`}
                        >
                          , {person.name}
                        </span>
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <button
                        type="button"
                        onClick={async () => {
                          if (
                            !(await showConfirmDialog({
                              text: (
                                <Trans>
                                  Are you sure you want to remove this user from
                                  the team?
                                </Trans>
                              ),
                            }))
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
                        className="px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden flex items-center gap-x-2 w-full cursor-pointer whitespace-nowrap"
                        aria-label={`Remove ${person.name} from team`}
                        aria-clickable
                        role="button"
                      >
                        <TrashIcon className="size-4" />
                        <Trans>Remove from team</Trans>
                        <span className="sr-only">, {person.name}</span>
                      </button>
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
