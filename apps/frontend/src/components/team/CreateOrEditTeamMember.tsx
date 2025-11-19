/* eslint-disable react/no-children-prop */
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { useForm } from "@tanstack/react-form";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Mutation,
  MutationCreateTeamMemberArgs,
  MutationUpdateUserSettingsArgs,
  MutationUpdateTeamMemberArgs,
  QueryTeamMemberArgs,
  Query,
  UserSettingsArgs,
} from "../../graphql/graphql";
import { useMutation } from "../../hooks/useMutation";
import { useQuery } from "../../hooks/useQuery";
import { PermissionInput } from "../atoms/PermissionInput";
import { Button } from "../particles/Button";
import { EditCountryAndRegion } from "../particles/EditCountryAndRegion";
import { FieldComponent } from "../types";

import createTeamMemberMutation from "@/graphql-client/mutations/createTeamMember.graphql";
import updateTeamMemberMutation from "@/graphql-client/mutations/updateTeamMember.graphql";
import updateUserSettingsMutation from "@/graphql-client/mutations/updateUserSettings.graphql";
import teamMemberWithSettingsQuery from "@/graphql-client/queries/teamMemberWithSettings.graphql";
import { getDefined } from "@/utils";

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

  const form = useForm({
    defaultValues: {
      name: teamMemberQueryResponse.data?.teamMember?.name ?? "",
      email: teamMemberQueryResponse.data?.teamMember?.email ?? "",
      country: locationSettings.country,
      region: locationSettings.region,
      permission: (
        teamMemberQueryResponse.data?.teamMember?.resourcePermission ?? 1
      ).toString(),
    },
    onSubmit: async ({ value }) => {
      const result = await (memberPk
        ? updateTeamMember({
            input: {
              name: value.name,
              email: value.email,
              teamPk,
              memberPk,
              permission: Number(value.permission),
            },
          })
        : createTeamMember({
            input: {
              name: value.name,
              email: value.email,
              teamPk,
              permission: Number(value.permission),
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
            ...(value.region ? { region: value.region } : {}),
          },
        });
        if (!updateSettingsResult.error) {
          toast.success(`User ${memberPk ? "updated" : "created"}`);
          onDone();
        }
      }
    },
    onSubmitInvalid: () => {
      toast.error(i18n.t("Please fill in all fields correctly"));
    },
  });

  const [selectedCountryIsoCode, setSelectedCountryIsoCode] = useState<
    string | undefined
  >(form.store.state.values.country);

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
      role="form"
      aria-label={
        memberPk ? "Edit Team Member Form" : "Create Team Member Form"
      }
    >
      <div className="member-form space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">
              {memberPk ? (
                <Trans>Edit Team Member</Trans>
              ) : (
                <Trans>Create Team Member</Trans>
              )}
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              {memberPk ? (
                <Trans>Edit a team member to the team.</Trans>
              ) : (
                <Trans>Add a new team member to the team.</Trans>
              )}
            </p>
          </div>

          <div
            className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2"
            role="group"
            aria-labelledby="member-details"
          >
            <div id="member-details" className="sr-only">
              Member Details
            </div>
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
                      role="textbox"
                      aria-label={i18n.t("Professional name")}
                      aria-required="true"
                      aria-invalid={field.state.meta.errors.length > 0}
                      aria-describedby={
                        field.state.meta.errors.length > 0
                          ? `${field.name}-error`
                          : undefined
                      }
                      className={`col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 sm:pr-9 sm:text-sm/6 ${
                        field.state.meta.errors.length > 0
                          ? "placeholder:text-red-300 outline-red-300 focus:outline-red-600"
                          : ""
                      }`}
                    />
                    {field.state.meta.errors.length > 0 ? (
                      <p
                        id={`${field.name}-error`}
                        className="mt-2 text-sm text-red-600"
                        role="alert"
                      >
                        {field.state.meta.errors.join(", ")}
                      </p>
                    ) : null}
                  </div>
                </div>
              )}
            />

            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  if (!value) {
                    return i18n.t("Email is required");
                  }
                  // Basic email validation regex
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(value)) {
                    return i18n.t("Please enter a valid email address");
                  }
                },
              }}
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
                      aria-invalid={field.state.meta.errors.length > 0}
                      aria-describedby={
                        field.state.meta.errors.length > 0
                          ? `${field.name}-error`
                          : undefined
                      }
                      role="textbox"
                      aria-label={i18n.t("Email address")}
                      aria-required="true"
                      className={`member-email-input col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-base outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 sm:pr-9 sm:text-sm/6 ${
                        field.state.meta.errors.length > 0
                          ? "placeholder:text-red-300 outline-red-300 focus:outline-red-600"
                          : ""
                      }`}
                    />
                    {field.state.meta.errors.length > 0 ? (
                      <p
                        id={`${field.name}-error`}
                        className="mt-2 text-sm text-red-600"
                        role="alert"
                      >
                        {field.state.meta.errors.join(", ")}
                      </p>
                    ) : null}
                  </div>
                </div>
              )}
            />

            <EditCountryAndRegion
              Field={form.Field as FieldComponent}
              selectedCountryIsoCode={selectedCountryIsoCode}
            />

            <div className="sm:col-span-4">
              <label
                htmlFor="permission"
                className="block text-sm/6 font-medium text-gray-900"
              >
                <Trans>Permission</Trans>
              </label>
              <div
                key="permission"
                className="member-role-select w-full sm:max-w-xs"
                role="group"
                aria-labelledby="permission-label"
              >
                <div id="permission-label" className="sr-only">
                  Select permission level
                </div>
                <PermissionInput Field={form.Field as FieldComponent} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button
          type="button"
          cancel
          onClick={onDone}
          aria-label={i18n.t("Cancel team member changes")}
        >
          <Trans>Cancel</Trans>
        </Button>
        <Button
          type="submit"
          aria-label={
            memberPk
              ? i18n.t("Save team member changes")
              : i18n.t("Create new team member")
          }
        >
          <Trans>Save</Trans>
        </Button>
      </div>
    </form>
  );
};
