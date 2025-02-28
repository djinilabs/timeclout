import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FieldComponent, useForm } from "@tanstack/react-form";
import { Trans } from "@lingui/react/macro";
import { getDefined } from "@/utils";
import teamMemberWithSettingsQuery from "@/graphql-client/queries/teamMemberWithSettings.graphql";
import createTeamMemberMutation from "@/graphql-client/mutations/createTeamMember.graphql";
import updateTeamMemberMutation from "@/graphql-client/mutations/updateTeamMember.graphql";
import updateUserSettingsMutation from "@/graphql-client/mutations/updateUserSettings.graphql";
import {
  Mutation,
  MutationCreateTeamMemberArgs,
  MutationUpdateUserSettingsArgs,
  MutationUpdateTeamMemberArgs,
  QueryTeamMemberArgs,
  Query,
  UserSettingsArgs,
} from "../graphql/graphql";
import { useMutation } from "../hooks/useMutation";
import { Button } from "./stateless/Button";
import { EditCountryAndRegion } from "./stateless/EditCountryAndRegion";
import { useQuery } from "../hooks/useQuery";

interface CreateOrEditTeamMemberProps {
  teamPk: string;
  memberPk?: string;
  onDone: () => void;
}

export const CreateOrEditTeamMember: FC<CreateOrEditTeamMemberProps> = ({
  teamPk,
  memberPk,
  onDone,
}) => {
  console.log("memberPk", memberPk);
  const [teamMemberQueryResponse] = useQuery<
    { teamMember: Query["teamMember"] },
    QueryTeamMemberArgs & UserSettingsArgs
  >({
    query: teamMemberWithSettingsQuery,
    variables: { teamPk, memberPk: memberPk ?? "", name: "location" },
    pause: !memberPk,
  });
  const [, createTeamMember] = useMutation<
    { createTeamMember: Mutation["createTeamMember"] },
    MutationCreateTeamMemberArgs
  >(createTeamMemberMutation);

  const [, updateTeamMember] = useMutation<
    { updateTeamMember: Mutation["updateTeamMember"] },
    MutationUpdateTeamMemberArgs
  >(updateTeamMemberMutation);

  const [, updateUserSettings] = useMutation<
    Mutation["updateUserSettings"],
    MutationUpdateUserSettingsArgs
  >(updateUserSettingsMutation);

  const locationSettings = teamMemberQueryResponse.data?.teamMember
    ?.settings ?? {
    country: undefined,
    region: undefined,
  };

  const form = useForm<{
    name: string;
    email: string;
    country: string | undefined;
    region: string | undefined;
  }>({
    defaultValues: {
      name: teamMemberQueryResponse.data?.teamMember?.name ?? "",
      email: teamMemberQueryResponse.data?.teamMember?.email ?? "",
      country: locationSettings.country,
      region: locationSettings.region,
    },
    onSubmit: async ({ value }) => {
      const result = await (memberPk
        ? updateTeamMember({
            input: {
              name: value.name,
              email: value.email,
              teamPk,
              memberPk,
            },
          })
        : createTeamMember({
            input: {
              name: value.name,
              email: value.email,
              teamPk,
            },
          }));

      if (!result.error) {
        const updateSettingsResult = await updateUserSettings({
          userPk: getDefined(
            memberPk ??
              (result as { data?: { createTeamMember?: { pk: string } } })?.data
                ?.createTeamMember?.pk,
            "User PK is required"
          ),
          teamPk,
          name: "location",
          settings: {
            country: value.country,
            region: value.region,
          },
        });
        if (!updateSettingsResult.error) {
          toast.success(`User ${memberPk ? "updated" : "created"}`);
          onDone();
        }
      }
    },
  });

  const [selectedCountryIsoCode, setSelectedCountryIsoCode] = useState<
    string | undefined
  >(undefined);

  useEffect(
    () =>
      form.store.subscribe((state) => {
        setSelectedCountryIsoCode(state.currentVal.values.country);
      }),
    [form]
  );

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">
              <Trans>Create Team Member</Trans>
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              <Trans>Add a new team member to the team.</Trans>
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => {
                  if (!value) {
                    return "Professional name is required";
                  }
                },
              }}
              children={(field) => (
                <div className="sm:col-span-3">
                  <label
                    htmlFor={field.name}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    <Trans>Professional name</Trans>
                  </label>
                  <div className="mt-2">
                    <input
                      autoFocus
                      placeholder="John Doe"
                      value={field.state.value}
                      onChange={(ev) => field.handleChange(ev.target.value)}
                      id={field.name}
                      type="text"
                      required
                      autoComplete="given-name"
                      className={`col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-base outline outline-1 -outline-offset-1 focus:outline focus:outline-2 focus:-outline-offset-2 sm:pr-9 sm:text-sm/6 ${
                        field.state.meta.errors.length > 0
                          ? "placeholder:text-red-300 outline-red-300 focus:outline-red-600"
                          : ""
                      }`}
                    />
                    {field.state.meta.errors.length > 0 ? (
                      <p className="mt-2 text-sm text-red-600">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    ) : null}
                  </div>
                </div>
              )}
            />

            <form.Field
              name="email"
              children={(field) => (
                <div className="sm:col-span-4">
                  <label
                    htmlFor={field.name}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    <Trans>Email address</Trans>
                  </label>
                  <div className="mt-2">
                    <input
                      value={field.state.value}
                      onChange={(ev) => field.handleChange(ev.target.value)}
                      id={field.name}
                      type="email"
                      autoComplete="email"
                      className={`col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-base outline outline-1 -outline-offset-1 focus:outline focus:outline-2 focus:-outline-offset-2 sm:pr-9 sm:text-sm/6 ${
                        field.state.meta.errors.length > 0
                          ? "placeholder:text-red-300 outline-red-300 focus:outline-red-600"
                          : ""
                      }`}
                    />
                    {field.state.meta.errors.length > 0 ? (
                      <p className="mt-2 text-sm text-red-600">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    ) : null}
                  </div>
                </div>
              )}
            />

            <EditCountryAndRegion
              Field={
                form.Field as FieldComponent<{
                  country?: string;
                  region?: string;
                }>
              }
              selectedCountryIsoCode={selectedCountryIsoCode}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button type="button" cancel onClick={onDone}>
          <Trans>Cancel</Trans>
        </Button>
        <Button type="submit">
          <Trans>Save</Trans>
        </Button>
      </div>
    </form>
  );
};
