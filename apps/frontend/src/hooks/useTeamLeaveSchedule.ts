import { ReactNode, useMemo } from "react";

import { Team, User } from "../graphql/graphql";
import { useQuery } from "../hooks/useQuery";
import { leaveTypeColors, leaveTypeIcons } from "../settings/leaveTypes";

import { useCompanyWithSettings } from "./useCompanyWithSettings";

import { DayDate } from "@/day-date";
import teamApprovedScheduleQuery from "@/graphql-client/queries/teamApprovedSchedule.graphql";
import { getDefined } from "@/utils";

export interface LeaveRenderInfo {
  type: string;
  user: {
    pk: string;
    name: string;
    email: string;
    emailMd5: string;
  };
  icon: ReactNode;
  color: string;
}

export interface UseTeamLeaveScheduleParams {
  company: string;
  team: string;
  calendarStartDay: DayDate;
  calendarEndDay: DayDate;
  pause?: boolean;
  restrictToUsers?: User[];
}

export const useTeamLeaveSchedule = ({
  company,
  team,
  calendarStartDay,
  calendarEndDay,
  pause,
  restrictToUsers,
}: UseTeamLeaveScheduleParams): {
  leaveSchedule: Record<string, LeaveRenderInfo[]>;
} => {
  const { settings: leaveTypesSettings } = useCompanyWithSettings({
    companyPk: getDefined(company),
    settingsName: "leaveTypes",
  });

  const [{ data: teamScheduleLastResult }] = useQuery<{ team: Team }>({
    query: teamApprovedScheduleQuery,
    variables: {
      teamPk: getDefined(team),
      startDate: calendarStartDay.toString(),
      endDate: calendarEndDay.toString(),
    },
    pause,
  });

  const teamScheduleResult = teamScheduleLastResult;

  const leaveSchedule: Record<string, LeaveRenderInfo[]> = useMemo(() => {
    const schedule = teamScheduleResult?.team.approvedSchedule;
    if (!schedule || !leaveTypesSettings) {
      if (process.env.NODE_ENV === "development") {
        console.log("Leave schedule debugging - missing data:", {
          hasSchedule: !!schedule,
          hasLeaveTypesSettings: !!leaveTypesSettings,
          schedule,
          leaveTypesSettings,
        });
      }
      return {};
    }

    if (process.env.NODE_ENV === "development") {
      console.log("Leave schedule debugging - processing schedule:", {
        userSchedulesCount: schedule.userSchedules.length,
        calendarStartDay: calendarStartDay.toString(),
        calendarEndDay: calendarEndDay.toString(),
        userSchedules: schedule.userSchedules.map((us) => ({
          user: us.user.name,
          leavesCount: us.leaves.length,
          leaveRequestsCount: us.leaveRequests.length,
        })),
      });
    }

    const result: Record<string, LeaveRenderInfo[]> = {};

    schedule.userSchedules
      .filter(
        (userSchedule) =>
          restrictToUsers?.some((user) => user.pk === userSchedule.user.pk) ??
          true
      )
      .forEach((userSchedule) => {
        // Create a map of leave requests for this user
        const leaveRequestsMap = new Map();
        userSchedule.leaveRequests.forEach((leaveRequest) => {
          leaveRequestsMap.set(
            `${leaveRequest.pk}/${leaveRequest.sk}`,
            leaveRequest
          );
        });

        userSchedule.leaves.forEach((leave) => {
          const leaveType = leaveTypesSettings.find(
            (type) => type.name === leave.type
          );
          if (!leaveType) {
            console.warn("Leave type not found for leave:", leave.type);
            return;
          }

          // Find the corresponding leave request to get the date range
          const leaveKey = `${leave.leaveRequestPk}/${leave.leaveRequestSk}`;
          const leaveRequest = leaveRequestsMap.get(leaveKey);

          // Debug logging
          if (process.env.NODE_ENV === "development") {
            console.log("Leave debugging:", {
              leaveKey,
              leaveRequestPk: leave.leaveRequestPk,
              leaveRequestSk: leave.leaveRequestSk,
              availableKeys: Array.from(leaveRequestsMap.keys()),
              foundLeaveRequest: !!leaveRequest,
            });
          }

          if (!leaveRequest) {
            console.warn("Leave request not found for leave:", {
              leaveKey,
              availableKeys: Array.from(leaveRequestsMap.keys()),
            });
            return;
          }

          const leaveRenderInfo: LeaveRenderInfo = {
            type: leave.type,
            user: userSchedule.user,
            icon: leaveTypeIcons[leaveType.icon],
            color: leaveTypeColors[leaveType.color],
          };

          // Generate all days in the leave request date range
          const startDate = new DayDate(leaveRequest.startDate);
          const endDate = new DayDate(leaveRequest.endDate);

          if (process.env.NODE_ENV === "development") {
            console.log("Processing leave date range:", {
              leaveType: leave.type,
              userName: userSchedule.user.name,
              startDate: startDate.toString(),
              endDate: endDate.toString(),
              calendarStartDay: calendarStartDay.toString(),
              calendarEndDay: calendarEndDay.toString(),
              isStartInRange:
                startDate.compareTo(calendarStartDay) >= 0 &&
                startDate.compareTo(calendarEndDay) <= 0,
              isEndInRange:
                endDate.compareTo(calendarStartDay) >= 0 &&
                endDate.compareTo(calendarEndDay) <= 0,
            });
          }

          let currentDate = startDate;
          let daysProcessed = 0;
          while (currentDate.isBeforeOrEqual(endDate)) {
            const dayKey = currentDate.toString();
            if (!result[dayKey]) {
              result[dayKey] = [];
            }

            // Check if this leave is already added for this day to avoid duplicates
            const existingLeave = result[dayKey].find(
              (existing) =>
                existing.user.pk === leaveRenderInfo.user.pk &&
                existing.type === leaveRenderInfo.type
            );

            if (!existingLeave) {
              result[dayKey].push(leaveRenderInfo);
              daysProcessed++;
            }

            currentDate = currentDate.nextDay();
          }

          if (process.env.NODE_ENV === "development") {
            console.log("Leave processing completed:", {
              leaveType: leave.type,
              userName: userSchedule.user.name,
              daysProcessed,
              totalDaysInRange:
                Math.floor(startDate.diffInMinutes(endDate) / (24 * 60)) + 1,
            });
          }
        });
      });

    if (process.env.NODE_ENV === "development") {
      console.log("Final leave schedule result:", {
        totalDaysWithLeaves: Object.keys(result).length,
        daysWithLeaves: Object.keys(result).sort(),
        totalLeaves: Object.values(result).flat().length,
      });
    }

    return result;
  }, [
    leaveTypesSettings,
    restrictToUsers,
    teamScheduleResult?.team.approvedSchedule,
  ]);

  return { leaveSchedule };
};
