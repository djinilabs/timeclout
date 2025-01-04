import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "urql";
import { HomeIcon, PlusIcon } from "@heroicons/react/20/solid";
import { companyQuery } from "../graphql/queries/companyQuery";

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
            navigate(`/${companyPk}/units/new`);
          }}
        >
          <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />
          New Unit
        </button>
      </div>
    </div>
  );
};

export const AllCompanyUnits = () => {
  const { company: companyPk } = useParams();

  const [queryResponse] = useQuery({
    query: companyQuery,
    variables: {
      companyPk,
    },
  });

  const company = queryResponse.data?.company;

  const navigate = useNavigate();

  return (
    <div>
      <nav aria-label="Breadcrumb" className="flex">
        <ol
          role="list"
          className="flex space-x-4 rounded-md bg-white px-6 shadow"
        >
          <li key="home" className="flex">
            <div className="flex items-center">
              <a href="/" className="text-gray-400 hover:text-gray-500">
                <HomeIcon aria-hidden="true" className="size-5 shrink-0" />
                <span className="sr-only">Home</span>
              </a>
            </div>
          </li>
          <li key="companies" className="flex">
            <div className="flex items-center">
              <svg
                fill="currentColor"
                viewBox="0 0 24 44"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="h-full w-6 shrink-0 text-gray-200"
              >
                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
              </svg>
              <a
                href="/"
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Companies
              </a>
            </div>
          </li>
          {company ? (
            <li key={company.pk} className="flex">
              <div className="flex items-center">
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 44"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="h-full w-6 shrink-0 text-gray-200"
                >
                  <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                </svg>
                <a
                  href={`/${company.pk}`}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {company.name}
                </a>
              </div>
            </li>
          ) : null}
        </ol>
      </nav>

      {company?.units.length === 0 ? (
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
                  navigate(`/${companyPk}/units/new`);
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
  );
};
