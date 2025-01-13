import { LeaveRequest } from "libs/graphql/src/types.generated";

export interface User {
  name?: string;
  email?: string;
}

export interface EmailToManagerToApproveLeaveRequestParams {
  type: "leaveRequestToManager";
  leaveRequestType: LeaveRequest["type"];
  leaveRequestReason: string;
  leaveRequestStartDate: string;
  leaveRequestEndDate: string;
  employingEntity: string;
  requester: User;
  manager: User;
  continueUrl: string;
}

export type EmailParams = EmailToManagerToApproveLeaveRequestParams;
