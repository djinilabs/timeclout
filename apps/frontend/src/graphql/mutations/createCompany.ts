import { gql } from "urql";

export const createCompanyMutation = gql`
  mutation CreateCompany($name: String!) {
    createCompany(name: $name) {
      pk
      name
    }
  }
`;
