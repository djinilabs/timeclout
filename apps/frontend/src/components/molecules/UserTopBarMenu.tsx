import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { useSession, signOut } from "next-auth/react";
import { useMemo } from "react";
import { Link } from "react-router-dom";


import { Query } from "../../graphql/graphql";
import { useQuery } from "../../hooks/useQuery";
import { Suspense } from "../atoms/Suspense";
import { Avatar } from "../particles/Avatar";

import meQuery from "@/graphql-client/queries/me.graphql";

export const LoadingUserTopBarMenu = () => {
  const userNavigation = useMemo(
    () => [
      { href: "/me/edit", name: i18n.t("Profile") },
      { name: i18n.t("Sign out"), onClick: () => signOut() },
    ],
    []
  );
  const [result] = useQuery<{ me: Query["me"] }>({ query: meQuery });
  const me = result?.data?.me;
  const { data: session } = useSession();
  return (
    <Menu as="div" className="relative">
      <MenuButton
        className="flex items-center p-1.5"
        aria-label="Open user menu"
      >
        <span className="sr-only">
          <Trans>Open user menu</Trans>
        </span>
        {me && <Avatar {...me} size={40} />}
        <span className="hidden lg:flex lg:items-center">
          <span
            aria-hidden="true"
            className="ml-4 text-sm/6 font-semibold text-gray-900"
          >
            {session?.user?.name ?? session?.user?.email}
          </span>
          <ChevronDownIcon
            aria-hidden="true"
            className="ml-2 size-5 text-gray-400"
          />
        </span>
      </MenuButton>
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
        aria-label="User menu options"
      >
        {userNavigation.map((item) => (
          <MenuItem key={item.name}>
            {item.href ? (
              <Link
                key={item.name}
                to={item.href}
                className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                aria-label={item.name}
                aria-clickable
                role="link"
              >
                {item.name}
              </Link>
            ) : (
              <a
                key={item.name}
                onClick={item.onClick}
                className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                role="menuitem"
                aria-label={item.name}
              >
                {item.name}
              </a>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
};

export const UserTopBarMenu = () => {
  return (
    <Suspense>
      <LoadingUserTopBarMenu />
    </Suspense>
  );
};
