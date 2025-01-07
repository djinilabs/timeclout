import { gql } from "urql";

export const acceptInvitationMutation = gql`
  mutation acceptInvitation($secret: String!) {
    acceptInvitation(secret: $secret) {
      pk
    }
  }
`;
