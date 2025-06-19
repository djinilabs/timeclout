import { DocumentTypeDecoration } from "@graphql-typed-document-node/core";

/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: any; output: any };
  DateTime: { input: any; output: any };
  JSON: { input: any; output: any };
};

export type ApproveLeaveRequestInput = {
  pk: Scalars["String"]["input"];
  sk: Scalars["String"]["input"];
};

export type AssignShiftPositionsInput = {
  assignments: Array<ShiftPositionAssignmentInput>;
  team: Scalars["String"]["input"];
};

export type AssignableTeamMembersInput = {
  shiftPositionPk: Scalars["String"]["input"];
  shiftPositionSk: Scalars["String"]["input"];
  teamPk: Scalars["String"]["input"];
};

export type AutoFillParamsInput = {
  endDay: Scalars["String"]["input"];
  startDay: Scalars["String"]["input"];
  team: Scalars["String"]["input"];
};

export type AutoFillSlot = {
  __typename?: "AutoFillSlot";
  assignedWorkerPk?: Maybe<Scalars["ID"]["output"]>;
  id: Scalars["ID"]["output"];
  requiredQualifications: Array<Scalars["String"]["output"]>;
  startsOnDay: Scalars["String"]["output"];
  typeName: Scalars["String"]["output"];
  workHours: Array<AutoFillWorkHour>;
};

export type AutoFillSlotWorker = {
  __typename?: "AutoFillSlotWorker";
  approvedLeaves: Array<AutoFillWorkerLeave>;
  email: Scalars["String"]["output"];
  emailMd5: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  pk: Scalars["ID"]["output"];
  qualifications: Array<Scalars["String"]["output"]>;
};

export type AutoFillWorkHour = {
  __typename?: "AutoFillWorkHour";
  end: Scalars["Int"]["output"];
  inconvenienceMultiplier: Scalars["Float"]["output"];
  start: Scalars["Int"]["output"];
};

export type AutoFillWorkerLeave = {
  __typename?: "AutoFillWorkerLeave";
  end: Scalars["Int"]["output"];
  isPersonal: Scalars["Boolean"]["output"];
  start: Scalars["Int"]["output"];
  type: Scalars["String"]["output"];
};

export type Calendar = {
  __typename?: "Calendar";
  leaveRequests: Array<LeaveRequest>;
  leaves: Array<Leave>;
  year: Scalars["Int"]["output"];
};

export type Company = {
  __typename?: "Company";
  createdAt: Scalars["DateTime"]["output"];
  createdBy: User;
  name: Scalars["String"]["output"];
  pk: Scalars["String"]["output"];
  resourcePermission?: Maybe<Scalars["Int"]["output"]>;
  settings?: Maybe<Scalars["JSON"]["output"]>;
  units?: Maybe<Array<Unit>>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  updatedBy?: Maybe<User>;
};

export type CompanySettingsArgs = {
  name: Scalars["String"]["input"];
};

export type CopyShiftPositionInput = {
  day: Scalars["String"]["input"];
  pk: Scalars["String"]["input"];
  sk: Scalars["String"]["input"];
};

