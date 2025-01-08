import { gql } from "urql";

export const updateCompanySettingsMutation = gql`
  mutation updateCompanySettings(
    $companyPk: String!
    $name: String!
    $settings: JSON!
  ) {
    updateCompanySettings(
      companyPk: $companyPk
      name: $name
      settings: $settings
    ) {
      pk
    }
  }
`;
