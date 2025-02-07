import {
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "../utils/classNames";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Team", href: "#", icon: UsersIcon },
  { name: "Projects", href: "#", icon: FolderIcon },
  { name: "Calendar", href: "#", icon: CalendarIcon },
  {
    name: "Leave Requests",
    href: "/leave-requests/pending",
    icon: DocumentDuplicateIcon,
  },
  { name: "Reports", href: "#", icon: ChartPieIcon },
];
const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H" },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T" },
  { id: 3, name: "Workcation", href: "#", initial: "W" },
];

export const SideBar = () => {
  const location = useLocation();
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-teal-600 px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <img
          alt="Team Time Table"
          src="/images/tt3.svg"
          className="h-20 w-auto"
        />
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
                      "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
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
          <li>
            <div className="text-xs/6 font-semibold text-teal-200">
              Your teams
            </div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {teams.map((team) => (
                <li key={team.name}>
                  <a
                    href={team.href}
                    className={classNames(
                      location.pathname === team.href
                        ? "bg-teal-700 text-white"
                        : "text-teal-200 hover:bg-teal-700 hover:text-white",
                      "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                    )}
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-teal-400 bg-teal-500 text-[0.625rem] font-medium text-white">
                      {team.initial}
                    </span>
                    <span className="truncate">{team.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <Link
              to="/me/edit"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-teal-200 hover:bg-teal-700 hover:text-white"
            >
              <Cog6ToothIcon
                aria-hidden="true"
                className="size-6 shrink-0 text-teal-200 group-hover:text-white"
              />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
