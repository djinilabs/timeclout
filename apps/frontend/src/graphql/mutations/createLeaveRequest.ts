import { gql } from "urql";

export const createLeaveRequestMutation = gql`
  mutation CreateLeaveRequest($input: CreateLeaveRequestInput!) {
    createLeaveRequest(input: $input) {
      pk
    }
  }
`;
