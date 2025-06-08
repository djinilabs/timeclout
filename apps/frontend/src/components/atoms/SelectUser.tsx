import { FC, memo, useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Avatar } from "../particles/Avatar";
import { i18n } from "@lingui/core";

export interface User {
  pk: string;
  name: string;
  email: string;
  emailMd5: string;
}

export interface SelectUserProps {
  onChange: (user: User | null) => void;
  users: User[];
  user?: User | null;
  allowEmpty?: boolean;
  autoFocus?: boolean;
}

export const SelectUser: FC<SelectUserProps> = memo(
  ({ onChange, users, user = null, autoFocus, allowEmpty }) => {
    const [query, setQuery] = useState("");

    const filteredUsers =
      query === ""
        ? users
        : users.filter((user) => {
            return user.name.toLowerCase().includes(query.toLowerCase());
          });

    return (
      <Combobox
        as="div"
        value={user}
        onChange={(user: User) => {
          setQuery("");
          onChange(user);
        }}
        autoFocus={autoFocus}
        aria-label={i18n.t("Select a user")}
      >
        <div className="relative mt-2">
          <ComboboxInput
            className="block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-teal-600 sm:text-sm/6"
            onChange={(event) => setQuery(event.target.value)}
            onBlur={() => setQuery("")}
            displayValue={(user: User) => user?.name ?? "-"}
            aria-label={i18n.t("Search users")}
            aria-expanded={filteredUsers.length > 0}
            aria-controls="user-listbox"
          />
          <ComboboxButton
            className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden"
            aria-label={i18n.t("Open user selection")}
          >
            <ChevronUpDownIcon
              className="size-5 text-gray-400"
              aria-hidden="true"
            />
          </ComboboxButton>

          {filteredUsers.length > 0 && (
            <ComboboxOptions
              id="user-listbox"
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden sm:text-sm"
              aria-label={i18n.t("Available users")}
            >
              {allowEmpty && (
                <ComboboxOption
                  key="null"
                  value={null}
                  className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-teal-600 data-focus:text-white data-focus:outline-hidden"
                >
                  {i18n.t("Unassigned")}
                </ComboboxOption>
              )}
              {filteredUsers.map((user) => (
                <ComboboxOption
                  key={user.pk}
                  value={user}
                  className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-teal-600 data-focus:text-white data-focus:outline-hidden"
                >
                  <div className="flex items-center gap-x-2 group-data-selected:font-semibold">
                    <Avatar {...user} size={20} />
                    <span>{user.name}</span>
                  </div>

                  <span
                    className="absolute inset-y-0 right-0 hidden items-center pr-4 text-teal-600 group-data-focus:text-white group-data-selected:flex"
                    aria-hidden="true"
                  >
                    <CheckIcon className="size-5" aria-hidden="true" />
                  </span>
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          )}
        </div>
      </Combobox>
    );
  }
);
