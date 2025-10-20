/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { allTeams as Query_allTeams } from './schema/team/resolvers/Query/allTeams';
import    { assignableTeamMembers as Query_assignableTeamMembers } from './schema/shift_position/resolvers/Query/assignableTeamMembers';
import    { companies as Query_companies } from './schema/company/resolvers/Query/companies';
import    { company as Query_company } from './schema/company/resolvers/Query/company';
import    { invitation as Query_invitation } from './schema/invitation/resolvers/Query/invitation';
import    { invitationsTo as Query_invitationsTo } from './schema/invitation/resolvers/Query/invitationsTo';
import    { latestAppVersion as Query_latestAppVersion } from './schema/version/resolvers/Query/latestAppVersion';
import    { leaveRequest as Query_leaveRequest } from './schema/leave_request/resolvers/Query/leaveRequest';
import    { me as Query_me } from './schema/user/resolvers/Query/me';
import    { memberQuotaFulfilment as Query_memberQuotaFulfilment } from './schema/leave/resolvers/Query/memberQuotaFulfilment';
import    { myInvitations as Query_myInvitations } from './schema/invitation/resolvers/Query/myInvitations';
import    { myLeaveCalendar as Query_myLeaveCalendar } from './schema/leave/resolvers/Query/myLeaveCalendar';
import    { myLeaveRequests as Query_myLeaveRequests } from './schema/leave_request/resolvers/Query/myLeaveRequests';
import    { myQuotaFulfilment as Query_myQuotaFulfilment } from './schema/leave/resolvers/Query/myQuotaFulfilment';
import    { pendingLeaveRequests as Query_pendingLeaveRequests } from './schema/leave_request/resolvers/Query/pendingLeaveRequests';
import    { shiftPositions as Query_shiftPositions } from './schema/shift_position/resolvers/Query/shiftPositions';
import    { shiftsAutoFillParams as Query_shiftsAutoFillParams } from './schema/shifts_autofill/resolvers/Query/shiftsAutoFillParams';
import    { team as Query_team } from './schema/team/resolvers/Query/team';
import    { teamMember as Query_teamMember } from './schema/team/resolvers/Query/teamMember';
import    { unit as Query_unit } from './schema/unit/resolvers/Query/unit';
import    { units as Query_units } from './schema/unit/resolvers/Query/units';
import    { acceptInvitation as Mutation_acceptInvitation } from './schema/invitation/resolvers/Mutation/acceptInvitation';
import    { approveLeaveRequest as Mutation_approveLeaveRequest } from './schema/leave_request/resolvers/Mutation/approveLeaveRequest';
import    { assignShiftPositions as Mutation_assignShiftPositions } from './schema/shifts_autofill/resolvers/Mutation/assignShiftPositions';
import    { copyShiftPosition as Mutation_copyShiftPosition } from './schema/shift_position/resolvers/Mutation/copyShiftPosition';
import    { createCompany as Mutation_createCompany } from './schema/company/resolvers/Mutation/createCompany';
import    { createInvitation as Mutation_createInvitation } from './schema/invitation/resolvers/Mutation/createInvitation';
import    { createLeaveRequest as Mutation_createLeaveRequest } from './schema/leave_request/resolvers/Mutation/createLeaveRequest';
import    { createLeaveRequestForUser as Mutation_createLeaveRequestForUser } from './schema/leave_request/resolvers/Mutation/createLeaveRequestForUser';
import    { createShiftPosition as Mutation_createShiftPosition } from './schema/shift_position/resolvers/Mutation/createShiftPosition';
import    { createSingleDayLeaveRequests as Mutation_createSingleDayLeaveRequests } from './schema/leave_request/resolvers/Mutation/createSingleDayLeaveRequests';
import    { createSingleDayLeaveRequestsForUser as Mutation_createSingleDayLeaveRequestsForUser } from './schema/leave_request/resolvers/Mutation/createSingleDayLeaveRequestsForUser';
import    { createTeam as Mutation_createTeam } from './schema/team/resolvers/Mutation/createTeam';
import    { createTeamMember as Mutation_createTeamMember } from './schema/team/resolvers/Mutation/createTeamMember';
import    { createUnit as Mutation_createUnit } from './schema/unit/resolvers/Mutation/createUnit';
import    { deleteCompany as Mutation_deleteCompany } from './schema/company/resolvers/Mutation/deleteCompany';
import    { deleteInvitation as Mutation_deleteInvitation } from './schema/invitation/resolvers/Mutation/deleteInvitation';
import    { deleteLeave as Mutation_deleteLeave } from './schema/leave/resolvers/Mutation/deleteLeave';
import    { deleteLeaveRequest as Mutation_deleteLeaveRequest } from './schema/leave_request/resolvers/Mutation/deleteLeaveRequest';
import    { deleteShiftPosition as Mutation_deleteShiftPosition } from './schema/shift_position/resolvers/Mutation/deleteShiftPosition';
import    { deleteTeam as Mutation_deleteTeam } from './schema/team/resolvers/Mutation/deleteTeam';
import    { deleteUnit as Mutation_deleteUnit } from './schema/unit/resolvers/Mutation/deleteUnit';
import    { moveShiftPosition as Mutation_moveShiftPosition } from './schema/shift_position/resolvers/Mutation/moveShiftPosition';
import    { populateDemoAccount as Mutation_populateDemoAccount } from './schema/demo/resolvers/Mutation/populateDemoAccount';
import    { publishShiftPositions as Mutation_publishShiftPositions } from './schema/shift_position/resolvers/Mutation/publishShiftPositions';
import    { rejectLeaveRequest as Mutation_rejectLeaveRequest } from './schema/leave_request/resolvers/Mutation/rejectLeaveRequest';
import    { removeUserFromTeam as Mutation_removeUserFromTeam } from './schema/team/resolvers/Mutation/removeUserFromTeam';
import    { revertShiftPositions as Mutation_revertShiftPositions } from './schema/shift_position/resolvers/Mutation/revertShiftPositions';
import    { saveTeamMemberQualifications as Mutation_saveTeamMemberQualifications } from './schema/team/resolvers/Mutation/saveTeamMemberQualifications';
import    { unassignShiftPosition as Mutation_unassignShiftPosition } from './schema/shift_position/resolvers/Mutation/unassignShiftPosition';
import    { unassignShiftPositions as Mutation_unassignShiftPositions } from './schema/shift_position/resolvers/Mutation/unassignShiftPositions';
import    { updateCompany as Mutation_updateCompany } from './schema/company/resolvers/Mutation/updateCompany';
import    { updateCompanySettings as Mutation_updateCompanySettings } from './schema/company/resolvers/Mutation/updateCompanySettings';
import    { updateLeaveRequest as Mutation_updateLeaveRequest } from './schema/leave_request/resolvers/Mutation/updateLeaveRequest';
import    { updateMe as Mutation_updateMe } from './schema/user/resolvers/Mutation/updateMe';
import    { updateMySettings as Mutation_updateMySettings } from './schema/user/resolvers/Mutation/updateMySettings';
import    { updateShiftPosition as Mutation_updateShiftPosition } from './schema/shift_position/resolvers/Mutation/updateShiftPosition';
import    { updateTeam as Mutation_updateTeam } from './schema/team/resolvers/Mutation/updateTeam';
import    { updateTeamMember as Mutation_updateTeamMember } from './schema/team/resolvers/Mutation/updateTeamMember';
import    { updateTeamSettings as Mutation_updateTeamSettings } from './schema/team/resolvers/Mutation/updateTeamSettings';
import    { updateUnit as Mutation_updateUnit } from './schema/unit/resolvers/Mutation/updateUnit';
import    { updateUnitSettings as Mutation_updateUnitSettings } from './schema/unit/resolvers/Mutation/updateUnitSettings';
import    { updateUserSettings as Mutation_updateUserSettings } from './schema/user/resolvers/Mutation/updateUserSettings';
import    { AutoFillSlot } from './schema/shifts_autofill/resolvers/AutoFillSlot';
import    { AutoFillSlotWorker } from './schema/shifts_autofill/resolvers/AutoFillSlotWorker';
import    { AutoFillWorkDay } from './schema/shifts_autofill/resolvers/AutoFillWorkDay';
import    { AutoFillWorkHour } from './schema/shifts_autofill/resolvers/AutoFillWorkHour';
import    { AutoFillWorkSchedule } from './schema/shifts_autofill/resolvers/AutoFillWorkSchedule';
import    { AutoFillWorkerLeave } from './schema/shifts_autofill/resolvers/AutoFillWorkerLeave';
import    { Calendar } from './schema/leave/resolvers/Calendar';
import    { Company } from './schema/company/resolvers/Company';
import    { DemoEntity } from './schema/demo/resolvers/DemoEntity';
import    { DemoPopulationResult } from './schema/demo/resolvers/DemoPopulationResult';
import    { DemoUser } from './schema/demo/resolvers/DemoUser';
import    { Invitation } from './schema/invitation/resolvers/Invitation';
import    { Leave } from './schema/leave/resolvers/Leave';
import    { LeaveRequest } from './schema/leave_request/resolvers/LeaveRequest';
import    { MemberQualifications } from './schema/team/resolvers/MemberQualifications';
import    { QueryShiftPositionsOutput } from './schema/shift_position/resolvers/QueryShiftPositionsOutput';
import    { QuotaFulfilment } from './schema/leave/resolvers/QuotaFulfilment';
import    { Schedule } from './schema/schedule/resolvers/Schedule';
import    { ShiftPosition } from './schema/shift_position/resolvers/ShiftPosition';
import    { ShiftPositionSchedule } from './schema/shift_position/resolvers/ShiftPositionSchedule';
import    { ShiftsAutoFillParams } from './schema/shifts_autofill/resolvers/ShiftsAutoFillParams';
import    { Team } from './schema/team/resolvers/Team';
import    { Unit } from './schema/unit/resolvers/Unit';
import    { User } from './schema/user/resolvers/User';
import    { UserSchedule } from './schema/schedule/resolvers/UserSchedule';
import    { DateResolver,DateTimeResolver,JSONResolver } from 'graphql-scalars';
    export const resolvers: Resolvers = {
      Query: { allTeams: Query_allTeams,assignableTeamMembers: Query_assignableTeamMembers,companies: Query_companies,company: Query_company,invitation: Query_invitation,invitationsTo: Query_invitationsTo,latestAppVersion: Query_latestAppVersion,leaveRequest: Query_leaveRequest,me: Query_me,memberQuotaFulfilment: Query_memberQuotaFulfilment,myInvitations: Query_myInvitations,myLeaveCalendar: Query_myLeaveCalendar,myLeaveRequests: Query_myLeaveRequests,myQuotaFulfilment: Query_myQuotaFulfilment,pendingLeaveRequests: Query_pendingLeaveRequests,shiftPositions: Query_shiftPositions,shiftsAutoFillParams: Query_shiftsAutoFillParams,team: Query_team,teamMember: Query_teamMember,unit: Query_unit,units: Query_units },
      Mutation: { acceptInvitation: Mutation_acceptInvitation,approveLeaveRequest: Mutation_approveLeaveRequest,assignShiftPositions: Mutation_assignShiftPositions,copyShiftPosition: Mutation_copyShiftPosition,createCompany: Mutation_createCompany,createInvitation: Mutation_createInvitation,createLeaveRequest: Mutation_createLeaveRequest,createLeaveRequestForUser: Mutation_createLeaveRequestForUser,createShiftPosition: Mutation_createShiftPosition,createSingleDayLeaveRequests: Mutation_createSingleDayLeaveRequests,createSingleDayLeaveRequestsForUser: Mutation_createSingleDayLeaveRequestsForUser,createTeam: Mutation_createTeam,createTeamMember: Mutation_createTeamMember,createUnit: Mutation_createUnit,deleteCompany: Mutation_deleteCompany,deleteInvitation: Mutation_deleteInvitation,deleteLeave: Mutation_deleteLeave,deleteLeaveRequest: Mutation_deleteLeaveRequest,deleteShiftPosition: Mutation_deleteShiftPosition,deleteTeam: Mutation_deleteTeam,deleteUnit: Mutation_deleteUnit,moveShiftPosition: Mutation_moveShiftPosition,populateDemoAccount: Mutation_populateDemoAccount,publishShiftPositions: Mutation_publishShiftPositions,rejectLeaveRequest: Mutation_rejectLeaveRequest,removeUserFromTeam: Mutation_removeUserFromTeam,revertShiftPositions: Mutation_revertShiftPositions,saveTeamMemberQualifications: Mutation_saveTeamMemberQualifications,unassignShiftPosition: Mutation_unassignShiftPosition,unassignShiftPositions: Mutation_unassignShiftPositions,updateCompany: Mutation_updateCompany,updateCompanySettings: Mutation_updateCompanySettings,updateLeaveRequest: Mutation_updateLeaveRequest,updateMe: Mutation_updateMe,updateMySettings: Mutation_updateMySettings,updateShiftPosition: Mutation_updateShiftPosition,updateTeam: Mutation_updateTeam,updateTeamMember: Mutation_updateTeamMember,updateTeamSettings: Mutation_updateTeamSettings,updateUnit: Mutation_updateUnit,updateUnitSettings: Mutation_updateUnitSettings,updateUserSettings: Mutation_updateUserSettings },
      
      AutoFillSlot: AutoFillSlot,
AutoFillSlotWorker: AutoFillSlotWorker,
AutoFillWorkDay: AutoFillWorkDay,
AutoFillWorkHour: AutoFillWorkHour,
AutoFillWorkSchedule: AutoFillWorkSchedule,
AutoFillWorkerLeave: AutoFillWorkerLeave,
Calendar: Calendar,
Company: Company,
DemoEntity: DemoEntity,
DemoPopulationResult: DemoPopulationResult,
DemoUser: DemoUser,
Invitation: Invitation,
Leave: Leave,
LeaveRequest: LeaveRequest,
MemberQualifications: MemberQualifications,
QueryShiftPositionsOutput: QueryShiftPositionsOutput,
QuotaFulfilment: QuotaFulfilment,
Schedule: Schedule,
ShiftPosition: ShiftPosition,
ShiftPositionSchedule: ShiftPositionSchedule,
ShiftsAutoFillParams: ShiftsAutoFillParams,
Team: Team,
Unit: Unit,
User: User,
UserSchedule: UserSchedule,
Date: DateResolver,
DateTime: DateTimeResolver,
JSON: JSONResolver
    }