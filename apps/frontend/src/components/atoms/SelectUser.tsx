import { FC, memo, useCallback, useState } from "react";
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
import { useSession } from "next-auth/react";

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
    const { data: session } = useSession();

    const isMe = useCallback(
      (userId: string) => {
        const simpleUserId = userId.split("/")[1];
        if (simpleUserId) {
          return session?.user?.id === simpleUserId;
        }
      },
      [session?.user?.id]
    );

    const filteredUsers = (
      query === ""
        ? users
        : users.filter((user) => {
            return user.name.toLowerCase().includes(query.toLowerCase());
          })
    ).sort((a, b) => {
      return isMe(a.pk) ? -1 : isMe(b.pk) ? 1 : 0;
    });

    return (
      <Combobox
        as="div"
        autoFocus={autoFocus}
        immediate
        value={user}
        onChange={(user: User) => {
          setQuery("");
          onChange(user);
        }}
        aria-label={i18n.t("Select a user")}
      >
        <div className="flex">
          <ComboboxInput
            className="block rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-teal-600 sm:text-sm/6"
            onChange={(event) => setQuery(event.target.value)}
            onBlur={() => setQuery("")}
            autoFocus={autoFocus}
            displayValue={(user?: User) => user?.name ?? ""}
            aria-label={i18n.t("Assigned user")}
            aria-controls="user-listbox"
          />
          <ComboboxButton
            className="flex items-center rounded-r-md px-2 focus:outline-hidden"
            aria-label={i18n.t("Open user selection")}
            aria-controls="user-listbox"
            aria-clickable
          >
            <ChevronUpDownIcon
              className="size-5 text-gray-400"
              aria-hidden="true"
            />
          </ComboboxButton>

          {filteredUsers.length > 0 && (
            <ComboboxOptions
              portal={false}
              id="user-listbox"
              anchor="bottom start"
              transition
              className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden sm:text-sm transition duration-200 ease-out empty:invisible data-closed:scale-95 data-closed:opacity-0"
              aria-label={i18n.t("Available users")}
            >
              {allowEmpty && (
                <ComboboxOption
                  key="null"
                  value={null}
                  className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-teal-600 data-focus:text-white data-focus:outline-hidden"
                  aria-label={i18n.t("Unassigned")}
                >
                  {i18n.t("Unassigned")}
                </ComboboxOption>
              )}
              {filteredUsers.map((user) => (
                <ComboboxOption
                  key={user.pk}
                  value={user}
                  className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-teal-600 data-focus:text-white data-focus:outline-hidden"
                  aria-label={`${user.name}${isMe(user.pk) ? " (You)" : ""}`}
                >
                  <div className="flex items-center gap-x-2 group-data-selected:font-semibold">
                    <Avatar {...user} size={20} />
                    <span>
                      {user.name} {isMe(user.pk) ? " (You)" : ""}
                    </span>
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
