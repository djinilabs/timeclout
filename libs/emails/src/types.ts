import { LeaveRequest } from "libs/graphql/src/types.generated";

export interface User {
  name?: string;
  email?: string;
}

export interface EmailToManagerToApproveLeaveRequestParams {
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

export interface EmailToManagerToNotifyAboutRejectedLeaveRequestParams {
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

export interface EmailToManagerToNotifyAboutApprovedLeaveRequestParams {
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

export interface EmailToUserToNotifyAboutRejectedLeaveRequestParams {
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
  | EmailToManagerToApproveLeaveRequestParams
  | EmailToManagerToNotifyAboutRejectedLeaveRequestParams
  | EmailToManagerToNotifyAboutApprovedLeaveRequestParams
  | EmailToUserToNotifyAboutRejectedLeaveRequestParams;
