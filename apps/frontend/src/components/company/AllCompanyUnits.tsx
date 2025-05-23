import { Link, useNavigate, useParams } from "react-router-dom";
import { PlusIcon, EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Trans } from "@lingui/react/macro";
import companyQuery from "@/graphql-client/queries/companyQuery.graphql";
import ReactTimeAgo from "react-time-ago";
import { useQuery } from "../../hooks/useQuery";
import { Button } from "../particles/Button";
import { Query, Unit } from "../../graphql/graphql";

const NoUnits = () => {
  const { company: companyPk } = useParams();
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
        <Trans>No units</Trans>
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        <Trans>Get started by creating a new unit for this company.</Trans>
      </p>
      <div className="mt-6">
        <button
          type="button"
          className="new-unit-buttoninline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          onClick={() => {
            navigate(`/companies/${companyPk}/units/new`);
          }}
        >
          <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />
          <Trans>New Unit</Trans>
        </button>
      </div>
    </div>
  );
};

const AllCompanyUnits = () => {
  const { company: companyPk } = useParams();

  const [queryResponse] = useQuery<{ company: Query["company"] }>({
    query: companyQuery,
    variables: {
      companyPk,
    },
    pollingIntervalMs: 10000,
  });

  const company = queryResponse.data?.company;

  return (
    <div>
      <div className="mt-4">
        {!company?.units?.length ? (
          <NoUnits />
        ) : (
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="mt-2 ml-auto shrink-0">
              <Button
                to={`/${company.pk}/units/new`}
                className="new-unit-button"
              >
                <Trans>Create new Unit</Trans>
              </Button>
            </div>
          </div>
        )}
      </div>

      <ul className="units-list">
        {company?.units?.map((unit: Unit) => (
          <li
            key={unit.pk}
            className="flex items-center justify-between gap-x-6 py-5"
          >
            <div key="unit-name" className="min-w-0">
              <div key="unit-name-header" className="flex items-start gap-x-3">
                <p className="text-sm/6 font-semibold text-gray-900 hover:underline">
                  <Link to={`/${company.pk}/${unit.pk}`}>{unit.name}</Link>
                </p>
              </div>
              <div
                key="unit-name-footer"
                className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500"
              >
                <p key="unit-name-footer-created" className="whitespace-nowrap">
                  <Trans>Created</Trans>{" "}
                  <ReactTimeAgo date={new Date(unit.createdAt)} />
                </p>
                <svg
                  key="unit-name-footer-separator"
                  viewBox="0 0 2 2"
                  className="size-0.5 fill-current"
                >
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <p key="unit-name-footer-created-by" className="truncate">
                  <Trans>Created by</Trans> {unit.createdBy.name}
                </p>
              </div>
            </div>
            <div
              key="unit-actions"
              className="flex flex-none items-center gap-x-4"
            >
              <Link
                to={`/${company.pk}/${unit.pk}`}
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
              >
                <Trans>View unit</Trans>
                <span className="sr-only">, {unit.name}</span>
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
                      to={`/${company.pk}/${unit.pk}`}
                      className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                    >
                      <Trans>Edit</Trans>
                      <span className="sr-only">, {unit.name}</span>
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

export default AllCompanyUnits;
