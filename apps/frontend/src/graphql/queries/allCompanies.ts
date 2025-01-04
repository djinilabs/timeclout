import { gql } from "urql";

export const allCompaniesQuery = gql`
  query AllCompanies {
    companies {
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
