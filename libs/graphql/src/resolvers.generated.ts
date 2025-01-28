/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { companies as Query_companies } from './schema/company/resolvers/Query/companies';
import    { company as Query_company } from './schema/company/resolvers/Query/company';
import    { invitation as Query_invitation } from './schema/invitation/resolvers/Query/invitation';
import    { invitationsTo as Query_invitationsTo } from './schema/invitation/resolvers/Query/invitationsTo';
import    { leaveRequest as Query_leaveRequest } from './schema/leave_request/resolvers/Query/leaveRequest';
import    { me as Query_me } from './schema/user/resolvers/Query/me';
import    { myInvitations as Query_myInvitations } from './schema/invitation/resolvers/Query/myInvitations';
import    { myLeaveCalendar as Query_myLeaveCalendar } from './schema/leave/resolvers/Query/myLeaveCalendar';
import    { myQuotaFulfilment as Query_myQuotaFulfilment } from './schema/leave/resolvers/Query/myQuotaFulfilment';
import    { pendingLeaveRequests as Query_pendingLeaveRequests } from './schema/leave_request/resolvers/Query/pendingLeaveRequests';
import    { team as Query_team } from './schema/team/resolvers/Query/team';
import    { unit as Query_unit } from './schema/unit/resolvers/Query/unit';
import    { acceptInvitation as Mutation_acceptInvitation } from './schema/invitation/resolvers/Mutation/acceptInvitation';
import    { approveLeaveRequest as Mutation_approveLeaveRequest } from './schema/leave_request/resolvers/Mutation/approveLeaveRequest';
import    { createCompany as Mutation_createCompany } from './schema/company/resolvers/Mutation/createCompany';
import    { createInvitation as Mutation_createInvitation } from './schema/invitation/resolvers/Mutation/createInvitation';
import    { createLeaveRequest as Mutation_createLeaveRequest } from './schema/leave_request/resolvers/Mutation/createLeaveRequest';
import    { createTeam as Mutation_createTeam } from './schema/team/resolvers/Mutation/createTeam';
import    { createUnit as Mutation_createUnit } from './schema/unit/resolvers/Mutation/createUnit';
import    { deleteCompany as Mutation_deleteCompany } from './schema/company/resolvers/Mutation/deleteCompany';
import    { deleteInvitation as Mutation_deleteInvitation } from './schema/invitation/resolvers/Mutation/deleteInvitation';
import    { deleteLeave as Mutation_deleteLeave } from './schema/leave/resolvers/Mutation/deleteLeave';
import    { deleteLeaveRequest as Mutation_deleteLeaveRequest } from './schema/leave_request/resolvers/Mutation/deleteLeaveRequest';
import    { deleteTeam as Mutation_deleteTeam } from './schema/team/resolvers/Mutation/deleteTeam';
import    { deleteUnit as Mutation_deleteUnit } from './schema/unit/resolvers/Mutation/deleteUnit';
import    { rejectLeaveRequest as Mutation_rejectLeaveRequest } from './schema/leave_request/resolvers/Mutation/rejectLeaveRequest';
import    { removeUserFromTeam as Mutation_removeUserFromTeam } from './schema/team/resolvers/Mutation/removeUserFromTeam';
import    { saveTeamMemberQualifications as Mutation_saveTeamMemberQualifications } from './schema/team/resolvers/Mutation/saveTeamMemberQualifications';
import    { updateCompany as Mutation_updateCompany } from './schema/company/resolvers/Mutation/updateCompany';
import    { updateCompanySettings as Mutation_updateCompanySettings } from './schema/company/resolvers/Mutation/updateCompanySettings';
import    { updateLeaveRequest as Mutation_updateLeaveRequest } from './schema/leave_request/resolvers/Mutation/updateLeaveRequest';
import    { updateMe as Mutation_updateMe } from './schema/user/resolvers/Mutation/updateMe';
import    { updateMySettings as Mutation_updateMySettings } from './schema/user/resolvers/Mutation/updateMySettings';
import    { updateTeam as Mutation_updateTeam } from './schema/team/resolvers/Mutation/updateTeam';
import    { updateTeamSettings as Mutation_updateTeamSettings } from './schema/team/resolvers/Mutation/updateTeamSettings';
import    { updateUnit as Mutation_updateUnit } from './schema/unit/resolvers/Mutation/updateUnit';
import    { updateUnitSettings as Mutation_updateUnitSettings } from './schema/unit/resolvers/Mutation/updateUnitSettings';
import    { Calendar } from './schema/leave/resolvers/Calendar';
import    { Company } from './schema/company/resolvers/Company';
import    { Invitation } from './schema/invitation/resolvers/Invitation';
import    { Leave } from './schema/leave/resolvers/Leave';
import    { LeaveRequest } from './schema/leave_request/resolvers/LeaveRequest';
import    { MemberQualifications } from './schema/team/resolvers/MemberQualifications';
import    { QuotaFulfilment } from './schema/leave/resolvers/QuotaFulfilment';
import    { Schedule } from './schema/schedule/resolvers/Schedule';
import    { Team } from './schema/team/resolvers/Team';
import    { Unit } from './schema/unit/resolvers/Unit';
import    { User } from './schema/user/resolvers/User';
import    { UserSchedule } from './schema/schedule/resolvers/UserSchedule';
import    { DateResolver,DateTimeResolver,JSONResolver } from 'graphql-scalars';
    export const resolvers: Resolvers = {
      Query: { companies: Query_companies,company: Query_company,invitation: Query_invitation,invitationsTo: Query_invitationsTo,leaveRequest: Query_leaveRequest,me: Query_me,myInvitations: Query_myInvitations,myLeaveCalendar: Query_myLeaveCalendar,myQuotaFulfilment: Query_myQuotaFulfilment,pendingLeaveRequests: Query_pendingLeaveRequests,team: Query_team,unit: Query_unit },
      Mutation: { acceptInvitation: Mutation_acceptInvitation,approveLeaveRequest: Mutation_approveLeaveRequest,createCompany: Mutation_createCompany,createInvitation: Mutation_createInvitation,createLeaveRequest: Mutation_createLeaveRequest,createTeam: Mutation_createTeam,createUnit: Mutation_createUnit,deleteCompany: Mutation_deleteCompany,deleteInvitation: Mutation_deleteInvitation,deleteLeave: Mutation_deleteLeave,deleteLeaveRequest: Mutation_deleteLeaveRequest,deleteTeam: Mutation_deleteTeam,deleteUnit: Mutation_deleteUnit,rejectLeaveRequest: Mutation_rejectLeaveRequest,removeUserFromTeam: Mutation_removeUserFromTeam,saveTeamMemberQualifications: Mutation_saveTeamMemberQualifications,updateCompany: Mutation_updateCompany,updateCompanySettings: Mutation_updateCompanySettings,updateLeaveRequest: Mutation_updateLeaveRequest,updateMe: Mutation_updateMe,updateMySettings: Mutation_updateMySettings,updateTeam: Mutation_updateTeam,updateTeamSettings: Mutation_updateTeamSettings,updateUnit: Mutation_updateUnit,updateUnitSettings: Mutation_updateUnitSettings },
      
      Calendar: Calendar,
Company: Company,
Invitation: Invitation,
Leave: Leave,
LeaveRequest: LeaveRequest,
MemberQualifications: MemberQualifications,
QuotaFulfilment: QuotaFulfilment,
Schedule: Schedule,
Team: Team,
Unit: Unit,
User: User,
UserSchedule: UserSchedule,
Date: DateResolver,
DateTime: DateTimeResolver,
JSON: JSONResolver
    }