import { gql } from "urql";

export const invitationsToTeamQuery = gql`
  query InvitationsToTeam($toEntityPk: String!) {
    invitationsTo(toEntityPk: $toEntityPk) {
      pk
      email
      emailMd5
      permissionType
      createdAt
      createdBy {
        pk
        email
        name
      }
      updatedAt
      updatedBy {
        pk
        email
        name
      }
    }
  }
`;
