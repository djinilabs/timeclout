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
  pk: Scalars['ID']['output'];
  units: Array<Unit>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCompany: Company;
  createUnit: Unit;
  deleteCompany: Company;
  deleteUnit: Unit;
  updateCompany: Company;
  updateUnit: Unit;
};


export type MutationCreateCompanyArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateUnitArgs = {
  companyPk: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationDeleteCompanyArgs = {
  pk: Scalars['ID']['input'];
};


export type MutationDeleteUnitArgs = {
  pk: Scalars['ID']['input'];
};


export type MutationUpdateCompanyArgs = {
  name: Scalars['String']['input'];
  pk: Scalars['ID']['input'];
};


export type MutationUpdateUnitArgs = {
  name: Scalars['String']['input'];
  pk: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  companies: Array<Company>;
  company: Company;
};


export type QueryCompanyArgs = {
  companyPk: Scalars['ID']['input'];
};

export type Unit = {
  __typename?: 'Unit';
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  name: Scalars['String']['output'];
  pk: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<User>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  pk: Scalars['ID']['output'];
};
