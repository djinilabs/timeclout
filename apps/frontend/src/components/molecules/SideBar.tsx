import { useMemo } from "react";
import {
  BuildingOfficeIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import { Trans } from "@lingui/react/macro";
import { i18n } from "@lingui/core";
import { Link, useLocation, useParams } from "react-router-dom";
import allCompaniesQuery from "@/graphql-client/queries/allCompanies.graphql";
import allUnitsQuery from "@/graphql-client/queries/allUnits.graphql";
import allTeamsQuery from "@/graphql-client/queries/allTeams.graphql";
import { Company, Team, Unit } from "../../graphql/graphql";
import { classNames } from "../../utils/classNames";
import { useQuery } from "../../hooks/useQuery";
import { version } from "../../../../../package.json";

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  sepBefore?: boolean;
  sepAfter?: boolean;
}

export interface SideBarProps {
  expanded: boolean;
  alwaysExpanded?: boolean;
  setExpanded: (expanded: boolean) => void;
  onSelect?: () => void;
}

const SideBar = ({
  expanded,
  alwaysExpanded,
  setExpanded,
  onSelect,
}: SideBarProps) => {
  const { company } = useParams();
  const [allCompaniesResult] = useQuery<{ companies: Company[] }>({
    query: allCompaniesQuery,
  });

  const allCompanies = useMemo(
    () => allCompaniesResult.data?.companies ?? [],
    [allCompaniesResult.data]
  );

  const [allUnitsResult] = useQuery<{ units: Unit[] }>({
    query: allUnitsQuery,
    variables: {
      pause: company == null,
    },
  });

  const allUnits = useMemo(
    () => allUnitsResult.data?.units ?? [],
    [allUnitsResult.data]
  );

  const [allTeamsResult] = useQuery<{ allTeams: Team[] }>({
    query: allTeamsQuery,
    variables: {
      pause: company == null,
    },
  });

  const allTeams = useMemo(
    () => allTeamsResult.data?.allTeams ?? [],
    [allTeamsResult.data]
  );

  const location = useLocation();

  const navigation: Array<NavigationItem> = useMemo(
    () => [
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
        sepBefore: true,
      },
    ],
    [allCompanies, allTeams, allUnits]
  );

  return (
    <div
      className={`no-print flex grow flex-col gap-y-5 overflow-y-auto bg-teal-600 pb-4 relative transition-all duration-300 ${
        expanded ? "px-6 w-72" : "px-2 w-16"
      }`}
    >
      <div className="flex h-16 shrink-0 items-center">
        <a
          href="https://tt3.app"
          aria-label="Team Time Table Home"
          aria-clickable
          role="link"
          aria-describedby="tt3-logo-description"
        >
          <img
            alt="Team Time Table"
            src="/images/tt3-logo.svg"
            className={`h-20 w-auto mt-2 transition-opacity duration-300 ${
              expanded ? "opacity-100" : "opacity-0"
            }`}
            id="tt3-logo-description"
          />
        </a>
      </div>
      <nav className="flex flex-1 flex-col" aria-label="Main navigation">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul
              role="list"
              className="-mx-2 space-y-1"
              aria-label="Navigation items"
            >
              {navigation.map((item) => (
                <li
                  key={item.name}
                  className={classNames(
                    item.sepBefore && "mt-8 border-t border-teal-500",
                    item.sepAfter && "mb-8 border-b border-teal-500"
                  )}
                >
                  <Link
                    to={item.href}
                    className={classNames(
                      location.pathname === item.href
                        ? "bg-teal-700 text-white"
                        : "text-teal-200 hover:bg-teal-700 hover:text-white",
                      "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold animate duration-200",
                      item.sepBefore && "mt-4",
                      item.sepAfter && "mb-4"
                    )}
                    title={!expanded ? item.name : undefined}
                    onClick={onSelect}
                    aria-current={
                      location.pathname === item.href ? "page" : undefined
                    }
                    aria-label={item.name}
                    aria-clickable
                    role="link"
                    aria-describedby={`nav-${item.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}-description`}
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
                    <span
                      id={`nav-${item.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}-description`}
                      className={`transition-opacity duration-300 ${
                        expanded
                          ? "opacity-100"
                          : "opacity-0 w-0 overflow-hidden"
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="mb-8">
            <Link
              to="/me/edit"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-teal-200 hover:bg-teal-700 hover:text-white animate duration-200"
              title={!expanded ? "Settings" : undefined}
              onClick={onSelect}
              aria-label="Settings"
              aria-clickable
              role="link"
              aria-describedby="settings-description"
            >
              <Cog6ToothIcon
                aria-hidden="true"
                className="size-6 shrink-0 text-teal-200 group-hover:text-white"
              />
              <span
                id="settings-description"
                className={`transition-opacity duration-300 ${
                  expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                <Trans>Settings</Trans>
              </span>
            </Link>
          </li>
          <li className="text-xs text-teal-200">
            <p>
              &copy; {new Date().getFullYear()} Team Time Table
              <br />v{version}
            </p>
          </li>
        </ul>
      </nav>
      {!alwaysExpanded && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute bottom-4 right-3 bg-teal-700 text-white rounded-full p-1.5 hover:bg-teal-800 transition-colors"
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={expanded}
        >
          <ChevronLeftIcon
            className={`size-4 transition-transform duration-500 ${
              expanded ? "" : "rotate-180"
            }`}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
};

export default SideBar;
