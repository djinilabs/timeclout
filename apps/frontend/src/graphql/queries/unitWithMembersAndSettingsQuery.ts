import { gql } from "urql";

export const unitWithMembersAndSettingsQuery = gql`
  query unitWithMembersAndSettingsQuery($unitPk: String!, $name: String!) {
    unit(unitPk: $unitPk) {
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
      members {
        pk
        name
        email
        emailMd5
      }
    }
  }
`;
