import { gql } from "urql";

export const teamQuery = gql`
  query team($teamPk: String!) {
    team(teamPk: $teamPk) {
      pk
      name
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
