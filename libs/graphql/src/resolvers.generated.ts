/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { companies as Query_companies } from './schema/company/resolvers/Query/companies';
import    { company as Query_company } from './schema/company/resolvers/Query/company';
import    { createCompany as Mutation_createCompany } from './schema/company/resolvers/Mutation/createCompany';
import    { deleteCompany as Mutation_deleteCompany } from './schema/company/resolvers/Mutation/deleteCompany';
import    { updateCompany as Mutation_updateCompany } from './schema/company/resolvers/Mutation/updateCompany';
import    { Company } from './schema/company/resolvers/Company';
import    { User } from './schema/base/resolvers/User';
import    { DateTimeResolver } from 'graphql-scalars';
    export const resolvers: Resolvers = {
      Query: { companies: Query_companies,company: Query_company },
      Mutation: { createCompany: Mutation_createCompany,deleteCompany: Mutation_deleteCompany,updateCompany: Mutation_updateCompany },
      
      Company: Company,
User: User,
DateTime: DateTimeResolver
    }