import { memo, ReactNode, useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MonthlyCalendarPerMember } from "./MonthlyCalendarPerMember";
import { DayDate } from "@/day-date";
import { Day, MonthDailyCalendar } from "./MonthDailyCalendar";
import { MemberLeaveInCalendar } from "./MemberLeaveInCalendar";

export interface User {
  pk: string;
  name: string;
  email?: string | null;
  emailMd5?: string | null;
}

export interface LeaveRequest {
  startDate: string;
  endDate: string;
  type: string;
  approved?: boolean | null;
  reason?: string | null;
  createdAt: string;
  createdBy: User;
  approvedBy?: User[] | null;
  approvedAt?: string[] | null;
  beneficiary: User;
  pk: string;
  sk: string;
}
export interface LeaveDay {
  type: string;
  icon?: ReactNode;
  color?: string;
  leaveRequest?: LeaveRequest;
}

export interface MemberSchedule {
  user: User;
  leaves: Record<string, LeaveDay>;
}

export interface TeamLeaveScheduleProps {
  year: number;
  month: number;
  goTo: (year: number, month: number) => void;
  schedule?: MemberSchedule[];
}

export const TeamLeaveSchedule = memo(
  ({ year, month, goTo, schedule = [] }: TeamLeaveScheduleProps) => {
    const { company, unit, team } = useParams();
    const navigate = useNavigate();
    const [view, setView] = useState<"calendar" | "linear">("linear");
    const leavesPerMember = useMemo(
      () =>
        Object.fromEntries(
          schedule?.map((memberSchedule) => [
            memberSchedule.user.pk,
            memberSchedule,
          ])
        ),
      [schedule]
    );

    const leavesPerDay: Record<string, MemberSchedule[]> = useMemo(() => {
      const leavesPerDay: Record<string, MemberSchedule[]> = {};
      schedule.forEach((memberSchedule) => {
        Object.keys(memberSchedule.leaves).forEach((day) => {
          leavesPerDay[day] = [...(leavesPerDay[day] || []), memberSchedule];
        });
      });
      return leavesPerDay;
    }, [schedule]);

    const members = useMemo(
      () =>
        Object.values(leavesPerMember).map(
          (memberSchedule) => memberSchedule.user
        ),
      [leavesPerMember]
    );

    const renderMemberDay = useCallback(
      (member: User, day: DayDate) => {
        const dayString = day.toString();
        const leave = leavesPerMember[member.pk]?.leaves[dayString];
        return (
          <>
            {!leave?.leaveRequest ? (
              <Link
                to={`/companies/${company}/units/${unit}/teams/${team}/leave-requests/new?date=${dayString}&user=${encodeURIComponent(
                  member.pk
                )}`}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600">+</span>
                </span>
              </Link>
            ) : null}

            {leave &&
              (leave.leaveRequest ? (
                <Link
                  to={`/${leave.leaveRequest.pk}/leave-requests/${leave.leaveRequest.sk}?callbackUrl=${encodeURIComponent(
                    window.location.pathname + window.location.search
                  )}`}
                  title={leave.leaveRequest.type}
                  className={`inline-flex items-center rounded-full px-2 py-2 ${
                    !leave.leaveRequest.approved && "opacity-50"
                  }`}
                  style={{
                    backgroundColor: leave.color,
                  }}
                >
                  {leave.icon}
                </Link>
              ) : (
                <span
                  title={leave.type}
                  className="inline-flex items-center rounded-full px-2 py-2"
                  style={{
                    backgroundColor: leave.color,
                  }}
                >
                  {leave.icon}
                </span>
              ))}
          </>
        );
      },
      [leavesPerMember, company, unit, team]
    );

    const renderDay = useCallback(
      (day: Day) => {
        const membersWithLeave = leavesPerDay[day.date];
        if (!membersWithLeave) return null;
        return membersWithLeave.map((memberLeaves, index) => {
          return (
            <MemberLeaveInCalendar
              key={memberLeaves.user.pk}
              member={memberLeaves.user}
              leave={memberLeaves.leaves[day.date]}
              leaveIndex={index}
            />
          );
        });
      },
      [leavesPerDay]
    );

    return view === "linear" ? (
      <MonthlyCalendarPerMember
        year={year}
        month={month}
        goTo={goTo}
        onSwitchView={setView}
        onAdd={() => {
          navigate(
            `/companies/${company}/units/${unit}/teams/${team}/leave-requests/new`
          );
        }}
        members={members}
        renderMemberDay={renderMemberDay}
      />
    ) : (
      <MonthDailyCalendar year={year} month={month} renderDay={renderDay} />
    );
  }
);
