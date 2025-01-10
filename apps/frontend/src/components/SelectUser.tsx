"use client";

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { FC, useState } from "react";
import { Avatar } from "./Avatar";

export interface User {
  pk: string;
  name: string;
  email: string;
  emailMd5: string;
}

export interface SelectUserProps {
  onChange: (user: User) => void;
  users: User[];
}

export const SelectUser: FC<SelectUserProps> = ({ onChange, users }) => {
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<User | undefined>();

  const filteredUsers =
    query === ""
      ? users
      : users.filter((user) => {
          return user.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      value={selectedPerson}
      onChange={(user: User) => {
        setQuery("");
        setSelectedPerson(user);
        onChange(user);
      }}
    >
      <div className="relative mt-2">
        <ComboboxInput
          className="block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => setQuery("")}
          displayValue={(user: User) => user?.name}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
          <ChevronUpDownIcon
            className="size-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxButton>

        {filteredUsers.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden sm:text-sm">
            {filteredUsers.map((user) => (
              <ComboboxOption
                key={user.pk}
                value={user}
                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
              >
                <p className="flex items-center gap-x-2 group-data-selected:font-semibold">
                  <Avatar {...user} size={20} />
                  {user.name}
                </p>

                <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-focus:text-white group-data-selected:flex">
                  <CheckIcon className="size-5" aria-hidden="true" />
                </span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
};
