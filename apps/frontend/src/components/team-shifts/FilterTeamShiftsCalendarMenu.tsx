import { Trans } from "@lingui/react/macro";
import { LabeledSwitch } from "../particles/LabeledSwitch";
import { User } from "../../graphql/graphql";
import { SelectUsers } from "../atoms/SelectUsers";

export interface FilterTeamShiftsCalendarMenuProps {
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
}: FilterTeamShiftsCalendarMenuProps) => {
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
