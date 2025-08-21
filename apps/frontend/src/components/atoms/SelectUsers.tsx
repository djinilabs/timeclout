import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { FC, memo, Fragment } from "react";

import { classNames } from "../../utils/classNames";
import { Avatar } from "../particles/Avatar";

/**
 * SelectUsers Component
 *
 * A multi-select dropdown component using Headless UI that allows users to select multiple users.
 * Each user is displayed with their avatar and name.
 *
 * Usage:
 * ```tsx
 * import { useState } from "react";
 * import { SelectUsers, User } from "./SelectUsers";
 *
 * const MyComponent = () => {
 *   const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
 *
 *   const availableUsers: User[] = [
 *     {
 *       pk: "1",
 *       name: "John Doe",
 *       email: "john@example.com",
 *       emailMd5: "abc123"
 *     },
 *     {
 *       pk: "2",
 *       name: "Jane Smith",
 *       email: "jane@example.com",
 *       emailMd5: "def456"
 *     }
 *   ];
 *
 *   return (
 *     <SelectUsers
 *       users={availableUsers}
 *       selectedUsers={selectedUsers}
 *       onChange={setSelectedUsers}
 *       placeholder="Select team members..."
 *       className="w-64"
 *     />
 *   );
 * };
 * ```
 */

export interface User {
  pk: string;
  name: string;
  email: string;
  emailMd5: string;
}

export interface SelectUsersProps {
  onChange: (users: User[]) => void;
  users: User[];
  selectedUsers?: User[];
  placeholder?: string;
  className?: string;
}

export const SelectUsers: FC<SelectUsersProps> = memo(
  ({
    onChange,
    users,
    selectedUsers = [],
    placeholder = "Select users...",
    className = "",
  }) => {
    const toggleUser = (user: User) => {
      const isSelected = selectedUsers.some((u) => u.pk === user.pk);
      let newSelection: User[];

      if (isSelected) {
        newSelection = selectedUsers.filter((u) => u.pk !== user.pk);
      } else {
        newSelection = [...selectedUsers, user];
      }

      onChange(newSelection);
    };

    const getDisplayText = () => {
      if (selectedUsers.length === 0) {
        return placeholder;
      }
      if (selectedUsers.length === 1) {
        return selectedUsers[0].name;
      }
      return `${selectedUsers.length} users selected`;
    };

    return (
      <div className={classNames("relative", className)}>
        <Listbox value={selectedUsers} onChange={onChange} multiple>
          <div className="relative">
            <ListboxButton className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-gray-300">
              <div className="flex items-center gap-2">
                {selectedUsers.length > 0 && (
                  <div className="flex -space-x-2 overflow-hidden">
                    {selectedUsers.slice(0, 3).map((user) => (
                      <Avatar
                        key={user.pk}
                        name={user.name}
                        email={user.email}
                        emailMd5={user.emailMd5}
                        size={24}
                        className="ring-2 ring-white"
                      />
                    ))}
                    {selectedUsers.length > 3 && (
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs font-medium ring-2 ring-white">
                        +{selectedUsers.length - 3}
                      </div>
                    )}
                  </div>
                )}
                <span
                  className={classNames(
                    "block truncate",
                    selectedUsers.length === 0
                      ? "text-gray-500"
                      : "text-gray-900"
                  )}
                >
                  {getDisplayText()}
                </span>
              </div>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions
                anchor="bottom start"
                className="w-auto z-500 rounded-xl border border-white/5 bg-white p-1 [--anchor-gap:--spacing(1)] outline-2 outline-gray-200"
              >
                {users.map((user) => {
                  return (
                    <ListboxOption
                      key={user.pk}
                      className={({ active }) =>
                        classNames(
                          "relative cursor-default select-none py-2 pl-10 pr-4",
                          active
                            ? "bg-amber-100 text-amber-900"
                            : "text-gray-900"
                        )
                      }
                      value={user}
                    >
                      {({ selected: listboxSelected }) => (
                        <div
                          className="flex items-center gap-3"
                          onClick={() => toggleUser(user)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar
                              name={user.name}
                              email={user.email}
                              emailMd5={user.emailMd5}
                              size={32}
                            />
                            <span className={classNames("block truncate")}>
                              {user.name}
                            </span>
                          </div>
                          {listboxSelected ? (
                            <CheckIcon
                              className="h-5 w-5 text-amber-600"
                              aria-hidden="true"
                            />
                          ) : null}
                        </div>
                      )}
                    </ListboxOption>
                  );
                })}
              </ListboxOptions>
            </Transition>
          </div>
        </Listbox>
      </div>
    );
  }
);

SelectUsers.displayName = "SelectUsers";
