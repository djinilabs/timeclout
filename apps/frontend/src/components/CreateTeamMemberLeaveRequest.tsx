import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { getDefined } from "@/utils";
import { BookCompanyTimeOff } from "./BookCompanyTimeOff";
import { SelectUser } from "./stateless/SelectUser";
import teamWithMemberAndTheirSettingsQuery from "@/graphql-client/queries/teamWithMembersAndTheirSettings.graphql";
import createLeaveRequestForUserMutation from "@/graphql-client/mutations/createLeaveRequestForUser.graphql";
import {
  LeaveRequest,
  MutationCreateLeaveRequestForUserArgs,
  QueryTeamArgs,
  Team,
  TeamSettingsArgs,
  User,
} from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";
import { MemberQuotaFulfilment } from "./MemberQuotaFulfilment";
import { useMutation } from "../hooks/useMutation";

export const CreateTeamMemberLeaveRequest = () => {
  const { team: teamPk, company, unit } = useParams();
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

  const [, createLeaveRequestForUser] = useMutation<
    { createLeaveRequestForUser: LeaveRequest },
    MutationCreateLeaveRequestForUserArgs
  >(createLeaveRequestForUserMutation);

  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Book Company Time Off
      </h3>
      <div className="py-5 grid grid-cols-3">
        <div>
          <legend className="text-sm/6 font-semibold text-gray-900">
            Select User
          </legend>
          <p className="mt-1 text-sm/6 text-gray-600">
            Select the user you want to request time off for.
          </p>
        </div>
        <div className="mt-6 space-y-3 col-span-2">
          <SelectUser
            onChange={setSelectedUser}
            users={queryResponse.data?.team?.members ?? []}
            autoFocus
          />
        </div>
      </div>
      {selectedUser?.settings ? (
        <BookCompanyTimeOff
          onSubmit={async (request) => {
            const response = await createLeaveRequestForUser({
              input: {
                companyPk: getDefined(company, "No company provided"),
                teamPk: getDefined(teamPk, "No team provided"),
                beneficiaryPk: selectedUser?.pk,
                type: request.type,
                startDate: getDefined(
                  request.dateRange[0],
                  "No start date provided"
                ),
                endDate: getDefined(
                  request.dateRange[1],
                  "No end date provided"
                ),
                reason: request.reason,
              },
            });
            if (!response.error) {
              toast.success("Leave request created successfully");
              navigate(
                `/companies/${company}/units/${unit}/teams/${teamPk}?tab=leave-schedule`
              );
            }
          }}
          onCancel={() =>
            navigate(
              `/companies/${company}/units/${unit}/teams/${teamPk}?tab=leave-schedule`
            )
          }
          location={selectedUser?.settings}
          quotaFulfilment={({
            companyPk,
            startDate,
            endDate,
            simulatesLeave,
            simulatesLeaveType,
          }) => (
            <MemberQuotaFulfilment
              companyPk={companyPk}
              teamPk={getDefined(teamPk, "No team provided")}
              userPk={selectedUser?.pk}
              startDate={startDate}
              endDate={endDate}
              simulatesLeave={simulatesLeave}
              simulatesLeaveType={simulatesLeaveType}
            />
          )}
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
