import { LeaveRequestRecord } from "@/tables";

type EventBusEventBase<TK extends string, TV extends object> = {
  key: TK;
  value: TV;
};

export type EventBusEventCreateLeaveRequest = EventBusEventBase<
  "createLeaveRequest",
  {
    leaveRequest: LeaveRequestRecord;
  }
>;

export type EventBusEvent = EventBusEventCreateLeaveRequest;
