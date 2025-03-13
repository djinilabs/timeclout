import { Link, useNavigate, useParams } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { PlusIcon, EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Trans } from "@lingui/react/macro";
import unitQuery from "@/graphql-client/queries/unitQuery.graphql";
import { useQuery } from "../hooks/useQuery";
import { Query, Team } from "../graphql/graphql";

const NoTeams = () => {
  const { company: companyPk, unit: unitPk } = useParams();
  const navigate = useNavigate();
  return (
    <div className="text-center">
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="mx-auto size-12 text-gray-400"
      >
        <path
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        <Trans>No teams</Trans>
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        <Trans>Get started by creating a new team for this unit.</Trans>
      </p>
      <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          onClick={() => {
            navigate(`/companies/${companyPk}/units/${unitPk}/teams/new`);
          }}
        >
          <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />
          <Trans>New Team</Trans>
        </button>
      </div>
    </div>
  );
};

export const AllUnitTeams = () => {
  const { company: companyPk, unit: unitPk } = useParams();

  const [queryResponse] = useQuery<{ unit: Query["unit"] }>({
    query: unitQuery,
    variables: {
      unitPk,
    },
    pollingIntervalMs: 10000,
  });

  const unit = queryResponse.data?.unit;

  const navigate = useNavigate();

  return (
    <div>
      <div className="mt-4">
        {!unit?.teams.length ? (
          <NoTeams />
        ) : (
          <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
            <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-2"></div>
              <button
                type="button"
                onClick={() => {
                  navigate(`/companies/${companyPk}/units/${unitPk}/teams/new`);
                }}
                className="ml-4 mt-2 shrink-0 relative inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                <Trans>Create new team</Trans>
              </button>
            </div>
          </div>
        )}
      </div>

      <ul>
        {unit?.teams.map((team: Team) => (
          <li
            key={team.pk}
            className="flex items-center justify-between gap-x-6 py-5"
          >
            <div key="team-container" className="min-w-0">
              <div
                key="team-name-container"
                className="flex items-start gap-x-3"
              >
                <p
                  key="team-name"
                  className="text-sm/6 font-semibold text-gray-900"
                >
                  <Link
                    to={`/companies/${companyPk}/units/${unitPk}/${team.pk}`}
                    className="hover:underline"
                  >
                    {team.name}
                  </Link>
                </p>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
                <p className="whitespace-nowrap">
                  <Trans>Created</Trans>{" "}
                  <ReactTimeAgo date={new Date(team.createdAt)} />
                </p>
                <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <p className="truncate">
                  <Trans>Created by</Trans> {team.createdBy.name}
                </p>
              </div>
            </div>
            <div
              key="team-actions-container"
              className="flex flex-none items-center gap-x-4"
            >
              <Link
                key="team-view-link"
                to={`/companies/${companyPk}/${unit.pk}/${team.pk}`}
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
              >
                <Trans>View team</Trans>
                <span className="sr-only">, {team.name}</span>
              </Link>
              <Menu as="div" className="relative flex-none">
                <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                  <span className="sr-only">
                    <Trans>Open options</Trans>
                  </span>
                  <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
                >
                  <MenuItem>
                    <Link
                      to={`/companies/${companyPk}/${unit.pk}/${team.pk}`}
                      className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                    >
                      <Trans>Edit</Trans>
                      <span className="sr-only">, {team.name}</span>
                    </Link>
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
