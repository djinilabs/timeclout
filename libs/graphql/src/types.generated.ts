import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string | number; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: Date | string; output: Date | string; }
  DateTime: { input: Date | string; output: Date | string; }
  JSON: { input: any; output: any; }
};

export type ApproveLeaveRequestInput = {
  pk: Scalars['String']['input'];
  sk: Scalars['String']['input'];
};

export type AssignShiftPositionsInput = {
  assignments: Array<ShiftPositionAssignmentInput>;
  team: Scalars['String']['input'];
};

export type AutoFillParamsInput = {
  endDay: Scalars['String']['input'];
  startDay: Scalars['String']['input'];
  team: Scalars['String']['input'];
};

export type AutoFillSlot = {
  __typename?: 'AutoFillSlot';
  assignedWorkerPk?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  requiredQualifications: Array<Scalars['String']['output']>;
  startsOnDay: Scalars['String']['output'];
  typeName: Scalars['String']['output'];
  workHours: Array<AutoFillWorkHour>;
};

export type AutoFillSlotWorker = {
  __typename?: 'AutoFillSlotWorker';
  approvedLeaves: Array<AutoFillWorkerLeave>;
  email: Scalars['String']['output'];
  emailMd5: Scalars['String']['output'];
  name: Scalars['String']['output'];
  pk: Scalars['ID']['output'];
  qualifications: Array<Scalars['String']['output']>;
};

export type AutoFillWorkHour = {
  __typename?: 'AutoFillWorkHour';
  end: Scalars['Int']['output'];
  inconvenienceMultiplier: Scalars['Float']['output'];
  start: Scalars['Int']['output'];
};

export type AutoFillWorkerLeave = {
  __typename?: 'AutoFillWorkerLeave';
  end: Scalars['Int']['output'];
  isPersonal: Scalars['Boolean']['output'];
  start: Scalars['Int']['output'];
  type: Scalars['String']['output'];
};

export type Calendar = {
  __typename?: 'Calendar';
  leaveRequests: Array<LeaveRequest>;
  leaves: Array<Leave>;
  year: Scalars['Int']['output'];
};

export type Company = {
  __typename?: 'Company';
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  name: Scalars['String']['output'];
  pk: Scalars['String']['output'];
  resourcePermission?: Maybe<Scalars['Int']['output']>;
  settings?: Maybe<Scalars['JSON']['output']>;
  units?: Maybe<Array<Unit>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<User>;
};


export type CompanysettingsArgs = {
  name: Scalars['String']['input'];
};

export type CopyShiftPositionInput = {
  day: Scalars['String']['input'];
  pk: Scalars['String']['input'];
  sk: Scalars['String']['input'];
};

