import { gql } from "urql";

export const teamWithMembersQuery = gql`
  query teamWithMembers($teamPk: String!) {
    team(teamPk: $teamPk) {
      pk
      name
      members {
        pk
        name
        email
        emailMd5
        resourcePermission
        resourcePermissionGivenAt
      }
    }
  }
`;
