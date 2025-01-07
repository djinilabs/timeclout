import { gql } from "urql";

export const createTeamMutation = gql`
  mutation CreateTeam($unitPk: String!, $name: String!) {
    createTeam(unitPk: $unitPk, name: $name) {
      pk
      name
    }
  }
`;
