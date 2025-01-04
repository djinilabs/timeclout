/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { companies as Query_companies } from './schema/company/resolvers/Query/companies';
import    { company as Query_company } from './schema/company/resolvers/Query/company';
import    { unit as Query_unit } from './schema/unit/resolvers/Query/unit';
import    { createCompany as Mutation_createCompany } from './schema/company/resolvers/Mutation/createCompany';
import    { createTeam as Mutation_createTeam } from './schema/team/resolvers/Mutation/createTeam';
import    { createUnit as Mutation_createUnit } from './schema/unit/resolvers/Mutation/createUnit';
import    { deleteCompany as Mutation_deleteCompany } from './schema/company/resolvers/Mutation/deleteCompany';
import    { deleteTeam as Mutation_deleteTeam } from './schema/team/resolvers/Mutation/deleteTeam';
import    { deleteUnit as Mutation_deleteUnit } from './schema/unit/resolvers/Mutation/deleteUnit';
import    { updateCompany as Mutation_updateCompany } from './schema/company/resolvers/Mutation/updateCompany';
import    { updateTeam as Mutation_updateTeam } from './schema/team/resolvers/Mutation/updateTeam';
import    { updateUnit as Mutation_updateUnit } from './schema/unit/resolvers/Mutation/updateUnit';
import    { Company } from './schema/company/resolvers/Company';
import    { Team } from './schema/team/resolvers/Team';
import    { Unit } from './schema/unit/resolvers/Unit';
import    { User } from './schema/base/resolvers/User';
import    { DateTimeResolver } from 'graphql-scalars';
    export const resolvers: Resolvers = {
      Query: { companies: Query_companies,company: Query_company,unit: Query_unit },
      Mutation: { createCompany: Mutation_createCompany,createTeam: Mutation_createTeam,createUnit: Mutation_createUnit,deleteCompany: Mutation_deleteCompany,deleteTeam: Mutation_deleteTeam,deleteUnit: Mutation_deleteUnit,updateCompany: Mutation_updateCompany,updateTeam: Mutation_updateTeam,updateUnit: Mutation_updateUnit },
      
      Company: Company,
Team: Team,
Unit: Unit,
User: User,
DateTime: DateTimeResolver
    }