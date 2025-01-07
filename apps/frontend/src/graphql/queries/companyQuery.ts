import { gql } from "urql";

export const companyQuery = gql`
  query company($companyPk: String!) {
    company(companyPk: $companyPk) {
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
      units {
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
