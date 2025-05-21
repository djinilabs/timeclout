import { FC, memo } from "react";
import { Trans } from "@lingui/react/macro";
import { Avatar } from "./Avatar";
import { DayDate } from "@/day-date";

export interface User {
  pk: string;
  name: string;
  email?: string | null;
  emailMd5?: string | null;
}

export interface MonthlyScheduleProps {
  year: number;
  month: number;
  members: User[];
  renderMemberDay: (
    member: User,
    day: DayDate,
    calIndex: number
  ) => React.ReactNode;
}

export const MonthlyCalendarPerMember: FC<MonthlyScheduleProps> = memo(
  (props) => {
    const { year, month, members, renderMemberDay } = props;
    return (
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <div className="flex-1 relative">
          <div className="absolute inset-0 overflow-auto">
            <table className="min-w-full divide-y  divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="bg-white sticky top-0 left-0 z-20 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 border-r border-t border-gray-300 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]"
                  >
                    <Trans>Name</Trans>
                  </th>
                  {Array.from(
                    { length: new Date(year, month + 1, 0).getDate() },
                    (_, i) => i + 1
                  ).map((day) => (
                    <th
                      key={day}
                      scope="col"
                      className="bg-white sticky top-0 z-20 px-1 py-3.5 text-center text-sm font-semibold text-gray-900 border-r border-t border-gray-300 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members?.map((member) => (
                  <tr key={member.pk}>
                    <th className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 flex items-center gap-2 border-r border-gray-300 sticky left-0 bg-white z-10">
                      <Avatar {...member} size={30} />
                      <span className="text-sm font-medium text-gray-600">
                        {member.name}
                      </span>
                    </th>
                    {Array.from(
                      { length: new Date(year, month + 1, 0).getDate() },
                      (_, i) => i + 1
                    ).map((dayofTheMonth, dayIndex) => {
                      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayofTheMonth).padStart(2, "0")}`;
                      const dayDate = new DayDate(date);

                      return (
                        <td
                          key={date}
                          className={`whitespace-nowrap text-sm text-center border-r border-gray-100 relative group ${
                            dayDate.isWeekend() ? "bg-gray-50" : ""
                          }`}
                        >
                          <span className="absolute top-1 right-1 text-gray-300 text-xs">
                            {dayofTheMonth}
                          </span>

                          {renderMemberDay(member, dayDate, dayIndex)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
);
