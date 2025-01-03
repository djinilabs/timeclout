import { gql } from "urql";

export const allCompaniesQuery = gql`
  query AllCompanies {
    companies {
      pk
      name
    }
  }
`;