export type CreateLeaveRequestForUserInput = {
  beneficiaryPk: Scalars["String"]["input"];
  companyPk: Scalars["String"]["input"];
  endDate: Scalars["String"]["input"];
  reason: Scalars["String"]["input"];
  startDate: Scalars["String"]["input"];
  teamPk: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

export type CreateLeaveRequestInput = {
  companyPk: Scalars["String"]["input"];
  endDate: Scalars["String"]["input"];
  reason: Scalars["String"]["input"];
  startDate: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

export type CreateShiftPositionInput = {
  assignedTo?: InputMaybe<Scalars["String"]["input"]>;
  color?: InputMaybe<Scalars["String"]["input"]>;
  day: Scalars["String"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  replaces?: InputMaybe<Scalars["String"]["input"]>;
  requiredSkills: Array<Scalars["String"]["input"]>;
  schedules: Array<ShiftPositionScheduleInput>;
  team: Scalars["String"]["input"];
};

export type CreateSingleDayLeaveRequestsForUserInput = {
  beneficiaryPk: Scalars["String"]["input"];
  companyPk: Scalars["String"]["input"];
  dates: Array<Scalars["String"]["input"]>;
  reason: Scalars["String"]["input"];
  teamPk: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

export type CreateSingleDayLeaveRequestsInput = {
  companyPk: Scalars["String"]["input"];
  days: Array<Scalars["String"]["input"]>;
  reason: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

export type CreateTeamMemberInput = {
  email: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  permission: Scalars["Int"]["input"];
  teamPk: Scalars["String"]["input"];
};

export type DeleteLeaveInput = {
  pk: Scalars["String"]["input"];
  sk: Scalars["String"]["input"];
};

export type DeleteLeaveRequestInput = {
  pk: Scalars["String"]["input"];
  sk: Scalars["String"]["input"];
};

export type DeleteShiftPositionInput = {
  pk: Scalars["String"]["input"];
  sk: Scalars["String"]["input"];
};

export type Invitation = {
  __typename?: "Invitation";
  createdAt: Scalars["DateTime"]["output"];
  createdBy: User;
  email: Scalars["String"]["output"];
  emailMd5: Scalars["String"]["output"];
  permissionType: Scalars["Int"]["output"];
  pk: Scalars["String"]["output"];
  sk: Scalars["String"]["output"];
  toEntity: InvitationEntity;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  updatedBy?: Maybe<User>;
};

export type InvitationEntity = Company | Team | Unit;

export type Leave = {
  __typename?: "Leave";
  leaveRequestPk: Scalars["String"]["output"];
  leaveRequestSk: Scalars["String"]["output"];
  pk: Scalars["String"]["output"];
  sk: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type LeaveRequest = {
  __typename?: "LeaveRequest";
  approved?: Maybe<Scalars["Boolean"]["output"]>;
  approvedAt?: Maybe<Array<Scalars["DateTime"]["output"]>>;
  approvedBy?: Maybe<Array<User>>;
  beneficiary: User;
  companyPk: Scalars["String"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  createdBy: User;
  endDate: Scalars["String"]["output"];
  pk: Scalars["String"]["output"];
  reason?: Maybe<Scalars["String"]["output"]>;
  sk: Scalars["String"]["output"];
  startDate: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type MemberQualifications = {
  __typename?: "MemberQualifications";
  qualifications: Array<Scalars["String"]["output"]>;
  userPk: Scalars["String"]["output"];
};

export type MoveShiftPositionInput = {
  day: Scalars["String"]["input"];
  pk: Scalars["String"]["input"];
  sk: Scalars["String"]["input"];
};

export type Mutation = {
  __typename?: "Mutation";
  acceptInvitation: Invitation;
  approveLeaveRequest: LeaveRequest;
  assignShiftPositions: Array<ShiftPosition>;
  copyShiftPosition: ShiftPosition;
  createCompany: Company;
  createInvitation: Invitation;
  createLeaveRequest: LeaveRequest;
  createLeaveRequestForUser: LeaveRequest;
  createShiftPosition: ShiftPosition;
  createSingleDayLeaveRequests: LeaveRequest;
  createSingleDayLeaveRequestsForUser: Array<LeaveRequest>;
  createTeam: Team;
  createTeamMember: User;
  createUnit: Unit;
  deleteCompany: Company;
  deleteInvitation: Invitation;
  deleteLeave: Leave;
  deleteLeaveRequest: LeaveRequest;
  deleteShiftPosition: ShiftPosition;
  deleteTeam: Team;
  deleteUnit: Unit;
  moveShiftPosition: ShiftPosition;
  rejectLeaveRequest: LeaveRequest;
  removeUserFromTeam: Team;
  saveTeamMemberQualifications: Team;
  unassignShiftPosition: ShiftPosition;
  unassignShiftPositions: Array<ShiftPosition>;
  updateCompany: Company;
  updateCompanySettings: Company;
  updateLeaveRequest: LeaveRequest;
  updateMe?: Maybe<User>;
  updateMySettings?: Maybe<User>;
  updateShiftPosition: ShiftPosition;
  updateTeam: Team;
  updateTeamMember: User;
  updateTeamSettings: Team;
  updateUnit: Unit;
  updateUnitSettings: Unit;
  updateUserSettings?: Maybe<User>;
};

export type MutationAcceptInvitationArgs = {
  secret: Scalars["String"]["input"];
};

export type MutationApproveLeaveRequestArgs = {
  input: ApproveLeaveRequestInput;
};

export type MutationAssignShiftPositionsArgs = {
  input: AssignShiftPositionsInput;
};

export type MutationCopyShiftPositionArgs = {
  input: CopyShiftPositionInput;
};

export type MutationCreateCompanyArgs = {
  name: Scalars["String"]["input"];
};

export type MutationCreateInvitationArgs = {
  invitedUserEmail: Scalars["String"]["input"];
  permissionType: Scalars["Int"]["input"];
  toEntityPk: Scalars["String"]["input"];
};

export type MutationCreateLeaveRequestArgs = {
  input: CreateLeaveRequestInput;
};

export type MutationCreateLeaveRequestForUserArgs = {
  input: CreateLeaveRequestForUserInput;
};

export type MutationCreateShiftPositionArgs = {
  input: CreateShiftPositionInput;
};

export type MutationCreateSingleDayLeaveRequestsArgs = {
  input: CreateSingleDayLeaveRequestsInput;
};

export type MutationCreateSingleDayLeaveRequestsForUserArgs = {
  input: CreateSingleDayLeaveRequestsForUserInput;
};

export type MutationCreateTeamArgs = {
  name: Scalars["String"]["input"];
  unitPk: Scalars["String"]["input"];
};

export type MutationCreateTeamMemberArgs = {
  input: CreateTeamMemberInput;
};

export type MutationCreateUnitArgs = {
  companyPk: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
};

export type MutationDeleteCompanyArgs = {
  pk: Scalars["String"]["input"];
};

export type MutationDeleteInvitationArgs = {
  pk: Scalars["String"]["input"];
  sk: Scalars["String"]["input"];
};

export type MutationDeleteLeaveArgs = {
  input: DeleteLeaveInput;
};

export type MutationDeleteLeaveRequestArgs = {
  input: DeleteLeaveRequestInput;
};

export type MutationDeleteShiftPositionArgs = {
  input: DeleteShiftPositionInput;
};

export type MutationDeleteTeamArgs = {
  pk: Scalars["String"]["input"];
};

export type MutationDeleteUnitArgs = {
  pk: Scalars["String"]["input"];
};

export type MutationMoveShiftPositionArgs = {
  input: MoveShiftPositionInput;
};

export type MutationRejectLeaveRequestArgs = {
  input: RejectLeaveRequestInput;
};

export type MutationRemoveUserFromTeamArgs = {
  teamPk: Scalars["String"]["input"];
  userPk: Scalars["String"]["input"];
};

export type MutationSaveTeamMemberQualificationsArgs = {
  qualifications: Array<Scalars["String"]["input"]>;
  teamPk: Scalars["String"]["input"];
  userPk: Scalars["String"]["input"];
};

export type MutationUnassignShiftPositionArgs = {
  input: UnassignShiftPositionInput;
};

export type MutationUnassignShiftPositionsArgs = {
  input: UnassignShiftPositionsInput;
};

export type MutationUpdateCompanyArgs = {
  name: Scalars["String"]["input"];
  pk: Scalars["String"]["input"];
};

export type MutationUpdateCompanySettingsArgs = {
  companyPk: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  settings: Scalars["JSON"]["input"];
};

export type MutationUpdateLeaveRequestArgs = {
  input: UpdateLeaveRequestInput;
};

export type MutationUpdateMeArgs = {
  input: UpdateMeInput;
};

export type MutationUpdateMySettingsArgs = {
  name: Scalars["String"]["input"];
  settings: Scalars["JSON"]["input"];
};

export type MutationUpdateShiftPositionArgs = {
  input: UpdateShiftPositionInput;
};

export type MutationUpdateTeamArgs = {
  name: Scalars["String"]["input"];
  pk: Scalars["String"]["input"];
};

export type MutationUpdateTeamMemberArgs = {
  input: UpdateTeamMemberInput;
};

export type MutationUpdateTeamSettingsArgs = {
  name: Scalars["String"]["input"];
  settings: Scalars["JSON"]["input"];
  teamPk: Scalars["String"]["input"];
};

export type MutationUpdateUnitArgs = {
  name: Scalars["String"]["input"];
  pk: Scalars["String"]["input"];
};

export type MutationUpdateUnitSettingsArgs = {
  name: Scalars["String"]["input"];
  settings: Scalars["JSON"]["input"];
  unitPk: Scalars["String"]["input"];
};

export type MutationUpdateUserSettingsArgs = {
  name: Scalars["String"]["input"];
  settings: Scalars["JSON"]["input"];
  teamPk: Scalars["String"]["input"];
  userPk: Scalars["String"]["input"];
};

export type PublishShiftPositionsInput = {
  endDay: Scalars["String"]["input"];
  startDay: Scalars["String"]["input"];
  team: Scalars["String"]["input"];
};

export type Query = {
  __typename?: "Query";
  allTeams: Array<Team>;
  assignableTeamMembers: Array<User>;
  companies: Array<Company>;
  company: Company;
  invitation: Invitation;
  invitationsTo: Array<Invitation>;
  latestAppVersion: Scalars["String"]["output"];
  leaveRequest: LeaveRequest;
  me?: Maybe<User>;
  memberQuotaFulfilment: Array<QuotaFulfilment>;
  myInvitations: Array<Invitation>;
  myLeaveCalendar: Calendar;
  myLeaveRequests: Array<LeaveRequest>;
  myQuotaFulfilment: Array<QuotaFulfilment>;
  pendingLeaveRequests: Array<LeaveRequest>;
  shiftPositions: Array<ShiftPosition>;
  shiftsAutoFillParams: ShiftsAutoFillParams;
  team: Team;
  teamMember: User;
  unit: Unit;
  units: Array<Unit>;
};

export type QueryAssignableTeamMembersArgs = {
  input: AssignableTeamMembersInput;
};

export type QueryCompanyArgs = {
  companyPk: Scalars["String"]["input"];
};

export type QueryInvitationArgs = {
  secret: Scalars["String"]["input"];
};

export type QueryInvitationsToArgs = {
  toEntityPk: Scalars["String"]["input"];
};

export type QueryLeaveRequestArgs = {
  pk: Scalars["String"]["input"];
  sk: Scalars["String"]["input"];
};

export type QueryMemberQuotaFulfilmentArgs = {
  companyPk: Scalars["String"]["input"];
  endDate: Scalars["String"]["input"];
  simulatesLeave?: InputMaybe<Scalars["Boolean"]["input"]>;
  simulatesLeaveType?: InputMaybe<Scalars["String"]["input"]>;
  startDate: Scalars["String"]["input"];
  teamPk: Scalars["String"]["input"];
  userPk: Scalars["String"]["input"];
};

export type QueryMyLeaveCalendarArgs = {
  companyPk: Scalars["String"]["input"];
  year: Scalars["Int"]["input"];
};

export type QueryMyLeaveRequestsArgs = {
  companyPk: Scalars["String"]["input"];
};

export type QueryMyQuotaFulfilmentArgs = {
  companyPk: Scalars["String"]["input"];
  endDate: Scalars["String"]["input"];
  simulatesLeave?: InputMaybe<Scalars["Boolean"]["input"]>;
  simulatesLeaveType?: InputMaybe<Scalars["String"]["input"]>;
  startDate: Scalars["String"]["input"];
};

export type QueryPendingLeaveRequestsArgs = {
  companyPk?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryShiftPositionsArgs = {
  input: QueryShiftPositionsInput;
};

export type QueryShiftsAutoFillParamsArgs = {
  input: AutoFillParamsInput;
};

export type QueryTeamArgs = {
  teamPk: Scalars["String"]["input"];
};

export type QueryTeamMemberArgs = {
  memberPk: Scalars["String"]["input"];
  teamPk: Scalars["String"]["input"];
};

export type QueryUnitArgs = {
  unitPk: Scalars["String"]["input"];
};

export type QueryShiftPositionsInput = {
  endDay: Scalars["String"]["input"];
  startDay: Scalars["String"]["input"];
  team: Scalars["String"]["input"];
  version?: InputMaybe<Scalars["String"]["input"]>;
};

export type QuotaFulfilment = {
  __typename?: "QuotaFulfilment";
  approvedUsed: Scalars["Int"]["output"];
  pendingApprovalUsed: Scalars["Int"]["output"];
  quota: Scalars["Int"]["output"];
  quotaEndDate: Scalars["String"]["output"];
  quotaStartDate: Scalars["String"]["output"];
  simulatedEndDate?: Maybe<Scalars["String"]["output"]>;
  simulatedStartDate?: Maybe<Scalars["String"]["output"]>;
  simulatedType?: Maybe<Scalars["String"]["output"]>;
  simulatedUsed?: Maybe<Scalars["Int"]["output"]>;
};

export type RejectLeaveRequestInput = {
  pk: Scalars["String"]["input"];
  sk: Scalars["String"]["input"];
};

export type Schedule = {
  __typename?: "Schedule";
  endDate: Scalars["Date"]["output"];
  pk: Scalars["String"]["output"];
  startDate: Scalars["Date"]["output"];
  team: Team;
  userSchedules: Array<UserSchedule>;
};

export type ShiftPosition = {
  __typename?: "ShiftPosition";
  assignedTo?: Maybe<User>;
  color?: Maybe<Scalars["String"]["output"]>;
  day: Scalars["String"]["output"];
  name?: Maybe<Scalars["String"]["output"]>;
  pk: Scalars["String"]["output"];
  requiredSkills: Array<Scalars["String"]["output"]>;
  schedules: Array<ShiftPositionSchedule>;
  sk: Scalars["String"]["output"];
  userVersion: Scalars["String"]["output"];
};

export type ShiftPositionAssignmentInput = {
  shiftPositionId: Scalars["ID"]["input"];
  workerPk: Scalars["ID"]["input"];
};

export type ShiftPositionSchedule = {
  __typename?: "ShiftPositionSchedule";
  endHourMinutes: Array<Scalars["Int"]["output"]>;
  inconveniencePerHour: Scalars["Float"]["output"];
  startHourMinutes: Array<Scalars["Int"]["output"]>;
};

export type ShiftPositionScheduleInput = {
  endHourMinutes: Array<Scalars["Int"]["input"]>;
  inconveniencePerHour: Scalars["Float"]["input"];
  startHourMinutes: Array<Scalars["Int"]["input"]>;
};

export type ShiftsAutoFillParams = {
  __typename?: "ShiftsAutoFillParams";
  slots: Array<AutoFillSlot>;
  workers: Array<AutoFillSlotWorker>;
};

export type Team = {
  __typename?: "Team";
  approvedSchedule: Schedule;
  companyPk: Scalars["String"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  createdBy: User;
  members: Array<User>;
  name: Scalars["String"]["output"];
  pk: Scalars["String"]["output"];
  resourcePermission?: Maybe<Scalars["Int"]["output"]>;
  schedule: Schedule;
  settings?: Maybe<Scalars["JSON"]["output"]>;
  teamMembersQualifications: Array<MemberQualifications>;
  unitPk: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  updatedBy?: Maybe<User>;
};

export type TeamApprovedScheduleArgs = {
  endDate: Scalars["Date"]["input"];
  startDate: Scalars["Date"]["input"];
};

export type TeamMembersArgs = {
  qualifications?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type TeamScheduleArgs = {
  endDate: Scalars["Date"]["input"];
  startDate: Scalars["Date"]["input"];
};

export type TeamSettingsArgs = {
  name: Scalars["String"]["input"];
};

export type UnassignShiftPositionInput = {
  shiftPositionSk: Scalars["String"]["input"];
  team: Scalars["String"]["input"];
};

export type UnassignShiftPositionsInput = {
  endDay: Scalars["String"]["input"];
  startDay: Scalars["String"]["input"];
  team: Scalars["String"]["input"];
};

export type Unit = {
  __typename?: "Unit";
  companyPk: Scalars["String"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  createdBy: User;
  members: Array<User>;
  name: Scalars["String"]["output"];
  pk: Scalars["String"]["output"];
  resourcePermission?: Maybe<Scalars["Int"]["output"]>;
  settings?: Maybe<Scalars["JSON"]["output"]>;
  teams: Array<Team>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  updatedBy?: Maybe<User>;
};

export type UnitSettingsArgs = {
  name: Scalars["String"]["input"];
};

export type UpdateLeaveRequestInput = {
  endDate: Scalars["String"]["input"];
  pk: Scalars["String"]["input"];
  reason: Scalars["String"]["input"];
  sk: Scalars["String"]["input"];
  startDate: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

export type UpdateMeInput = {
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateShiftPositionInput = {
  assignedTo?: InputMaybe<Scalars["String"]["input"]>;
  color?: InputMaybe<Scalars["String"]["input"]>;
  day: Scalars["String"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  pk: Scalars["String"]["input"];
  replaces?: InputMaybe<Scalars["String"]["input"]>;
  requiredSkills: Array<Scalars["String"]["input"]>;
  schedules: Array<ShiftPositionScheduleInput>;
  sk: Scalars["String"]["input"];
};

export type UpdateTeamMemberInput = {
  email: Scalars["String"]["input"];
  memberPk: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  permission: Scalars["Int"]["input"];
  teamPk: Scalars["String"]["input"];
};

export type User = {
  __typename?: "User";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdBy?: Maybe<User>;
  email: Scalars["String"]["output"];
  emailMd5: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  pk: Scalars["String"]["output"];
  resourcePermission?: Maybe<Scalars["Int"]["output"]>;
  resourcePermissionGivenAt?: Maybe<Scalars["DateTime"]["output"]>;
  settings?: Maybe<Scalars["JSON"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  updatedBy?: Maybe<User>;
};

export type UserSettingsArgs = {
  name: Scalars["String"]["input"];
};

export type UserSchedule = {
  __typename?: "UserSchedule";
  endDate: Scalars["Date"]["output"];
  leaveRequests: Array<LeaveRequest>;
  leaves: Array<Leave>;
  pk: Scalars["String"]["output"];
  startDate: Scalars["Date"]["output"];
  user: User;
};

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>["__apiType"];
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
