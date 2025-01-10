import { gql } from "urql";

export const updateUnitSettingsMutation = gql`
  mutation updateUnitSettings(
    $unitPk: String!
    $name: String!
    $settings: JSON!
  ) {
    updateUnitSettings(unitPk: $unitPk, name: $name, settings: $settings) {
      pk
    }
  }
`;
