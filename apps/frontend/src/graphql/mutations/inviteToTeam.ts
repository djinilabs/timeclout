import { gql } from "urql";

export const inviteToTeamMutation = gql`
  mutation InviteToTeam($teamPk: String!, $email: String!, $permission: Int!) {
    createInvitation(
      toEntityPk: $teamPk
      invitedUserEmail: $email
      permissionType: $permission
    ) {
      pk
    }
  }
`;
