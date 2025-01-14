import { FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getDefined } from "@/utils";
import invitationBySecretQuery from "@/graphql-client/queries/invitationBySecret.graphql";
import acceptInvitationMutation from "@/graphql-client/mutations/acceptInvitation.graphql";
import { useQuery } from "../hooks/useQuery";
import { permissionTypeToString } from "../utils/permissionTypeToString";
import { Button } from "./Button";
import { useMutation } from "../hooks/useMutation";
import toast from "react-hot-toast";
import {
  Mutation,
  MutationAcceptInvitationArgs,
  Query,
  QueryInvitationArgs,
} from "../graphql/graphql";

export const AcceptInvite: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [invitationQueryResponse] = useQuery<
    { invitation: Query["invitation"] },
    QueryInvitationArgs
  >({
    query: invitationBySecretQuery,
    variables: {
      secret: getDefined(searchParams.get("secret"), "No secret provided"),
    },
  });
  const invitation = invitationQueryResponse?.data?.invitation;

  const [{ fetching }, acceptInvitation] = useMutation<
    Mutation["acceptInvitation"],
    MutationAcceptInvitationArgs
  >(acceptInvitationMutation);
  const handleAcceptInvitation = async () => {
    const result = await acceptInvitation({
      secret: getDefined(searchParams.get("secret"), "No secret provided"),
    });
    if (!result.error) {
      toast.success("Invitation accepted");
      navigate("/");
    }
  };

  if (!invitation) {
    return <div>Invitation not found</div>;
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold text-gray-900">
          You have been invited
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            You have been invited to join &quot;
            <em>{invitation.toEntity.name}</em>&quot; with permission level{" "}
            &quot;{permissionTypeToString(invitation.permissionType)}&quot;.
          </p>
          <p>Click the button below to accept the invitation.</p>
        </div>
        <div className="mt-5">
          <Button disabled={fetching} onClick={handleAcceptInvitation}>
            Accept Invitation
          </Button>
        </div>
      </div>
    </div>
  );
};
