import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useParams } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { Trans } from "@lingui/react/macro";
import invitationsToTeamQuery from "@/graphql-client/queries/invitationsToTeam.graphql";
import deleteInvitationMutation from "@/graphql-client/mutations/deleteInvitation.graphql";
import { Button } from "./stateless/Button";
import { useQuery } from "../hooks/useQuery";
import { Invitation, QueryInvitationsToArgs } from "../graphql/graphql";
import { Avatar } from "./stateless/Avatar";
import { permissionTypeToString } from "../utils/permissionTypeToString";
import { useMutation } from "../hooks/useMutation";

export const TeamInvites = () => {
  const { company, unit, team } = useParams();
  const [allInvitations] = useQuery<
    { invitationsTo: Invitation[] },
    QueryInvitationsToArgs
  >({
    query: invitationsToTeamQuery,
    variables: {
      toEntityPk: `teams/${team}`,
    },
    pollingIntervalMs: 10000,
  });

  const [, deleteInvitation] = useMutation(deleteInvitationMutation);

  return (
    <div className="mt-4">
      <p className="text-sm/6 text-gray-500">
        <Trans>Here you can invite users to your team.</Trans>
      </p>
      <div className="flex justify-end">
        <Button
          to={`/companies/${company}/units/${unit}/teams/${team}/invites/new`}
        >
          <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />{" "}
          <Trans>New Invitation</Trans>
        </Button>
      </div>
      {allInvitations?.data?.invitationsTo?.length === 0 && (
        <p className="text-sm/6 text-gray-500">
          <Trans>No invitations found.</Trans>
        </p>
      )}
      <ul role="list" className="divide-y divide-gray-100">
        {allInvitations?.data?.invitationsTo?.map((invitation: Invitation) => (
          <li
            key={invitation.email}
            className="flex justify-between gap-x-6 py-5"
          >
            <div className="flex min-w-0 gap-x-4">
              <Avatar email={invitation.email} emailMd5={invitation.emailMd5} />
              <div className="min-w-0 flex-auto">
                <p className="text-sm/6 font-semibold text-gray-900">
                  {invitation.sk}
                </p>
                <p className="mt-1 flex text-xs/5 text-gray-500">
                  <a
                    href={`mailto:${invitation.email}`}
                    className="truncate hover:underline"
                  >
                    {invitation.email}
                  </a>
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-6">
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="text-sm/6 text-gray-900">
                  {permissionTypeToString(invitation.permissionType) || (
                    <Trans>Unknown</Trans>
                  )}
                </p>
                <p className="mt-1 text-xs/5 text-gray-500">
                  <Trans>Invited</Trans>{" "}
                  <ReactTimeAgo date={new Date(invitation.createdAt)} />
                </p>
              </div>
              <Menu as="div" className="relative flex-none">
                <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                  <span className="sr-only">
                    <Trans>Open options</Trans>
                  </span>
                  <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <a
                      onClick={() => {
                        deleteInvitation({
                          pk: invitation.pk,
                          sk: invitation.email,
                        });
                      }}
                      className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                    >
                      <Trans>Revoke Invitation</Trans>
                      <span className="sr-only">, {invitation.email}</span>
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