export type CreateLeaveRequestForUserInput = {
  beneficiaryPk: Scalars['String']['input'];
  companyPk: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  reason: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
  teamPk: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type CreateLeaveRequestInput = {
  companyPk: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  reason: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type CreateShiftPositionInput = {
  assignedTo?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  day: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  replaces?: InputMaybe<Scalars['String']['input']>;
  requiredSkills: Array<Scalars['String']['input']>;
  schedules: Array<ShiftPositionScheduleInput>;
  team: Scalars['String']['input'];
};

export type CreateTeamMemberInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  teamPk: Scalars['String']['input'];
};

export type DeleteLeaveInput = {
  pk: Scalars['String']['input'];
  sk: Scalars['String']['input'];
};

export type DeleteLeaveRequestInput = {
  pk: Scalars['String']['input'];
  sk: Scalars['String']['input'];
};

export type DeleteShiftPositionInput = {
  pk: Scalars['String']['input'];
  sk: Scalars['String']['input'];
};

export type Invitation = {
  __typename?: 'Invitation';
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  email: Scalars['String']['output'];
  emailMd5: Scalars['String']['output'];
  permissionType: Scalars['Int']['output'];
  pk: Scalars['String']['output'];
  sk: Scalars['String']['output'];
  toEntity: InvitationEntity;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<User>;
};

export type InvitationEntity = Company | Team | Unit;

export type Leave = {
  __typename?: 'Leave';
  leaveRequestPk: Scalars['String']['output'];
  leaveRequestSk: Scalars['String']['output'];
  pk: Scalars['String']['output'];
  sk: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type LeaveRequest = {
  __typename?: 'LeaveRequest';
  approved?: Maybe<Scalars['Boolean']['output']>;
  approvedAt?: Maybe<Array<Scalars['DateTime']['output']>>;
  approvedBy?: Maybe<Array<User>>;
  beneficiary: User;
  companyPk: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  endDate: Scalars['String']['output'];
  pk: Scalars['String']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  sk: Scalars['String']['output'];
  startDate: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type MemberQualifications = {
  __typename?: 'MemberQualifications';
  qualifications: Array<Scalars['String']['output']>;
  userPk: Scalars['String']['output'];
};

export type MoveShiftPositionInput = {
  day: Scalars['String']['input'];
  pk: Scalars['String']['input'];
  sk: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvitation: Invitation;
  approveLeaveRequest: LeaveRequest;
  assignShiftPositions: Array<ShiftPosition>;
  copyShiftPosition: ShiftPosition;
  createCompany: Company;
  createInvitation: Invitation;
  createLeaveRequest: LeaveRequest;
  createLeaveRequestForUser: LeaveRequest;
  createShiftPosition: ShiftPosition;
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


export type MutationacceptInvitationArgs = {
  secret: Scalars['String']['input'];
};


export type MutationapproveLeaveRequestArgs = {
  input: ApproveLeaveRequestInput;
};


export type MutationassignShiftPositionsArgs = {
  input: AssignShiftPositionsInput;
};


export type MutationcopyShiftPositionArgs = {
  input: CopyShiftPositionInput;
};


export type MutationcreateCompanyArgs = {
  name: Scalars['String']['input'];
};


export type MutationcreateInvitationArgs = {
  invitedUserEmail: Scalars['String']['input'];
  permissionType: Scalars['Int']['input'];
  toEntityPk: Scalars['String']['input'];
};


export type MutationcreateLeaveRequestArgs = {
  input: CreateLeaveRequestInput;
};


export type MutationcreateLeaveRequestForUserArgs = {
  input: CreateLeaveRequestForUserInput;
};


export type MutationcreateShiftPositionArgs = {
  input: CreateShiftPositionInput;
};


export type MutationcreateTeamArgs = {
  name: Scalars['String']['input'];
  unitPk: Scalars['String']['input'];
};


export type MutationcreateTeamMemberArgs = {
  input: CreateTeamMemberInput;
};


export type MutationcreateUnitArgs = {
  companyPk: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationdeleteCompanyArgs = {
  pk: Scalars['String']['input'];
};


export type MutationdeleteInvitationArgs = {
  pk: Scalars['String']['input'];
  sk: Scalars['String']['input'];
};


export type MutationdeleteLeaveArgs = {
  input: DeleteLeaveInput;
};


export type MutationdeleteLeaveRequestArgs = {
  input: DeleteLeaveRequestInput;
};


export type MutationdeleteShiftPositionArgs = {
  input: DeleteShiftPositionInput;
};


export type MutationdeleteTeamArgs = {
  pk: Scalars['String']['input'];
};


export type MutationdeleteUnitArgs = {
  pk: Scalars['String']['input'];
};


export type MutationmoveShiftPositionArgs = {
  input: MoveShiftPositionInput;
};


export type MutationrejectLeaveRequestArgs = {
  input: RejectLeaveRequestInput;
};


export type MutationremoveUserFromTeamArgs = {
  teamPk: Scalars['String']['input'];
  userPk: Scalars['String']['input'];
};


export type MutationsaveTeamMemberQualificationsArgs = {
  qualifications: Array<Scalars['String']['input']>;
  teamPk: Scalars['String']['input'];
  userPk: Scalars['String']['input'];
};


export type MutationupdateCompanyArgs = {
  name: Scalars['String']['input'];
  pk: Scalars['String']['input'];
};


export type MutationupdateCompanySettingsArgs = {
  companyPk: Scalars['String']['input'];
  name: Scalars['String']['input'];
  settings: Scalars['JSON']['input'];
};


export type MutationupdateLeaveRequestArgs = {
  input: UpdateLeaveRequestInput;
};


export type MutationupdateMeArgs = {
  input: UpdateMeInput;
};


export type MutationupdateMySettingsArgs = {
  name: Scalars['String']['input'];
  settings: Scalars['JSON']['input'];
};


export type MutationupdateShiftPositionArgs = {
  input: UpdateShiftPositionInput;
};


export type MutationupdateTeamArgs = {
  name: Scalars['String']['input'];
  pk: Scalars['String']['input'];
};


export type MutationupdateTeamMemberArgs = {
  input: UpdateTeamMemberInput;
};


export type MutationupdateTeamSettingsArgs = {
  name: Scalars['String']['input'];
  settings: Scalars['JSON']['input'];
  teamPk: Scalars['String']['input'];
};


export type MutationupdateUnitArgs = {
  name: Scalars['String']['input'];
  pk: Scalars['String']['input'];
};


export type MutationupdateUnitSettingsArgs = {
  name: Scalars['String']['input'];
  settings: Scalars['JSON']['input'];
  unitPk: Scalars['String']['input'];
};


export type MutationupdateUserSettingsArgs = {
  name: Scalars['String']['input'];
  settings: Scalars['JSON']['input'];
  teamPk: Scalars['String']['input'];
  userPk: Scalars['String']['input'];
};

export type PublishShiftPositionsInput = {
  endDay: Scalars['String']['input'];
  startDay: Scalars['String']['input'];
  team: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  allTeams: Array<Team>;
  companies: Array<Company>;
  company: Company;
  invitation: Invitation;
  invitationsTo: Array<Invitation>;
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


export type QuerycompanyArgs = {
  companyPk: Scalars['String']['input'];
};


export type QueryinvitationArgs = {
  secret: Scalars['String']['input'];
};


export type QueryinvitationsToArgs = {
  toEntityPk: Scalars['String']['input'];
};


export type QueryleaveRequestArgs = {
  pk: Scalars['String']['input'];
  sk: Scalars['String']['input'];
};


export type QuerymemberQuotaFulfilmentArgs = {
  companyPk: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  simulatesLeave?: InputMaybe<Scalars['Boolean']['input']>;
  simulatesLeaveType?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['String']['input'];
  teamPk: Scalars['String']['input'];
  userPk: Scalars['String']['input'];
};


export type QuerymyLeaveCalendarArgs = {
  companyPk: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};


export type QuerymyLeaveRequestsArgs = {
  companyPk: Scalars['String']['input'];
};


export type QuerymyQuotaFulfilmentArgs = {
  companyPk: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  simulatesLeave?: InputMaybe<Scalars['Boolean']['input']>;
  simulatesLeaveType?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['String']['input'];
};


export type QuerypendingLeaveRequestsArgs = {
  companyPk?: InputMaybe<Scalars['String']['input']>;
};


export type QueryshiftPositionsArgs = {
  input: QueryShiftPositionsInput;
};


export type QueryshiftsAutoFillParamsArgs = {
  input: AutoFillParamsInput;
};


export type QueryteamArgs = {
  teamPk: Scalars['String']['input'];
};


export type QueryteamMemberArgs = {
  memberPk: Scalars['String']['input'];
  teamPk: Scalars['String']['input'];
};


export type QueryunitArgs = {
  unitPk: Scalars['String']['input'];
};

export type QueryShiftPositionsInput = {
  endDay: Scalars['String']['input'];
  startDay: Scalars['String']['input'];
  team: Scalars['String']['input'];
};

export type QuotaFulfilment = {
  __typename?: 'QuotaFulfilment';
  approvedUsed: Scalars['Int']['output'];
  pendingApprovalUsed: Scalars['Int']['output'];
  quota: Scalars['Int']['output'];
  quotaEndDate: Scalars['String']['output'];
  quotaStartDate: Scalars['String']['output'];
  simulatedEndDate?: Maybe<Scalars['String']['output']>;
  simulatedStartDate?: Maybe<Scalars['String']['output']>;
  simulatedType?: Maybe<Scalars['String']['output']>;
  simulatedUsed?: Maybe<Scalars['Int']['output']>;
};

export type RejectLeaveRequestInput = {
  pk: Scalars['String']['input'];
  sk: Scalars['String']['input'];
};

export type Schedule = {
  __typename?: 'Schedule';
  endDate: Scalars['Date']['output'];
  pk: Scalars['String']['output'];
  startDate: Scalars['Date']['output'];
  team: Team;
  userSchedules: Array<UserSchedule>;
};

export type ShiftPosition = {
  __typename?: 'ShiftPosition';
  assignedTo?: Maybe<User>;
  color?: Maybe<Scalars['String']['output']>;
  day: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  pk: Scalars['String']['output'];
  published: Scalars['Boolean']['output'];
  replaces?: Maybe<Scalars['String']['output']>;
  requiredSkills: Array<Scalars['String']['output']>;
  schedules: Array<ShiftPositionSchedule>;
  sk: Scalars['String']['output'];
};

export type ShiftPositionAssignmentInput = {
  shiftPositionId: Scalars['ID']['input'];
  workerPk: Scalars['ID']['input'];
};

export type ShiftPositionSchedule = {
  __typename?: 'ShiftPositionSchedule';
  endHourMinutes: Array<Scalars['Int']['output']>;
  inconveniencePerHour: Scalars['Float']['output'];
  startHourMinutes: Array<Scalars['Int']['output']>;
};

export type ShiftPositionScheduleInput = {
  endHourMinutes: Array<Scalars['Int']['input']>;
  inconveniencePerHour: Scalars['Float']['input'];
  startHourMinutes: Array<Scalars['Int']['input']>;
};

export type ShiftsAutoFillParams = {
  __typename?: 'ShiftsAutoFillParams';
  slots: Array<AutoFillSlot>;
  workers: Array<AutoFillSlotWorker>;
};

export type Team = {
  __typename?: 'Team';
  approvedSchedule: Schedule;
  companyPk: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  members: Array<User>;
  name: Scalars['String']['output'];
  pk: Scalars['String']['output'];
  resourcePermission?: Maybe<Scalars['Int']['output']>;
  schedule: Schedule;
  settings?: Maybe<Scalars['JSON']['output']>;
  teamMembersQualifications: Array<MemberQualifications>;
  unitPk: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<User>;
};


export type TeamapprovedScheduleArgs = {
  endDate: Scalars['Date']['input'];
  startDate: Scalars['Date']['input'];
};


export type TeammembersArgs = {
  qualifications?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type TeamscheduleArgs = {
  endDate: Scalars['Date']['input'];
  startDate: Scalars['Date']['input'];
};


export type TeamsettingsArgs = {
  name: Scalars['String']['input'];
};

export type Unit = {
  __typename?: 'Unit';
  companyPk: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  members: Array<User>;
  name: Scalars['String']['output'];
  pk: Scalars['String']['output'];
  resourcePermission?: Maybe<Scalars['Int']['output']>;
  settings?: Maybe<Scalars['JSON']['output']>;
  teams: Array<Team>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<User>;
};


export type UnitsettingsArgs = {
  name: Scalars['String']['input'];
};

export type UpdateLeaveRequestInput = {
  endDate: Scalars['String']['input'];
  pk: Scalars['String']['input'];
  reason: Scalars['String']['input'];
  sk: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type UpdateMeInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateShiftPositionInput = {
  assignedTo?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  day: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  pk: Scalars['String']['input'];
  replaces?: InputMaybe<Scalars['String']['input']>;
  requiredSkills: Array<Scalars['String']['input']>;
  schedules: Array<ShiftPositionScheduleInput>;
  sk: Scalars['String']['input'];
};

export type UpdateTeamMemberInput = {
  email: Scalars['String']['input'];
  memberPk: Scalars['String']['input'];
  name: Scalars['String']['input'];
  teamPk: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<User>;
  email: Scalars['String']['output'];
  emailMd5: Scalars['String']['output'];
  name: Scalars['String']['output'];
  pk: Scalars['String']['output'];
  resourcePermission?: Maybe<Scalars['Int']['output']>;
  resourcePermissionGivenAt?: Maybe<Scalars['DateTime']['output']>;
  settings?: Maybe<Scalars['JSON']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<User>;
};


export type UsersettingsArgs = {
  name: Scalars['String']['input'];
};

export type UserSchedule = {
  __typename?: 'UserSchedule';
  endDate: Scalars['Date']['output'];
  leaveRequests: Array<LeaveRequest>;
  leaves: Array<Leave>;
  pk: Scalars['String']['output'];
  startDate: Scalars['Date']['output'];
  user: User;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = {
  InvitationEntity: ( Company & { __typename: 'Company' } ) | ( Team & { __typename: 'Team' } ) | ( Unit & { __typename: 'Unit' } );
};


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  ApproveLeaveRequestInput: ApproveLeaveRequestInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  AssignShiftPositionsInput: AssignShiftPositionsInput;
  AutoFillParamsInput: AutoFillParamsInput;
  AutoFillSlot: ResolverTypeWrapper<AutoFillSlot>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  AutoFillSlotWorker: ResolverTypeWrapper<AutoFillSlotWorker>;
  AutoFillWorkHour: ResolverTypeWrapper<AutoFillWorkHour>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  AutoFillWorkerLeave: ResolverTypeWrapper<AutoFillWorkerLeave>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Calendar: ResolverTypeWrapper<Calendar>;
  Company: ResolverTypeWrapper<Company>;
  CopyShiftPositionInput: CopyShiftPositionInput;
  CreateLeaveRequestForUserInput: CreateLeaveRequestForUserInput;
  CreateLeaveRequestInput: CreateLeaveRequestInput;
  CreateShiftPositionInput: CreateShiftPositionInput;
  CreateTeamMemberInput: CreateTeamMemberInput;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DeleteLeaveInput: DeleteLeaveInput;
  DeleteLeaveRequestInput: DeleteLeaveRequestInput;
  DeleteShiftPositionInput: DeleteShiftPositionInput;
  Invitation: ResolverTypeWrapper<Omit<Invitation, 'toEntity'> & { toEntity: ResolversTypes['InvitationEntity'] }>;
  InvitationEntity: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['InvitationEntity']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Leave: ResolverTypeWrapper<Leave>;
  LeaveRequest: ResolverTypeWrapper<LeaveRequest>;
  MemberQualifications: ResolverTypeWrapper<MemberQualifications>;
  MoveShiftPositionInput: MoveShiftPositionInput;
  Mutation: ResolverTypeWrapper<{}>;
  PublishShiftPositionsInput: PublishShiftPositionsInput;
  Query: ResolverTypeWrapper<{}>;
  QueryShiftPositionsInput: QueryShiftPositionsInput;
  QuotaFulfilment: ResolverTypeWrapper<QuotaFulfilment>;
  RejectLeaveRequestInput: RejectLeaveRequestInput;
  Schedule: ResolverTypeWrapper<Schedule>;
  ShiftPosition: ResolverTypeWrapper<ShiftPosition>;
  ShiftPositionAssignmentInput: ShiftPositionAssignmentInput;
  ShiftPositionSchedule: ResolverTypeWrapper<ShiftPositionSchedule>;
  ShiftPositionScheduleInput: ShiftPositionScheduleInput;
  ShiftsAutoFillParams: ResolverTypeWrapper<ShiftsAutoFillParams>;
  Team: ResolverTypeWrapper<Team>;
  Unit: ResolverTypeWrapper<Unit>;
  UpdateLeaveRequestInput: UpdateLeaveRequestInput;
  UpdateMeInput: UpdateMeInput;
  UpdateShiftPositionInput: UpdateShiftPositionInput;
  UpdateTeamMemberInput: UpdateTeamMemberInput;
  User: ResolverTypeWrapper<User>;
  UserSchedule: ResolverTypeWrapper<UserSchedule>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  ApproveLeaveRequestInput: ApproveLeaveRequestInput;
  String: Scalars['String']['output'];
  AssignShiftPositionsInput: AssignShiftPositionsInput;
  AutoFillParamsInput: AutoFillParamsInput;
  AutoFillSlot: AutoFillSlot;
  ID: Scalars['ID']['output'];
  AutoFillSlotWorker: AutoFillSlotWorker;
  AutoFillWorkHour: AutoFillWorkHour;
  Int: Scalars['Int']['output'];
  Float: Scalars['Float']['output'];
  AutoFillWorkerLeave: AutoFillWorkerLeave;
  Boolean: Scalars['Boolean']['output'];
  Calendar: Calendar;
  Company: Company;
  CopyShiftPositionInput: CopyShiftPositionInput;
  CreateLeaveRequestForUserInput: CreateLeaveRequestForUserInput;
  CreateLeaveRequestInput: CreateLeaveRequestInput;
  CreateShiftPositionInput: CreateShiftPositionInput;
  CreateTeamMemberInput: CreateTeamMemberInput;
  Date: Scalars['Date']['output'];
  DateTime: Scalars['DateTime']['output'];
  DeleteLeaveInput: DeleteLeaveInput;
  DeleteLeaveRequestInput: DeleteLeaveRequestInput;
  DeleteShiftPositionInput: DeleteShiftPositionInput;
  Invitation: Omit<Invitation, 'toEntity'> & { toEntity: ResolversParentTypes['InvitationEntity'] };
  InvitationEntity: ResolversUnionTypes<ResolversParentTypes>['InvitationEntity'];
  JSON: Scalars['JSON']['output'];
  Leave: Leave;
  LeaveRequest: LeaveRequest;
  MemberQualifications: MemberQualifications;
  MoveShiftPositionInput: MoveShiftPositionInput;
  Mutation: {};
  PublishShiftPositionsInput: PublishShiftPositionsInput;
  Query: {};
  QueryShiftPositionsInput: QueryShiftPositionsInput;
  QuotaFulfilment: QuotaFulfilment;
  RejectLeaveRequestInput: RejectLeaveRequestInput;
  Schedule: Schedule;
  ShiftPosition: ShiftPosition;
  ShiftPositionAssignmentInput: ShiftPositionAssignmentInput;
  ShiftPositionSchedule: ShiftPositionSchedule;
  ShiftPositionScheduleInput: ShiftPositionScheduleInput;
  ShiftsAutoFillParams: ShiftsAutoFillParams;
  Team: Team;
  Unit: Unit;
  UpdateLeaveRequestInput: UpdateLeaveRequestInput;
  UpdateMeInput: UpdateMeInput;
  UpdateShiftPositionInput: UpdateShiftPositionInput;
  UpdateTeamMemberInput: UpdateTeamMemberInput;
  User: User;
  UserSchedule: UserSchedule;
};

export type AutoFillSlotResolvers<ContextType = any, ParentType extends ResolversParentTypes['AutoFillSlot'] = ResolversParentTypes['AutoFillSlot']> = {
  assignedWorkerPk?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  requiredQualifications?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  startsOnDay?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  typeName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  workHours?: Resolver<Array<ResolversTypes['AutoFillWorkHour']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AutoFillSlotWorkerResolvers<ContextType = any, ParentType extends ResolversParentTypes['AutoFillSlotWorker'] = ResolversParentTypes['AutoFillSlotWorker']> = {
  approvedLeaves?: Resolver<Array<ResolversTypes['AutoFillWorkerLeave']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  emailMd5?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pk?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  qualifications?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AutoFillWorkHourResolvers<ContextType = any, ParentType extends ResolversParentTypes['AutoFillWorkHour'] = ResolversParentTypes['AutoFillWorkHour']> = {
  end?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  inconvenienceMultiplier?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  start?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AutoFillWorkerLeaveResolvers<ContextType = any, ParentType extends ResolversParentTypes['AutoFillWorkerLeave'] = ResolversParentTypes['AutoFillWorkerLeave']> = {
  end?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isPersonal?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  start?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CalendarResolvers<ContextType = any, ParentType extends ResolversParentTypes['Calendar'] = ResolversParentTypes['Calendar']> = {
  leaveRequests?: Resolver<Array<ResolversTypes['LeaveRequest']>, ParentType, ContextType>;
  leaves?: Resolver<Array<ResolversTypes['Leave']>, ParentType, ContextType>;
  year?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resourcePermission?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  settings?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<CompanysettingsArgs, 'name'>>;
  units?: Resolver<Maybe<Array<ResolversTypes['Unit']>>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type InvitationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Invitation'] = ResolversParentTypes['Invitation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  emailMd5?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  permissionType?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  toEntity?: Resolver<ResolversTypes['InvitationEntity'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InvitationEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['InvitationEntity'] = ResolversParentTypes['InvitationEntity']> = {
  __resolveType?: TypeResolveFn<'Company' | 'Team' | 'Unit', ParentType, ContextType>;
};

export interface JSONScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type LeaveResolvers<ContextType = any, ParentType extends ResolversParentTypes['Leave'] = ResolversParentTypes['Leave']> = {
  leaveRequestPk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  leaveRequestSk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeaveRequestResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeaveRequest'] = ResolversParentTypes['LeaveRequest']> = {
  approved?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  approvedAt?: Resolver<Maybe<Array<ResolversTypes['DateTime']>>, ParentType, ContextType>;
  approvedBy?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
  beneficiary?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  companyPk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberQualificationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberQualifications'] = ResolversParentTypes['MemberQualifications']> = {
  qualifications?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  userPk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  acceptInvitation?: Resolver<ResolversTypes['Invitation'], ParentType, ContextType, RequireFields<MutationacceptInvitationArgs, 'secret'>>;
  approveLeaveRequest?: Resolver<ResolversTypes['LeaveRequest'], ParentType, ContextType, RequireFields<MutationapproveLeaveRequestArgs, 'input'>>;
  assignShiftPositions?: Resolver<Array<ResolversTypes['ShiftPosition']>, ParentType, ContextType, RequireFields<MutationassignShiftPositionsArgs, 'input'>>;
  copyShiftPosition?: Resolver<ResolversTypes['ShiftPosition'], ParentType, ContextType, RequireFields<MutationcopyShiftPositionArgs, 'input'>>;
  createCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationcreateCompanyArgs, 'name'>>;
  createInvitation?: Resolver<ResolversTypes['Invitation'], ParentType, ContextType, RequireFields<MutationcreateInvitationArgs, 'invitedUserEmail' | 'permissionType' | 'toEntityPk'>>;
  createLeaveRequest?: Resolver<ResolversTypes['LeaveRequest'], ParentType, ContextType, RequireFields<MutationcreateLeaveRequestArgs, 'input'>>;
  createLeaveRequestForUser?: Resolver<ResolversTypes['LeaveRequest'], ParentType, ContextType, RequireFields<MutationcreateLeaveRequestForUserArgs, 'input'>>;
  createShiftPosition?: Resolver<ResolversTypes['ShiftPosition'], ParentType, ContextType, RequireFields<MutationcreateShiftPositionArgs, 'input'>>;
  createTeam?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationcreateTeamArgs, 'name' | 'unitPk'>>;
  createTeamMember?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationcreateTeamMemberArgs, 'input'>>;
  createUnit?: Resolver<ResolversTypes['Unit'], ParentType, ContextType, RequireFields<MutationcreateUnitArgs, 'companyPk' | 'name'>>;
  deleteCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationdeleteCompanyArgs, 'pk'>>;
  deleteInvitation?: Resolver<ResolversTypes['Invitation'], ParentType, ContextType, RequireFields<MutationdeleteInvitationArgs, 'pk' | 'sk'>>;
  deleteLeave?: Resolver<ResolversTypes['Leave'], ParentType, ContextType, RequireFields<MutationdeleteLeaveArgs, 'input'>>;
  deleteLeaveRequest?: Resolver<ResolversTypes['LeaveRequest'], ParentType, ContextType, RequireFields<MutationdeleteLeaveRequestArgs, 'input'>>;
  deleteShiftPosition?: Resolver<ResolversTypes['ShiftPosition'], ParentType, ContextType, RequireFields<MutationdeleteShiftPositionArgs, 'input'>>;
  deleteTeam?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationdeleteTeamArgs, 'pk'>>;
  deleteUnit?: Resolver<ResolversTypes['Unit'], ParentType, ContextType, RequireFields<MutationdeleteUnitArgs, 'pk'>>;
  moveShiftPosition?: Resolver<ResolversTypes['ShiftPosition'], ParentType, ContextType, RequireFields<MutationmoveShiftPositionArgs, 'input'>>;
  rejectLeaveRequest?: Resolver<ResolversTypes['LeaveRequest'], ParentType, ContextType, RequireFields<MutationrejectLeaveRequestArgs, 'input'>>;
  removeUserFromTeam?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationremoveUserFromTeamArgs, 'teamPk' | 'userPk'>>;
  saveTeamMemberQualifications?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationsaveTeamMemberQualificationsArgs, 'qualifications' | 'teamPk' | 'userPk'>>;
  updateCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationupdateCompanyArgs, 'name' | 'pk'>>;
  updateCompanySettings?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationupdateCompanySettingsArgs, 'companyPk' | 'name' | 'settings'>>;
  updateLeaveRequest?: Resolver<ResolversTypes['LeaveRequest'], ParentType, ContextType, RequireFields<MutationupdateLeaveRequestArgs, 'input'>>;
  updateMe?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationupdateMeArgs, 'input'>>;
  updateMySettings?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationupdateMySettingsArgs, 'name' | 'settings'>>;
  updateShiftPosition?: Resolver<ResolversTypes['ShiftPosition'], ParentType, ContextType, RequireFields<MutationupdateShiftPositionArgs, 'input'>>;
  updateTeam?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationupdateTeamArgs, 'name' | 'pk'>>;
  updateTeamMember?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationupdateTeamMemberArgs, 'input'>>;
  updateTeamSettings?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationupdateTeamSettingsArgs, 'name' | 'settings' | 'teamPk'>>;
  updateUnit?: Resolver<ResolversTypes['Unit'], ParentType, ContextType, RequireFields<MutationupdateUnitArgs, 'name' | 'pk'>>;
  updateUnitSettings?: Resolver<ResolversTypes['Unit'], ParentType, ContextType, RequireFields<MutationupdateUnitSettingsArgs, 'name' | 'settings' | 'unitPk'>>;
  updateUserSettings?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationupdateUserSettingsArgs, 'name' | 'settings' | 'teamPk' | 'userPk'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  allTeams?: Resolver<Array<ResolversTypes['Team']>, ParentType, ContextType>;
  companies?: Resolver<Array<ResolversTypes['Company']>, ParentType, ContextType>;
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<QuerycompanyArgs, 'companyPk'>>;
  invitation?: Resolver<ResolversTypes['Invitation'], ParentType, ContextType, RequireFields<QueryinvitationArgs, 'secret'>>;
  invitationsTo?: Resolver<Array<ResolversTypes['Invitation']>, ParentType, ContextType, RequireFields<QueryinvitationsToArgs, 'toEntityPk'>>;
  leaveRequest?: Resolver<ResolversTypes['LeaveRequest'], ParentType, ContextType, RequireFields<QueryleaveRequestArgs, 'pk' | 'sk'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  memberQuotaFulfilment?: Resolver<Array<ResolversTypes['QuotaFulfilment']>, ParentType, ContextType, RequireFields<QuerymemberQuotaFulfilmentArgs, 'companyPk' | 'endDate' | 'startDate' | 'teamPk' | 'userPk'>>;
  myInvitations?: Resolver<Array<ResolversTypes['Invitation']>, ParentType, ContextType>;
  myLeaveCalendar?: Resolver<ResolversTypes['Calendar'], ParentType, ContextType, RequireFields<QuerymyLeaveCalendarArgs, 'companyPk' | 'year'>>;
  myLeaveRequests?: Resolver<Array<ResolversTypes['LeaveRequest']>, ParentType, ContextType, RequireFields<QuerymyLeaveRequestsArgs, 'companyPk'>>;
  myQuotaFulfilment?: Resolver<Array<ResolversTypes['QuotaFulfilment']>, ParentType, ContextType, RequireFields<QuerymyQuotaFulfilmentArgs, 'companyPk' | 'endDate' | 'startDate'>>;
  pendingLeaveRequests?: Resolver<Array<ResolversTypes['LeaveRequest']>, ParentType, ContextType, Partial<QuerypendingLeaveRequestsArgs>>;
  shiftPositions?: Resolver<Array<ResolversTypes['ShiftPosition']>, ParentType, ContextType, RequireFields<QueryshiftPositionsArgs, 'input'>>;
  shiftsAutoFillParams?: Resolver<ResolversTypes['ShiftsAutoFillParams'], ParentType, ContextType, RequireFields<QueryshiftsAutoFillParamsArgs, 'input'>>;
  team?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<QueryteamArgs, 'teamPk'>>;
  teamMember?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryteamMemberArgs, 'memberPk' | 'teamPk'>>;
  unit?: Resolver<ResolversTypes['Unit'], ParentType, ContextType, RequireFields<QueryunitArgs, 'unitPk'>>;
  units?: Resolver<Array<ResolversTypes['Unit']>, ParentType, ContextType>;
};

export type QuotaFulfilmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuotaFulfilment'] = ResolversParentTypes['QuotaFulfilment']> = {
  approvedUsed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pendingApprovalUsed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  quota?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  quotaEndDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quotaStartDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  simulatedEndDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  simulatedStartDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  simulatedType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  simulatedUsed?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScheduleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Schedule'] = ResolversParentTypes['Schedule']> = {
  endDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  pk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  team?: Resolver<ResolversTypes['Team'], ParentType, ContextType>;
  userSchedules?: Resolver<Array<ResolversTypes['UserSchedule']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShiftPositionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShiftPosition'] = ResolversParentTypes['ShiftPosition']> = {
  assignedTo?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  day?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  published?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  replaces?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requiredSkills?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  schedules?: Resolver<Array<ResolversTypes['ShiftPositionSchedule']>, ParentType, ContextType>;
  sk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShiftPositionScheduleResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShiftPositionSchedule'] = ResolversParentTypes['ShiftPositionSchedule']> = {
  endHourMinutes?: Resolver<Array<ResolversTypes['Int']>, ParentType, ContextType>;
  inconveniencePerHour?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  startHourMinutes?: Resolver<Array<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShiftsAutoFillParamsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShiftsAutoFillParams'] = ResolversParentTypes['ShiftsAutoFillParams']> = {
  slots?: Resolver<Array<ResolversTypes['AutoFillSlot']>, ParentType, ContextType>;
  workers?: Resolver<Array<ResolversTypes['AutoFillSlotWorker']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']> = {
  approvedSchedule?: Resolver<ResolversTypes['Schedule'], ParentType, ContextType, RequireFields<TeamapprovedScheduleArgs, 'endDate' | 'startDate'>>;
  companyPk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<TeammembersArgs>>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resourcePermission?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  schedule?: Resolver<ResolversTypes['Schedule'], ParentType, ContextType, RequireFields<TeamscheduleArgs, 'endDate' | 'startDate'>>;
  settings?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<TeamsettingsArgs, 'name'>>;
  teamMembersQualifications?: Resolver<Array<ResolversTypes['MemberQualifications']>, ParentType, ContextType>;
  unitPk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UnitResolvers<ContextType = any, ParentType extends ResolversParentTypes['Unit'] = ResolversParentTypes['Unit']> = {
  companyPk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resourcePermission?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  settings?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<UnitsettingsArgs, 'name'>>;
  teams?: Resolver<Array<ResolversTypes['Team']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  emailMd5?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resourcePermission?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  resourcePermissionGivenAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  settings?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<UsersettingsArgs, 'name'>>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserScheduleResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSchedule'] = ResolversParentTypes['UserSchedule']> = {
  endDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  leaveRequests?: Resolver<Array<ResolversTypes['LeaveRequest']>, ParentType, ContextType>;
  leaves?: Resolver<Array<ResolversTypes['Leave']>, ParentType, ContextType>;
  pk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AutoFillSlot?: AutoFillSlotResolvers<ContextType>;
  AutoFillSlotWorker?: AutoFillSlotWorkerResolvers<ContextType>;
  AutoFillWorkHour?: AutoFillWorkHourResolvers<ContextType>;
  AutoFillWorkerLeave?: AutoFillWorkerLeaveResolvers<ContextType>;
  Calendar?: CalendarResolvers<ContextType>;
  Company?: CompanyResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Invitation?: InvitationResolvers<ContextType>;
  InvitationEntity?: InvitationEntityResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Leave?: LeaveResolvers<ContextType>;
  LeaveRequest?: LeaveRequestResolvers<ContextType>;
  MemberQualifications?: MemberQualificationsResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  QuotaFulfilment?: QuotaFulfilmentResolvers<ContextType>;
  Schedule?: ScheduleResolvers<ContextType>;
  ShiftPosition?: ShiftPositionResolvers<ContextType>;
  ShiftPositionSchedule?: ShiftPositionScheduleResolvers<ContextType>;
  ShiftsAutoFillParams?: ShiftsAutoFillParamsResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
  Unit?: UnitResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserSchedule?: UserScheduleResolvers<ContextType>;
};

