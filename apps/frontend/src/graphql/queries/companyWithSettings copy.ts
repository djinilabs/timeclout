import { gql } from "urql";

export const companyWithSettingsQuery = gql`
  query companyWithSettings($companyPk: String!, $name: String!) {
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
      settings(name: $name)
    }
  }
`;
