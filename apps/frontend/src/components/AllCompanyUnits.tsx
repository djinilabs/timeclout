import { Link, useNavigate, useParams } from "react-router-dom";
import { PlusIcon, EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { companyQuery } from "../graphql/queries/companyQuery";
import { BreadcrumbNav } from "./BreadcrumbNav";
import { classNames } from "../utils/classNames";
import ReactTimeAgo from "react-time-ago";
import { useQuery } from "../hooks/useQuery";

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
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No units</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new unit for this company.
      </p>
      <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => {
            navigate(`/companies/${companyPk}/units/new`);
          }}
        >
          <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />
          New Unit
        </button>
      </div>
    </div>
  );
};

const statuses = {
  Complete: "text-green-700 bg-green-50 ring-green-600/20",
  "In progress": "text-gray-600 bg-gray-50 ring-gray-500/10",
  Archived: "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
};

export const AllCompanyUnits = () => {
  const { company: companyPk } = useParams();

  const [queryResponse] = useQuery({
    query: companyQuery,
    variables: {
      companyPk,
    },
    pollingIntervalMs: 10000,
  });

  const company = queryResponse.data?.company;

  const navigate = useNavigate();

  return (
    <div>
      <BreadcrumbNav />
      <div className="mt-4">
        {!company?.units.length ? (
          <NoUnits />
        ) : (
          <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
            <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-2">
                <h3 className="text-base font-semibold text-gray-900">Units</h3>
              </div>
              <div className="ml-4 mt-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/${company.pk}/units/new`);
                  }}
                  className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Create new Unit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ul>
        {company?.units.map((unit) => (
          <>
            <li
              key={unit.pk}
              className="flex items-center justify-between gap-x-6 py-5"
            >
              <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                  <p className="text-sm/6 font-semibold text-gray-900">
                    {unit.name}
                  </p>
                  <p
                    className={classNames(
                      statuses["In progress"],
                      "mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                    )}
                  >
                    In progress
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
                  <p className="whitespace-nowrap">
                    Created <ReactTimeAgo date={unit.createdAt} />
                  </p>
                  <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                    <circle r={1} cx={1} cy={1} />
                  </svg>
                  <p className="truncate">Created by {unit.createdBy.name}</p>
                </div>
              </div>
              <div className="flex flex-none items-center gap-x-4">
                <Link
                  to={`/${company.pk}/${unit.pk}`}
                  className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                >
                  View unit<span className="sr-only">, {unit.name}</span>
                </Link>
                <Menu as="div" className="relative flex-none">
                  <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon
                      aria-hidden="true"
                      className="size-5"
                    />
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <MenuItem>
                      <Link
                        to={`/${company.pk}/${unit.pk}`}
                        className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                      >
                        Edit<span className="sr-only">, {unit.name}</span>
                      </Link>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </li>
          </>
        ))}
      </ul>
    </div>
  );
};
