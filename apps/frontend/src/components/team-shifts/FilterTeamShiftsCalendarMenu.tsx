import { Trans } from "@lingui/react/macro";

import { User } from "../../graphql/graphql";
import { SelectUsers } from "../atoms/SelectUsers";
import { LabeledSwitch } from "../particles/LabeledSwitch";

export interface FilterTeamShiftsCalendarMenuProperties {
  filterUsers: boolean;
  setFilterUsers: (filterUsers: boolean) => void;
  allUsers: User[];
  filteredUsers: User[];
  setFilteredUsers: (users: User[]) => void;
}

export const FilterTeamShiftsCalendarMenu = ({
  filterUsers,
  setFilterUsers,
  allUsers,
  filteredUsers,
  setFilteredUsers,
}: FilterTeamShiftsCalendarMenuProperties) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-row gap-2">
          <LabeledSwitch
            label={<Trans>Filter users</Trans>}
            checked={filterUsers}
            onChange={setFilterUsers}
          />
          {filterUsers && (
            <div className="relative z-500">
              <SelectUsers
                users={allUsers}
                selectedUsers={filteredUsers}
                onChange={setFilteredUsers}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
