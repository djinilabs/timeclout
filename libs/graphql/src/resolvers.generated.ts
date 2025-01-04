/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { companies as Query_companies } from './schema/company/resolvers/Query/companies';
import    { company as Query_company } from './schema/company/resolvers/Query/company';
import    { createCompany as Mutation_createCompany } from './schema/company/resolvers/Mutation/createCompany';
import    { createUnit as Mutation_createUnit } from './schema/unit/resolvers/Mutation/createUnit';
import    { deleteCompany as Mutation_deleteCompany } from './schema/company/resolvers/Mutation/deleteCompany';
import    { deleteUnit as Mutation_deleteUnit } from './schema/unit/resolvers/Mutation/deleteUnit';
import    { updateCompany as Mutation_updateCompany } from './schema/company/resolvers/Mutation/updateCompany';
import    { updateUnit as Mutation_updateUnit } from './schema/unit/resolvers/Mutation/updateUnit';
import    { Company } from './schema/company/resolvers/Company';
import    { Unit } from './schema/unit/resolvers/Unit';
import    { User } from './schema/base/resolvers/User';
import    { DateTimeResolver } from 'graphql-scalars';
    export const resolvers: Resolvers = {
      Query: { companies: Query_companies,company: Query_company },
      Mutation: { createCompany: Mutation_createCompany,createUnit: Mutation_createUnit,deleteCompany: Mutation_deleteCompany,deleteUnit: Mutation_deleteUnit,updateCompany: Mutation_updateCompany,updateUnit: Mutation_updateUnit },
      
      Company: Company,
Unit: Unit,
User: User,
DateTime: DateTimeResolver
    }