import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/20/solid";
import { useQuery } from "../hooks/useQuery";
import { managersSchema } from "../settings/managers";
import { Avatar } from "./Avatar";
import { unitWithMembersAndSettingsQuery } from "../graphql/queries/unitWithMembersAndSettingsQuery";
import { SelectUser } from "./SelectUser";
import { updateUnitSettingsMutation } from "../graphql/mutations/updateUnitSettings";
import { useMutation } from "../hooks/useMutation";
import { Button } from "./Button";
import { User } from "../graphql/graphql";
import { unique } from "../../../../libs/utils/src";

export const UnitManagers = () => {
  const { unit: unitPk } = useParams();
  const [
    unitWithMembersAndSettingsQueryResponse,
    reexecuteUnitWithMembersAndSettingsQuery,
  ] = useQuery({
    query: unitWithMembersAndSettingsQuery,
    variables: {
      unitPk,
      name: "managers",
    },
  });
  const unit = unitWithMembersAndSettingsQueryResponse?.data?.unit;
  console.log("unit", unit);
  const managers = (unit?.settings && managersSchema.parse(unit.settings))?.map(
    (managerUserKey: string) =>
      unit.members.find((member) => member.pk === managerUserKey)
  );

  const [, updateUnitSettings] = useMutation(updateUnitSettingsMutation);

  const addUser = useCallback(
    async (user: User) => {
      console.log("adding user", user);
      await updateUnitSettings({
        unitPk,
        name: "managers",
        settings: unique([...(unit?.settings || []), user.pk]),
      });
      reexecuteUnitWithMembersAndSettingsQuery();
    },
    [unitPk, updateUnitSettings, reexecuteUnitWithMembersAndSettingsQuery]
  );

  const addableUsers = unit?.members?.filter(
    (member) => !managers?.includes(member)
  );

  const removeUser = useCallback(
    async (user: User) => {
      console.log("removing user", user);
      await updateUnitSettings({
        unitPk,
        name: "managers",
        settings: unique(
          (unit?.settings || []).filter(
            (managerUserKey: string) => managerUserKey !== user.pk
          )
        ),
      });
      reexecuteUnitWithMembersAndSettingsQuery();
    },
    [unitPk, updateUnitSettings, reexecuteUnitWithMembersAndSettingsQuery]
  );

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
      <p className="mt-1 text-sm/6 text-gray-600 py-5">
        Assign the managers for the workers in this unit:
      </p>
      <div className="py-5">
        {managers?.length > 0 ? (
          <div>
            <ul
              role="list"
              className="divide-y divide-gray-100 max-w-fit shadow-md p-4"
            >
              {managers?.map((manager) => (
                <li
                  key={manager}
                  className="flex items-center justify-between gap-x-6 py-2"
                >
                  <Avatar {...manager} size={30} />
                  <p>{manager.name}</p>
                  <Button onClick={() => removeUser(manager)}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm/6 text-gray-600">No managers assigned</p>
        )}
        {addableUsers && addableUsers.length > 0 && (
          <div className="flex flex-col gap-y-4">
            <p className="text-sm/6 text-gray-600">Add a manager</p>
            <SelectUser users={addableUsers} onChange={addUser} />
          </div>
        )}
      </div>
    </div>
  );
};
