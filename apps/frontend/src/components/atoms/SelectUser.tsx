import { FC, memo, useCallback, useEffect, useMemo, useRef } from "react";
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
  ({ onChange, users: _users, user: selectedUser = null, autoFocus }) => {
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

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      setTimeout(() => {
        if (autoFocus) {
          ref.current?.focus();
        }
      }, 100);
    }, [autoFocus]);

    const users = useMemo(() => {
      return _users.sort((a, b) => a.name.localeCompare(b.name));
    }, [_users]);

    const onSelectedValueChange = useCallback(
      (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (value) {
          const user = users.find((user) => user.pk === value);
          if (user) {
            onChange(user);
          }
        } else {
          onChange(null);
        }
      },
      [onChange, users]
    );

    return (
      <div className="flex relative">
        <select
          autoFocus={autoFocus}
          onChange={onSelectedValueChange}
          value={selectedUser?.pk ?? ""}
          className="mt-3 rounded-lg bg-white/5 px-3 py-1.5 text-sm/6 outline-teal-600 outline-1 focus:outline-2 focus:outline-teal-600 *:text-black"
          aria-label={i18n.t("Please select a user")}
        >
          <option
            key="null"
            value=""
            aria-label={i18n.t("Please select a user")}
          >
            {i18n.t("Please select a user")}
          </option>
          {users.map((user) => (
            <option
              key={user.pk}
              value={user.pk}
              aria-label={`${user.name}${isMe(user.pk) ? " (You)" : ""}`}
            >
              {user.name} {isMe(user.pk) ? " (You)" : ""}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
