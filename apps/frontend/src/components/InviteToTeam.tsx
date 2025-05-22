import { FC } from "react";
import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { Trans } from "@lingui/react/macro";
import { i18n } from "@lingui/core";
import inviteToTeamMutation from "@/graphql-client/mutations/inviteToTeam.graphql";
import { useMutation } from "../hooks/useMutation";
import { Mutation, MutationCreateInvitationArgs } from "../graphql/graphql";
import { Button } from "./particles/Button";
import { PermissionInput } from "./stateless/PermissionInput";
import { FieldComponent } from "./types";

export interface InviteToTeamProps {
  teamPk: string;
  onDone: () => void;
}

export const InviteToTeam: FC<InviteToTeamProps> = ({ teamPk, onDone }) => {
  const [, inviteToTeam] = useMutation<
    Mutation["createInvitation"],
    MutationCreateInvitationArgs
  >(inviteToTeamMutation);
  const form = useForm({
    defaultValues: {
      email: "",
      permission: "",
    },
    onSubmit: async ({ value }) => {
      const response = await inviteToTeam({
        toEntityPk: teamPk,
        invitedUserEmail: value["email"],
        permissionType: Number(value["permission"]),
      });
      if (!response.error) {
        toast.success(i18n.t("Invitation sent"));
        onDone();
      }
    },
    onSubmitInvalid: () => {
      toast.error(i18n.t("Please fill in all fields"));
    },
  });

  return (
    <div className="bg-white shadow-sm sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold text-gray-900">
          <Trans>Invite to team</Trans>
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            <Trans>Invite a team member to join your team.</Trans>
          </p>
        </div>
        <form
          className="mt-5 sm:flex sm:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div key="email" className="w-full sm:max-w-xs">
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  if (!value) {
                    return i18n.t("Email is required");
                  }
                },
              }}
              children={(field) => {
                return (
                  <div className="grid grid-cols-1">
                    <input
                      id={field.name}
                      name={field.name}
                      type="email"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="name@example.com"
                      aria-label="Email"
                      className={`col-start-1 row-start-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                        field.state.meta.errors.length > 0
                          ? "placeholder:text-red-300 outline-red-300 focus:outline-red-600"
                          : ""
                      }`}
                    />
                    {field.state.meta.errors.length > 0 ? (
                      <ExclamationCircleIcon
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4"
                      />
                    ) : null}
                    {field.state.meta.errors.length > 0 ? (
                      <p className="mt-2 text-sm text-red-600">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    ) : null}
                  </div>
                );
              }}
            />
          </div>
          <div key="permission" className="w-full sm:max-w-xs">
            <PermissionInput Field={form.Field as FieldComponent} />
          </div>
          <button
            type="submit"
            disabled={form.state.isSubmitting}
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 sm:ml-3 sm:mt-0 sm:w-auto"
          >
            <Trans>Invite</Trans>
          </button>
          <Button cancel onClick={onDone}>
            <Trans>Cancel</Trans>
          </Button>
        </form>
      </div>
    </div>
  );
};
