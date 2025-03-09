import { HomeIcon } from "@heroicons/react/20/solid";
import { Link, useParams } from "react-router-dom";
import { Trans } from "@lingui/react/macro";
import companyQuery from "@/graphql-client/queries/companyQuery.graphql";
import teamQuery from "@/graphql-client/queries/teamQuery.graphql";
import { useQuery } from "../hooks/useQuery";
import { Query, QueryCompanyArgs } from "../graphql/graphql";

export const BreadcrumbNav = () => {
  const { company: companyPk, unit: unitPk, team: teamPk } = useParams();

  const [queryResponse] = useQuery<
    { company: Query["company"] },
    QueryCompanyArgs
  >({
    query: companyQuery,
    variables: {
      companyPk: companyPk ?? "",
    },
    pause: !companyPk,
  });

  const company = companyPk ? queryResponse.data?.company : undefined;

  const unit = company?.units?.find((unit) => unit.pk === `units/${unitPk}`);

  const [teamQueryResponse] = useQuery<{ team: Query["team"] }>({
    query: teamQuery,
    variables: {
      teamPk,
    },
    pause: !teamPk,
  });

  const team = teamPk && teamQueryResponse.data?.team;

  return (
    <nav aria-label="Breadcrumb" className="flex h-full">
      <ol
        role="list"
        className="flex space-x-4 rounded-md bg-white px-6 shadow h-full"
      >
        <li key="home" className="flex">
          <div className="flex items-center">
            <Link to="/companies" className="text-gray-400 hover:text-gray-500">
              <HomeIcon aria-hidden="true" className="size-5 shrink-0" />
              <span className="sr-only">
                <Trans>Home</Trans>
              </span>
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
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap"
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
                      className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap"
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
                        className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap"
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
