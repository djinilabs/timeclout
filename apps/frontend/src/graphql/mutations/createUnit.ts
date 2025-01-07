import { gql } from "urql";

export const createUnitMutation = gql`
  mutation CreateUnit($companyPk: String!, $name: String!) {
    createUnit(companyPk: $companyPk, name: $name) {
      pk
      name
    }
  }
`;
