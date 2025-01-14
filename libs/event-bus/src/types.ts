import { LeaveRequestRecord } from "@/tables";

type EventBusEventBase<TK extends string, TV extends object> = {
  key: TK;
  value: TV;
};

export type EventBusEventCreatedOrUpdatedLeaveRequest = EventBusEventBase<
  "createOrUpdateLeaveRequest",
  {
    leaveRequest: LeaveRequestRecord;
  }
>;

export type EventBusEvent = EventBusEventCreatedOrUpdatedLeaveRequest;
