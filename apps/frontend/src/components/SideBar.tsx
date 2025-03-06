import {
  BuildingOfficeIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Trans } from "@lingui/react/macro";
import { i18n } from "@lingui/core";
import { classNames } from "../utils/classNames";
import { Link, useLocation, useParams } from "react-router-dom";
import { Company, Team, Unit } from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";
import allCompaniesQuery from "@/graphql-client/queries/allCompanies.graphql";
import allUnitsQuery from "@/graphql-client/queries/allUnits.graphql";
import allTeamsQuery from "@/graphql-client/queries/allTeams.graphql";

export const SideBar = () => {
  const { company } = useParams();
  const [allCompaniesResult] = useQuery<{ companies: Company[] }>({
    query: allCompaniesQuery,
  });

  const allCompanies = allCompaniesResult.data?.companies ?? [];

  const [allUnitsResult] = useQuery<{ units: Unit[] }>({
    query: allUnitsQuery,
    variables: {
      pause: company == null,
    },
  });

  const allUnits = allUnitsResult.data?.units ?? [];

  const [allTeamsResult] = useQuery<{ allTeams: Team[] }>({
    query: allTeamsQuery,
    variables: {
      pause: company == null,
    },
  });

  const allTeams = allTeamsResult.data?.allTeams ?? [];

  const location = useLocation();

  const navigation = [
    { name: i18n.t("Home"), href: "/", icon: HomeIcon },
    ...allCompanies.map((company) => ({
      name: company.name,
      href: `/${company.pk}`,
      icon: BuildingOfficeIcon,
    })),
    ...allUnits.map((unit) => ({
      name: unit.name,
      href: `/${unit.companyPk}/${unit.pk}`,
      icon: FolderIcon,
    })),
    ...allTeams.map((team) => ({
      name: team.name,
      href: `/${team.companyPk}/${team.unitPk}/${team.pk}`,
      icon: UsersIcon,
    })),
    {
      name: i18n.t("Leave Requests"),
      href: "/leave-requests/pending",
      icon: DocumentDuplicateIcon,
    },
  ];

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-teal-600 px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <a href="/homepage">
          <img
            alt="Team Time Table"
            src="/images/tt3-logo-white.svg"
            className="h-20 w-auto"
          />
        </a>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={classNames(
                      location.pathname === item.href
                        ? "bg-teal-700 text-white"
                        : "text-teal-200 hover:bg-teal-700 hover:text-white",
                      "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold animate duration-200"
                    )}
                  >
                    <item.icon
                      aria-hidden="true"
                      className={classNames(
                        location.pathname === item.href
                          ? "text-white"
                          : "text-teal-200 group-hover:text-white",
                        "size-6 shrink-0"
                      )}
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <Link
              to="/me/edit"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-teal-200 hover:bg-teal-700 hover:text-white animate duration-200"
            >
              <Cog6ToothIcon
                aria-hidden="true"
                className="size-6 shrink-0 text-teal-200 group-hover:text-white"
              />
              <Trans>Settings</Trans>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
