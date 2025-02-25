import { getDefined } from "@/utils";
import { BookCompanyTimeOff } from "./BookCompanyTimeOff";
import { SelectUser } from "./stateless/SelectUser";
import teamWithMemberAndTheirSettingsQuery from "@/graphql-client/queries/teamWithMembersAndTheirSettings.graphql";
import {
  QueryTeamArgs,
  Team,
  TeamSettingsArgs,
  User,
} from "../graphql/graphql";
import { useParams } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import { useState } from "react";

export const CreateTeamMemberLeaveRequest = () => {
  const { team: teamPk } = useParams();
  const [queryResponse] = useQuery<
    { team: Team },
    QueryTeamArgs & TeamSettingsArgs
  >({
    query: teamWithMemberAndTheirSettingsQuery,
    variables: {
      teamPk: getDefined(teamPk, "No team provided"),
      name: "location",
    },
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Book Company Time Off
      </h3>
      <div className="py-5 grid grid-cols-3">
        <div className="border-b border-gray-900/10 pb-6">
          <legend className="text-sm/6 font-semibold text-gray-900">
            Select User
          </legend>
          <p className="mt-1 text-sm/6 text-gray-600">
            Select the user you want to book time off for.
          </p>
        </div>
        <div className="mt-6 space-y-3 col-span-2">
          <SelectUser
            onChange={setSelectedUser}
            users={queryResponse.data?.team?.members ?? []}
          />
        </div>
      </div>
      {selectedUser?.settings ? (
        <BookCompanyTimeOff
          onSubmit={() => {}}
          onCancel={() => {}}
          location={selectedUser?.settings}
        />
      ) : (
        <p>
          {selectedUser
            ? `No location settings found for ${selectedUser?.name}`
            : "Select a user"}
        </p>
      )}
    </div>
  );
};
