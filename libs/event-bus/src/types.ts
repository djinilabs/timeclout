import { LeaveRequestRecord, EntityRecord } from "@/tables";

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

export type EventBusEventRejectedLeaveRequest = EventBusEventBase<
  "rejectLeaveRequest",
  {
    leaveRequest: LeaveRequestRecord;
    rejecter: EntityRecord;
  }
>;

export type EventBusEvent =
  | EventBusEventCreatedOrUpdatedLeaveRequest
  | EventBusEventRejectedLeaveRequest;
