import { TrashIcon } from "@heroicons/react/20/solid";
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

import type {
  QueryUnitArgs,
  Unit,
  UnitSettingsArgs,
  User,
} from "../../graphql/graphql";
import { useMutation } from "../../hooks/useMutation";
import { useQuery } from "../../hooks/useQuery";
import { SelectUser } from "../atoms/SelectUser";
import { Avatar } from "../particles/Avatar";
import { Button } from "../particles/Button";

import updateUnitSettingsMutation from "@/graphql-client/mutations/updateUnitSettings.graphql";
import unitWithMembersAndSettingsQuery from "@/graphql-client/queries/unitWithMembersAndSettingsQuery.graphql";
import { managersParser } from "@/settings";
import { getDefined, unique } from "@/utils";


export const UnitManagers = () => {
  const { unit: unitPk } = useParams();
  const [
    unitWithMembersAndSettingsQueryResponse,
    reexecuteUnitWithMembersAndSettingsQuery,
  ] = useQuery<{ unit: Unit }, QueryUnitArgs & UnitSettingsArgs>({
    query: unitWithMembersAndSettingsQuery,
    variables: {
      unitPk: getDefined(unitPk, "No unit provided"),
      name: "managers",
    },
  });
  const unit = unitWithMembersAndSettingsQueryResponse?.data?.unit;
  console.log("unit", unit);
  const managers = (unit?.settings && managersParser.parse(unit.settings))?.map(
    (managerUserKey: string) =>
      unit.members.find((member: User) => member.pk === managerUserKey)
  );

  const [, updateUnitSettings] = useMutation(updateUnitSettingsMutation);

  const addUser = useCallback(
    async (user: User) => {
      await updateUnitSettings({
        unitPk,
        name: "managers",
        settings: unique([...(unit?.settings || []), user.pk]),
      });
      toast.success(i18n.t("User added as manager"));
      reexecuteUnitWithMembersAndSettingsQuery();
    },
    [
      updateUnitSettings,
      unitPk,
      unit?.settings,
      reexecuteUnitWithMembersAndSettingsQuery,
    ]
  );

  const addableUsers = unit?.members?.filter(
    (member: User) => !managers?.includes(member)
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
      toast.success(i18n.t("User removed as manager"));
      reexecuteUnitWithMembersAndSettingsQuery();
    },
    [
      updateUnitSettings,
      unitPk,
      unit?.settings,
      reexecuteUnitWithMembersAndSettingsQuery,
    ]
  );

  return (
    <div
      className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3"
      role="region"
      aria-label={i18n.t("Unit Managers Section")}
    >
      <p className="mt-1 text-sm/6 text-gray-600 py-5">
        <Trans>Assign the managers for the workers in this unit:</Trans>
      </p>
      <div className="py-5">
        {managers?.length > 0 ? (
          <div>
            <ul
              role="list"
              className="divide-y divide-gray-100 max-w-fit shadow-md p-4"
              aria-label={i18n.t("List of unit managers")}
            >
              {managers?.map((manager: User) => (
                <li
                  key={manager.pk}
                  className="flex items-center justify-between gap-x-6 py-2"
                  role="listitem"
                >
                  <Avatar {...manager} size={30} />
                  <p className="text-sm text-gray-900">{manager.name}</p>
                  <Button
                    onClick={() => removeUser(manager)}
                    aria-label={i18n.t("Remove {name} as manager", {
                      name: manager.name,
                    })}
                  >
                    <TrashIcon className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm/6 text-gray-600">
            <Trans>No managers assigned</Trans>
          </p>
        )}
        {addableUsers && addableUsers.length > 0 && (
          <div className="flex flex-col gap-y-4">
            <p className="text-sm/6 text-gray-600">
              <Trans>Add a manager</Trans>
            </p>
            <SelectUser
              users={addableUsers}
              onChange={addUser}
              aria-label={i18n.t("Select a user to add as manager")}
            />
          </div>
        )}
      </div>
    </div>
  );
};
