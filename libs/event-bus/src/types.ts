import { LeaveRequest } from "libs/graphql/src/types.generated";

type EventBusEventBase<TK extends string, TV extends object> = {
  key: TK;
  value: TV;
};

export type EventBusEventCreateLeaveRequest = EventBusEventBase<
  "createLeaveRequest",
  {
    leaveRequest: LeaveRequest;
  }
>;

export type EventBusEvent = EventBusEventCreateLeaveRequest;
