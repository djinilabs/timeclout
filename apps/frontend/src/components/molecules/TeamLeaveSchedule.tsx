import { memo, useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { i18n } from "@lingui/core";
import { DayDate } from "@/day-date";
import { type User } from "../../graphql/graphql";
import { MemberSchedule } from "../types";
import { MonthlyCalendarPerMember } from "../atoms/MonthlyCalendarPerMember";
import { Day, MonthDailyCalendar } from "../particles/MonthDailyCalendar";
import { MemberLeaveInCalendar } from "../atoms/MemberLeaveInCalendar";
import { CalendarHeader } from "../atoms/CalendarHeader";
import { Button } from "../particles/Button";

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
                aria-label={i18n.t("Add leave request for {member} on {date}", {
                  member: member.name,
                  date: dayString,
                })}
              >
                <span className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600">+</span>
                </span>
              </Link>
            ) : null}

            {leave &&
              (leave.leaveRequest ? (
                <Link
                  to={`/${leave.leaveRequest.pk}/leave-requests/${
                    leave.leaveRequest.sk
                  }?callbackUrl=${encodeURIComponent(
                    window.location.pathname + window.location.search
                  )}`}
                  title={leave.leaveRequest.type}
                  className={`inline-flex items-center rounded-full px-2 py-2 ${
                    !leave.leaveRequest.approved && "opacity-50"
                  }`}
                  style={{
                    backgroundColor: leave.color,
                  }}
                  aria-label={i18n.t(
                    "{type} leave request for {member} on {date}",
                    {
                      type: leave.leaveRequest.type,
                      member: member.name,
                      date: dayString,
                    }
                  )}
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
                  aria-label={i18n.t("{type} leave for {member} on {date}", {
                    type: leave.type,
                    member: member.name,
                    date: dayString,
                  })}
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

    const additionalActions = useMemo(
      () => [
        {
          type: "button",
          text: i18n.t("Add leave"),
          onClick: () => {
            navigate(
              `/companies/${company}/units/${unit}/teams/${team}/leave-requests/new`
            );
          },
        } as const,
        {
          type: "component",
          component:
            view === "linear" ? (
              <Button
                onClick={() => setView("calendar")}
                aria-label={i18n.t("Switch to daily calendar view")}
              >
                {i18n.t("Switch to view per day")}
              </Button>
            ) : (
              <Button
                onClick={() => setView("linear")}
                aria-label={i18n.t("Switch to member list view")}
              >
                {i18n.t("Switch to view per member")}
              </Button>
            ),
        } as const,
      ],
      [company, navigate, team, unit, view]
    );

    return (
      <div
        role="region"
        aria-label={i18n.t("Team leave schedule for {month} {year}", {
          month,
          year,
        })}
      >
        <CalendarHeader
          year={year}
          month={month}
          goTo={goTo}
          additionalActions={additionalActions}
        />
        {view === "linear" ? (
          <MonthlyCalendarPerMember
            year={year}
            month={month}
            members={members}
            renderMemberDay={renderMemberDay}
          />
        ) : (
          <MonthDailyCalendar year={year} month={month} renderDay={renderDay} />
        )}
      </div>
    );
  }
);
