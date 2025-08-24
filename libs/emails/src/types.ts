import { LeaveRequest } from "libs/graphql/src/types.generated";

export interface User {
  name?: string;
  email?: string;
}

export interface EmailToManagerToApproveLeaveRequestParameters {
  type: "leaveRequestToManager";
  leaveRequestType: LeaveRequest["type"];
  leaveRequestReason?: string;
  leaveRequestStartDate: string;
  leaveRequestEndDate: string;
  employingEntity: string;
  requester: User;
  manager: User;
  continueUrl: string;
}

export interface EmailToManagerToNotifyAboutRejectedLeaveRequestParameters {
  type: "leaveRequestRejectedToManager";
  leaveRequestType: LeaveRequest["type"];
  leaveRequestReason?: string;
  leaveRequestStartDate: string;
  leaveRequestEndDate: string;
  employingEntity: string;
  requester: User;
  manager: User;
  rejecter: User;
}

export interface EmailToManagerToNotifyAboutApprovedLeaveRequestParameters {
  type: "leaveRequestApprovedToManager";
  leaveRequestType: LeaveRequest["type"];
  leaveRequestReason?: string;
  leaveRequestStartDate: string;
  leaveRequestEndDate: string;
  employingEntity: string;
  requester: User;
  manager: User;
  approver: User;
}

export interface EmailToUserToNotifyAboutRejectedLeaveRequestParameters {
  type: "leaveRequestRejectedToUser";
  leaveRequestType: LeaveRequest["type"];
  leaveRequestReason?: string;
  leaveRequestStartDate: string;
  leaveRequestEndDate: string;
  employingEntity: string;
  requester: User;
  rejecter: User;
}

export type EmailParams =
  | EmailToManagerToApproveLeaveRequestParameters
  | EmailToManagerToNotifyAboutRejectedLeaveRequestParameters
  | EmailToManagerToNotifyAboutApprovedLeaveRequestParameters
  | EmailToUserToNotifyAboutRejectedLeaveRequestParameters;
