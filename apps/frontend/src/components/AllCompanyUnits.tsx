import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "urql";
import { HomeIcon, PlusIcon } from "@heroicons/react/20/solid";
import { companyQuery } from "../graphql/queries/companyQuery";
import { BreadcrumbNav } from "./BreadcrumbNav";

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
      <BreadcrumbNav />
      <div className="mt-4">
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
    </div>
  );
};
