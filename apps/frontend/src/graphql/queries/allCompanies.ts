import { gql } from "urql";

export const allCompaniesQuery = gql`
  query AllCompanies {
    companies {
      id
      name
    }
  }
`;
