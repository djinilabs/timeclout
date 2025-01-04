import { gql } from "urql";

export const createUnitMutation = gql`
  mutation CreateUnit($companyPk: ID!, $name: String!) {
    createUnit(companyPk: $companyPk, name: $name) {
      pk
      name
    }
  }
`;
