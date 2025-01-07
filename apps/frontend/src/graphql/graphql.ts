/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Company = {
  __typename?: 'Company';
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  name: Scalars['String']['output'];
  pk: Scalars['String']['output'];
  units?: Maybe<Array<Unit>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<User>;
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

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvitation: Invitation;
  createCompany: Company;
  createInvitation: Invitation;
  createTeam: Team;
  createUnit: Unit;
  deleteCompany: Company;
  deleteInvitation: Invitation;
  deleteTeam: Team;
  deleteUnit: Unit;
  updateCompany: Company;
  updateTeam: Team;
  updateUnit: Unit;
};


export type MutationAcceptInvitationArgs = {
  secret: Scalars['String']['input'];
};


export type MutationCreateCompanyArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateInvitationArgs = {
  invitedUserEmail: Scalars['String']['input'];
  permissionType: Scalars['Int']['input'];
  toEntityPk: Scalars['String']['input'];
};


export type MutationCreateTeamArgs = {
  name: Scalars['String']['input'];
  unitPk: Scalars['String']['input'];
};


export type MutationCreateUnitArgs = {
  companyPk: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationDeleteCompanyArgs = {
  pk: Scalars['String']['input'];
};


export type MutationDeleteInvitationArgs = {
  pk: Scalars['String']['input'];
  sk: Scalars['String']['input'];
};


export type MutationDeleteTeamArgs = {
  pk: Scalars['String']['input'];
};


export type MutationDeleteUnitArgs = {
  pk: Scalars['String']['input'];
};


export type MutationUpdateCompanyArgs = {
  name: Scalars['String']['input'];
  pk: Scalars['String']['input'];
};


export type MutationUpdateTeamArgs = {
  name: Scalars['String']['input'];
  pk: Scalars['String']['input'];
};


export type MutationUpdateUnitArgs = {
  name: Scalars['String']['input'];
  pk: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  companies: Array<Company>;
  company: Company;
  invitation: Invitation;
  invitationsTo: Array<Invitation>;
  myInvitations: Array<Invitation>;
  team: Team;
  unit: Unit;
};


export type QueryCompanyArgs = {
  companyPk: Scalars['String']['input'];
};


export type QueryInvitationArgs = {
  secret: Scalars['String']['input'];
};


export type QueryInvitationsToArgs = {
  toEntityPk: Scalars['String']['input'];
};


export type QueryTeamArgs = {
  teamPk: Scalars['String']['input'];
};


export type QueryUnitArgs = {
  unitPk: Scalars['String']['input'];
};

export type Team = {
  __typename?: 'Team';
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  name: Scalars['String']['output'];
  pk: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<User>;
};

export type Unit = {
  __typename?: 'Unit';
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  name: Scalars['String']['output'];
  pk: Scalars['String']['output'];
  teams: Array<Team>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<User>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  pk: Scalars['String']['output'];
};
