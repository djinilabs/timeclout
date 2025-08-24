import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";


import {
  LeaveRequest,
  MutationCreateLeaveRequestForUserArgs as MutationCreateLeaveRequestForUserArguments,
  MutationCreateSingleDayLeaveRequestsForUserArgs as MutationCreateSingleDayLeaveRequestsForUserArguments,
  QueryTeamArgs as QueryTeamArguments,
  Team,
  TeamSettingsArgs as TeamSettingsArguments,
  User,
} from "../../graphql/graphql";
import { useMutation } from "../../hooks/useMutation";
import { useQuery } from "../../hooks/useQuery";
import { SelectUser } from "../atoms/SelectUser";
import { BookCompanyTimeOff } from "../company/BookCompanyTimeOff";
import { MemberQuotaFulfilment } from "../company/MemberQuotaFulfilment";

import createLeaveRequestForUserMutation from "@/graphql-client/mutations/createLeaveRequestForUser.graphql";
import createSingleDayLeaveRequestsForUserMutation from "@/graphql-client/mutations/createSingleDayLeaveRequestsForUser.graphql";
import teamWithMemberAndTheirSettingsQuery from "@/graphql-client/queries/teamWithMembersAndTheirSettings.graphql";
import { getDefined } from "@/utils";


export const CreateTeamMemberLeaveRequest = () => {
  const { team: teamPk, company, unit } = useParams();
  const [queryResponse] = useQuery<
    { team: Team },
    QueryTeamArguments & TeamSettingsArguments
  >({
    query: teamWithMemberAndTheirSettingsQuery,
    variables: {
      teamPk: getDefined(teamPk, "No team provided"),
      name: "location",
    },
  });
  const users = useMemo(
    () => queryResponse.data?.team?.members ?? [],
    [queryResponse.data]
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [searchParameters] = useSearchParams();
  const userPk = searchParameters.get("user");

  useEffect(() => {
    if (userPk && users && !selectedUser) {
      setSelectedUser(users.find((u) => u.pk === userPk) ?? null);
    }
  }, [users, userPk, selectedUser]);

  const [, createLeaveRequestForUser] = useMutation<
    { createLeaveRequestForUser: LeaveRequest },
    MutationCreateLeaveRequestForUserArguments
  >(createLeaveRequestForUserMutation);

  const [, createSingleDayLeaveRequestsForUser] = useMutation<
    { createSingleDayLeaveRequestsForUser: LeaveRequest },
    MutationCreateSingleDayLeaveRequestsForUserArguments
  >(createSingleDayLeaveRequestsForUserMutation);

  const navigate = useNavigate();

  return (
    <div
      className="space-y-6"
      role="region"
      aria-label={i18n.t("Book Company Time Off")}
    >
      <h3
        className="text-lg font-medium leading-6 text-gray-900"
        id="time-off-heading"
      >
        <Trans>Book Company Time Off</Trans>
      </h3>
      <div
        className="py-5 grid grid-cols-3"
        role="group"
        aria-labelledby="time-off-heading"
      >
        <div>
          <legend
            className="text-sm/6 font-semibold text-gray-900"
            id="user-selection-label"
          >
            <Trans>Select User</Trans>
          </legend>
          <p
            className="mt-1 text-sm/6 text-gray-600"
            id="user-selection-description"
          >
            <Trans>Select the user you want to request time off for.</Trans>
          </p>
        </div>
        <div className="mt-6 space-y-3 col-span-2">
          <SelectUser
            user={selectedUser}
            onChange={setSelectedUser}
            users={users}
            autoFocus
            aria-labelledby="user-selection-label"
            aria-describedby="user-selection-description"
          />
        </div>
      </div>
      {selectedUser?.settings ? (
        <BookCompanyTimeOff
          onSubmit={async (request) => {
            if (request.dateRange && request.mode === "range") {
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
                toast.success(i18n.t("Leave request created successfully"));
              }
            }

            if (request.mode === "multiple" && request.dates.length > 0) {
              const response = await createSingleDayLeaveRequestsForUser({
                input: {
                  companyPk: getDefined(company, "No company provided"),
                  teamPk: getDefined(teamPk, "No team provided"),
                  beneficiaryPk: selectedUser?.pk,
                  type: request.type,
                  dates: request.dates,
                  reason: request.reason,
                },
              });
              if (!response.error) {
                toast.success(i18n.t("Leave request created successfully"));
              }
            }

            navigate(
              `/companies/${company}/units/${unit}/teams/${teamPk}?tab=leave-schedule`
            );
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
              aria-label={i18n.t("Leave quota fulfillment for {name}", {
                name: selectedUser?.name,
              })}
            />
          )}
        />
      ) : (
        <p role="alert" aria-live="polite">
          {selectedUser ? (
            <Trans>No location settings found for {selectedUser?.name}</Trans>
          ) : (
            <Trans>Select a user</Trans>
          )}
        </p>
      )}
    </div>
  );
};
