/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { companies as Query_companies } from './schema/company/resolvers/Query/companies';
import    { company as Query_company } from './schema/company/resolvers/Query/company';
import    { invitation as Query_invitation } from './schema/invitation/resolvers/Query/invitation';
import    { invitationsTo as Query_invitationsTo } from './schema/invitation/resolvers/Query/invitationsTo';
import    { myInvitations as Query_myInvitations } from './schema/invitation/resolvers/Query/myInvitations';
import    { team as Query_team } from './schema/team/resolvers/Query/team';
import    { unit as Query_unit } from './schema/unit/resolvers/Query/unit';
import    { createCompany as Mutation_createCompany } from './schema/company/resolvers/Mutation/createCompany';
import    { createInvitation as Mutation_createInvitation } from './schema/invitation/resolvers/Mutation/createInvitation';
import    { createTeam as Mutation_createTeam } from './schema/team/resolvers/Mutation/createTeam';
import    { createUnit as Mutation_createUnit } from './schema/unit/resolvers/Mutation/createUnit';
import    { deleteCompany as Mutation_deleteCompany } from './schema/company/resolvers/Mutation/deleteCompany';
import    { deleteInvitation as Mutation_deleteInvitation } from './schema/invitation/resolvers/Mutation/deleteInvitation';
import    { deleteTeam as Mutation_deleteTeam } from './schema/team/resolvers/Mutation/deleteTeam';
import    { deleteUnit as Mutation_deleteUnit } from './schema/unit/resolvers/Mutation/deleteUnit';
import    { updateCompany as Mutation_updateCompany } from './schema/company/resolvers/Mutation/updateCompany';
import    { updateTeam as Mutation_updateTeam } from './schema/team/resolvers/Mutation/updateTeam';
import    { updateUnit as Mutation_updateUnit } from './schema/unit/resolvers/Mutation/updateUnit';
import    { Company } from './schema/company/resolvers/Company';
import    { Invitation } from './schema/invitation/resolvers/Invitation';
import    { Team } from './schema/team/resolvers/Team';
import    { Unit } from './schema/unit/resolvers/Unit';
import    { User } from './schema/base/resolvers/User';
import    { DateTimeResolver } from 'graphql-scalars';
    export const resolvers: Resolvers = {
      Query: { companies: Query_companies,company: Query_company,invitation: Query_invitation,invitationsTo: Query_invitationsTo,myInvitations: Query_myInvitations,team: Query_team,unit: Query_unit },
      Mutation: { createCompany: Mutation_createCompany,createInvitation: Mutation_createInvitation,createTeam: Mutation_createTeam,createUnit: Mutation_createUnit,deleteCompany: Mutation_deleteCompany,deleteInvitation: Mutation_deleteInvitation,deleteTeam: Mutation_deleteTeam,deleteUnit: Mutation_deleteUnit,updateCompany: Mutation_updateCompany,updateTeam: Mutation_updateTeam,updateUnit: Mutation_updateUnit },
      
      Company: Company,
Invitation: Invitation,
Team: Team,
Unit: Unit,
User: User,
DateTime: DateTimeResolver
    }