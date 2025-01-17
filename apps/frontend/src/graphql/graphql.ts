// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
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
  K extends keyof T,
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
  DateTime: { input: any; output: any };
  JSON: { input: any; output: any };
};

export type ApproveLeaveRequestInput = {
  pk: Scalars["String"]["input"];
  sk: Scalars["String"]["input"];
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
  settings?: Maybe<Scalars["JSON"]["output"]>;
  units?: Maybe<Array<Unit>>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  updatedBy?: Maybe<User>;
};

export type CompanySettingsArgs = {
  name: Scalars["String"]["input"];
};

export type CreateLeaveRequestInput = {
  companyPk: Scalars["String"]["input"];
  endDate: Scalars["String"]["input"];
  reason: Scalars["String"]["input"];
  startDate: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

export type DeleteLeaveInput = {
  pk: Scalars["String"]["input"];
  sk: Scalars["String"]["input"];
};

export type DeleteLeaveRequestInput = {
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
  createdAt: Scalars["DateTime"]["output"];
  createdBy: User;
  endDate: Scalars["String"]["output"];
  pk: Scalars["String"]["output"];
  reason?: Maybe<Scalars["String"]["output"]>;
  sk: Scalars["String"]["output"];
  startDate: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  acceptInvitation: Invitation;
  approveLeaveRequest: LeaveRequest;
  createCompany: Company;
  createInvitation: Invitation;
  createLeaveRequest: LeaveRequest;
  createTeam: Team;
  createUnit: Unit;
  deleteCompany: Company;
  deleteInvitation: Invitation;
  deleteLeave: Leave;
  deleteLeaveRequest: LeaveRequest;
  deleteTeam: Team;
  deleteUnit: Unit;
  rejectLeaveRequest: LeaveRequest;
  removeUserFromTeam: Team;
  updateCompany: Company;
  updateCompanySettings: Company;
  updateLeaveRequest: LeaveRequest;
  updateTeam: Team;
  updateUnit: Unit;
  updateUnitSettings: Unit;
};

export type MutationAcceptInvitationArgs = {
  secret: Scalars["String"]["input"];
};

export type MutationApproveLeaveRequestArgs = {
  input: ApproveLeaveRequestInput;
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

export type MutationCreateTeamArgs = {
  name: Scalars["String"]["input"];
  unitPk: Scalars["String"]["input"];
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

export type MutationDeleteTeamArgs = {
  pk: Scalars["String"]["input"];
};

export type MutationDeleteUnitArgs = {
  pk: Scalars["String"]["input"];
};

export type MutationRejectLeaveRequestArgs = {
  input: RejectLeaveRequestInput;
};

export type MutationRemoveUserFromTeamArgs = {
  teamPk: Scalars["String"]["input"];
  userPk: Scalars["String"]["input"];
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

export type MutationUpdateTeamArgs = {
  name: Scalars["String"]["input"];
  pk: Scalars["String"]["input"];
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

export type Query = {
  __typename?: "Query";
  companies: Array<Company>;
  company: Company;
  invitation: Invitation;
  invitationsTo: Array<Invitation>;
  leaveRequest: LeaveRequest;
  myInvitations: Array<Invitation>;
  myLeaveCalendar: Calendar;
  myQuotaFulfilment: Array<QuotaFulfilment>;
  team: Team;
  unit: Unit;
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

export type QueryMyLeaveCalendarArgs = {
  companyPk: Scalars["String"]["input"];
  year: Scalars["Int"]["input"];
};

export type QueryMyQuotaFulfilmentArgs = {
  companyPk: Scalars["String"]["input"];
  endDate: Scalars["String"]["input"];
  startDate: Scalars["String"]["input"];
};

export type QueryTeamArgs = {
  teamPk: Scalars["String"]["input"];
};

export type QueryUnitArgs = {
  unitPk: Scalars["String"]["input"];
};

export type QuotaFulfilment = {
  __typename?: "QuotaFulfilment";
  approvedUsed: Scalars["Int"]["output"];
  pendingApprovalUsed: Scalars["Int"]["output"];
  quota: Scalars["Int"]["output"];
  quotaEndDate: Scalars["String"]["output"];
  quotaStartDate: Scalars["String"]["output"];
};

export type RejectLeaveRequestInput = {
  pk: Scalars["String"]["input"];
  sk: Scalars["String"]["input"];
};

export type Team = {
  __typename?: "Team";
  createdAt: Scalars["DateTime"]["output"];
  createdBy: User;
  members: Array<User>;
  name: Scalars["String"]["output"];
  pk: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  updatedBy?: Maybe<User>;
};

export type Unit = {
  __typename?: "Unit";
  createdAt: Scalars["DateTime"]["output"];
  createdBy: User;
  members: Array<User>;
  name: Scalars["String"]["output"];
  pk: Scalars["String"]["output"];
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

export type User = {
  __typename?: "User";
  email: Scalars["String"]["output"];
  emailMd5: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  pk: Scalars["String"]["output"];
  resourcePermission?: Maybe<Scalars["Int"]["output"]>;
  resourcePermissionGivenAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>["__apiType"];

  constructor(
    private value: string,
    public __meta__?: Record<string, any> | undefined
  ) {
    super(value);
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
