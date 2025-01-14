import { HomeIcon } from "@heroicons/react/20/solid";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import companyQuery from "@/graphql-client/queries/companyQuery.graphql";
import teamQuery from "@/graphql-client/queries/teamQuery.graphql";

export const BreadcrumbNav = () => {
  const { company: companyPk, unit: unitPk, team: teamPk } = useParams();

  const [queryResponse] = useQuery({
    query: companyQuery,
    variables: {
      companyPk,
    },
  });

  const company = queryResponse.data?.company;

  const unit = company?.units.find(
    (unit: any) => unit.pk === `units/${unitPk}`
  );

  const [teamQueryResponse] = useQuery({
    query: teamQuery,
    variables: {
      teamPk,
    },
    pause: !teamPk,
  });

  const team = teamQueryResponse.data?.team;

  return (
    <nav aria-label="Breadcrumb" className="flex mb-8">
      <ol
        role="list"
        className="flex space-x-4 rounded-md bg-white px-6 shadow"
      >
        <li key="home" className="flex">
          <div className="flex items-center">
            <Link to="/" className="text-gray-400 hover:text-gray-500">
              <HomeIcon aria-hidden="true" className="size-5 shrink-0" />
              <span className="sr-only">Home</span>
            </Link>
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
            <Link
              to="/"
              className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Companies
            </Link>
          </div>
        </li>
        {company ? (
          <>
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
                <Link
                  to={`/${company.pk}`}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {company.name}
                </Link>
              </div>
            </li>
            {unit ? (
              <>
                <li key={unit.pk} className="flex">
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
                    <Link
                      to={`/${company.pk}/${unit.pk}`}
                      className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      {unit.name}
                    </Link>
                  </div>
                </li>
                {team ? (
                  <li key={team.pk} className="flex">
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
                      <Link
                        to={`/${company.pk}/${unit.pk}/${team.pk}`}
                        className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                      >
                        {team.name}
                      </Link>
                    </div>
                  </li>
                ) : null}
              </>
            ) : null}
          </>
        ) : null}
      </ol>
    </nav>
  );
};
