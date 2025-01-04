import { gql } from "urql";

export const unitQuery = gql`
  query unit($unitPk: ID!) {
    unit(unitPk: $unitPk) {
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
      teams {
        pk
        name
        createdAt
        createdBy {
          pk
          email
          name
        }
      }
    }
  }
`;
