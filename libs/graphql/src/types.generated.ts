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
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: Date | string; output: Date | string; }
  JSON: { input: any; output: any; }
};

export type ApproveLeaveRequestInput = {
  pk: Scalars['String']['input'];
  sk: Scalars['String']['input'];
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
  settings?: Maybe<Scalars['JSON']['output']>;
  units?: Maybe<Array<Unit>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<User>;
};


export type CompanysettingsArgs = {
  name: Scalars['String']['input'];
};

export type CreateLeaveRequestInput = {
  companyPk: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  reason: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type DeleteLeaveInput = {
  pk: Scalars['String']['input'];
  sk: Scalars['String']['input'];
};

export type DeleteLeaveRequestInput = {
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
  approvedBy?: Maybe<Array<Scalars['String']['output']>>;
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  endDate: Scalars['String']['output'];
  pk: Scalars['String']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  sk: Scalars['String']['output'];
  startDate: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
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
  removeUserFromTeam: Team;
  updateCompany: Company;
  updateCompanySettings: Company;
  updateLeaveRequest: LeaveRequest;
  updateTeam: Team;
  updateUnit: Unit;
  updateUnitSettings: Unit;
};


export type MutationacceptInvitationArgs = {
  secret: Scalars['String']['input'];
};


export type MutationapproveLeaveRequestArgs = {
  input: ApproveLeaveRequestInput;
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


export type MutationcreateTeamArgs = {
  name: Scalars['String']['input'];
  unitPk: Scalars['String']['input'];
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


export type MutationdeleteTeamArgs = {
  pk: Scalars['String']['input'];
};


export type MutationdeleteUnitArgs = {
  pk: Scalars['String']['input'];
};


export type MutationremoveUserFromTeamArgs = {
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


export type MutationupdateTeamArgs = {
  name: Scalars['String']['input'];
  pk: Scalars['String']['input'];
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

export type Query = {
  __typename?: 'Query';
  companies: Array<Company>;
  company: Company;
  invitation: Invitation;
  invitationsTo: Array<Invitation>;
  leaveRequest: LeaveRequest;
  myInvitations: Array<Invitation>;
  myLeaveCalendar: Calendar;
  team: Team;
  unit: Unit;
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


export type QuerymyLeaveCalendarArgs = {
  companyPk: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};


export type QueryteamArgs = {
  teamPk: Scalars['String']['input'];
};


export type QueryunitArgs = {
  unitPk: Scalars['String']['input'];
};

export type Team = {
  __typename?: 'Team';
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  members: Array<User>;
  name: Scalars['String']['output'];
  pk: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<User>;
};

export type Unit = {
  __typename?: 'Unit';
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  members: Array<User>;
  name: Scalars['String']['output'];
  pk: Scalars['String']['output'];
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

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  emailMd5: Scalars['String']['output'];
  name: Scalars['String']['output'];
  pk: Scalars['String']['output'];
  resourcePermission?: Maybe<Scalars['Int']['output']>;
  resourcePermissionGivenAt?: Maybe<Scalars['DateTime']['output']>;
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
  Calendar: ResolverTypeWrapper<Calendar>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Company: ResolverTypeWrapper<Company>;
  CreateLeaveRequestInput: CreateLeaveRequestInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DeleteLeaveInput: DeleteLeaveInput;
  DeleteLeaveRequestInput: DeleteLeaveRequestInput;
  Invitation: ResolverTypeWrapper<Omit<Invitation, 'toEntity'> & { toEntity: ResolversTypes['InvitationEntity'] }>;
  InvitationEntity: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['InvitationEntity']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Leave: ResolverTypeWrapper<Leave>;
  LeaveRequest: ResolverTypeWrapper<LeaveRequest>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Team: ResolverTypeWrapper<Team>;
  Unit: ResolverTypeWrapper<Unit>;
  UpdateLeaveRequestInput: UpdateLeaveRequestInput;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  ApproveLeaveRequestInput: ApproveLeaveRequestInput;
  String: Scalars['String']['output'];
  Calendar: Calendar;
  Int: Scalars['Int']['output'];
  Company: Company;
  CreateLeaveRequestInput: CreateLeaveRequestInput;
  DateTime: Scalars['DateTime']['output'];
  DeleteLeaveInput: DeleteLeaveInput;
  DeleteLeaveRequestInput: DeleteLeaveRequestInput;
  Invitation: Omit<Invitation, 'toEntity'> & { toEntity: ResolversParentTypes['InvitationEntity'] };
  InvitationEntity: ResolversUnionTypes<ResolversParentTypes>['InvitationEntity'];
  JSON: Scalars['JSON']['output'];
  Leave: Leave;
  LeaveRequest: LeaveRequest;
  Boolean: Scalars['Boolean']['output'];
  Mutation: {};
  Query: {};
  Team: Team;
  Unit: Unit;
  UpdateLeaveRequestInput: UpdateLeaveRequestInput;
  User: User;
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
  settings?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<CompanysettingsArgs, 'name'>>;
  units?: Resolver<Maybe<Array<ResolversTypes['Unit']>>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

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
  approvedBy?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  acceptInvitation?: Resolver<ResolversTypes['Invitation'], ParentType, ContextType, RequireFields<MutationacceptInvitationArgs, 'secret'>>;
  approveLeaveRequest?: Resolver<ResolversTypes['LeaveRequest'], ParentType, ContextType, RequireFields<MutationapproveLeaveRequestArgs, 'input'>>;
  createCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationcreateCompanyArgs, 'name'>>;
  createInvitation?: Resolver<ResolversTypes['Invitation'], ParentType, ContextType, RequireFields<MutationcreateInvitationArgs, 'invitedUserEmail' | 'permissionType' | 'toEntityPk'>>;
  createLeaveRequest?: Resolver<ResolversTypes['LeaveRequest'], ParentType, ContextType, RequireFields<MutationcreateLeaveRequestArgs, 'input'>>;
  createTeam?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationcreateTeamArgs, 'name' | 'unitPk'>>;
  createUnit?: Resolver<ResolversTypes['Unit'], ParentType, ContextType, RequireFields<MutationcreateUnitArgs, 'companyPk' | 'name'>>;
  deleteCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationdeleteCompanyArgs, 'pk'>>;
  deleteInvitation?: Resolver<ResolversTypes['Invitation'], ParentType, ContextType, RequireFields<MutationdeleteInvitationArgs, 'pk' | 'sk'>>;
  deleteLeave?: Resolver<ResolversTypes['Leave'], ParentType, ContextType, RequireFields<MutationdeleteLeaveArgs, 'input'>>;
  deleteLeaveRequest?: Resolver<ResolversTypes['LeaveRequest'], ParentType, ContextType, RequireFields<MutationdeleteLeaveRequestArgs, 'input'>>;
  deleteTeam?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationdeleteTeamArgs, 'pk'>>;
  deleteUnit?: Resolver<ResolversTypes['Unit'], ParentType, ContextType, RequireFields<MutationdeleteUnitArgs, 'pk'>>;
  removeUserFromTeam?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationremoveUserFromTeamArgs, 'teamPk' | 'userPk'>>;
  updateCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationupdateCompanyArgs, 'name' | 'pk'>>;
  updateCompanySettings?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationupdateCompanySettingsArgs, 'companyPk' | 'name' | 'settings'>>;
  updateLeaveRequest?: Resolver<ResolversTypes['LeaveRequest'], ParentType, ContextType, RequireFields<MutationupdateLeaveRequestArgs, 'input'>>;
  updateTeam?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationupdateTeamArgs, 'name' | 'pk'>>;
  updateUnit?: Resolver<ResolversTypes['Unit'], ParentType, ContextType, RequireFields<MutationupdateUnitArgs, 'name' | 'pk'>>;
  updateUnitSettings?: Resolver<ResolversTypes['Unit'], ParentType, ContextType, RequireFields<MutationupdateUnitSettingsArgs, 'name' | 'settings' | 'unitPk'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  companies?: Resolver<Array<ResolversTypes['Company']>, ParentType, ContextType>;
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<QuerycompanyArgs, 'companyPk'>>;
  invitation?: Resolver<ResolversTypes['Invitation'], ParentType, ContextType, RequireFields<QueryinvitationArgs, 'secret'>>;
  invitationsTo?: Resolver<Array<ResolversTypes['Invitation']>, ParentType, ContextType, RequireFields<QueryinvitationsToArgs, 'toEntityPk'>>;
  leaveRequest?: Resolver<ResolversTypes['LeaveRequest'], ParentType, ContextType, RequireFields<QueryleaveRequestArgs, 'pk' | 'sk'>>;
  myInvitations?: Resolver<Array<ResolversTypes['Invitation']>, ParentType, ContextType>;
  myLeaveCalendar?: Resolver<ResolversTypes['Calendar'], ParentType, ContextType, RequireFields<QuerymyLeaveCalendarArgs, 'companyPk' | 'year'>>;
  team?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<QueryteamArgs, 'teamPk'>>;
  unit?: Resolver<ResolversTypes['Unit'], ParentType, ContextType, RequireFields<QueryunitArgs, 'unitPk'>>;
};

export type TeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UnitResolvers<ContextType = any, ParentType extends ResolversParentTypes['Unit'] = ResolversParentTypes['Unit']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  settings?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<UnitsettingsArgs, 'name'>>;
  teams?: Resolver<Array<ResolversTypes['Team']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  emailMd5?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pk?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resourcePermission?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  resourcePermissionGivenAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Calendar?: CalendarResolvers<ContextType>;
  Company?: CompanyResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Invitation?: InvitationResolvers<ContextType>;
  InvitationEntity?: InvitationEntityResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Leave?: LeaveResolvers<ContextType>;
  LeaveRequest?: LeaveRequestResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
  Unit?: UnitResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

