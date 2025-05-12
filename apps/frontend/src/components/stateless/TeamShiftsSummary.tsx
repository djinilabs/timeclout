import { FC, useMemo } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { ShiftPositionWithRowSpan } from "../../hooks/useTeamShiftPositionsMap";
import { toMinutes } from "../../utils/toMinutes";
import { Trans } from "@lingui/react/macro";
import { Avatar } from "./Avatar";

export interface TeamShiftsSummaryProps {
  year: number;
  month: number;
  goTo: (year: number, month: number) => void;
  shiftPositionsMap: Record<string, ShiftPositionWithRowSpan[]>;
}

interface Summary {
  shiftsPerDayPerLength: Record<
    string,
    Record<number, ShiftPositionWithRowSpan[]>
  >;
}

export const TeamShiftsSummary: FC<TeamShiftsSummaryProps> = ({
  year,
  month,
  goTo,
  shiftPositionsMap: shiftsPerDay,
}) => {
  const summary: Summary = useMemo(() => {
    // here we need to group the shifts by day, and then organize them
    // into columns based on the shift length (in hours)

    const shiftsPerDayPerLength: Record<
      string,
      Record<number, ShiftPositionWithRowSpan[]>
    > = {};

    for (const [day, dayShifts] of Object.entries(shiftsPerDay)) {
      const shiftLengths: Record<number, ShiftPositionWithRowSpan[]> = {};
      for (const shift of dayShifts) {
        if (shift.schedules.length === 0) {
          continue;
        }
        const shiftLengthInMinutes =
          toMinutes(
            shift.schedules[shift.schedules.length - 1].endHourMinutes as [
              number,
              number,
            ]
          ) -
          toMinutes(shift.schedules[0].startHourMinutes as [number, number]);
        const shiftLengthInHours = shiftLengthInMinutes / 60;
        if (!shiftLengths[shiftLengthInHours]) {
          shiftLengths[shiftLengthInHours] = [];
        }
        shiftLengths[shiftLengthInHours].push(shift);
      }
      shiftsPerDayPerLength[day] = shiftLengths;
    }

    return { shiftsPerDayPerLength };
  }, [shiftsPerDay]);

  const { lengths, lengthsMaxPopulation } = useMemo(() => {
    const lengths: number[] = [];
    const lengthsMaxPopulation: Record<number, number> = {};
    for (const day of Object.keys(summary.shiftsPerDayPerLength)) {
      const dayShiftsPerLength = summary.shiftsPerDayPerLength[day];
      const dayLengthsMaxPopulation: Record<number, number> = {};
      for (const lengthAsString of Object.keys(dayShiftsPerLength)) {
        const length = Number(lengthAsString);
        if (!lengths.includes(length)) {
          lengths.push(length);
        }
        dayLengthsMaxPopulation[length] = dayShiftsPerLength[length].length;
        lengthsMaxPopulation[length] = Math.max(
          lengthsMaxPopulation[length] || 0,
          dayLengthsMaxPopulation[length]
        );
      }
    }
    return { lengths, lengthsMaxPopulation };
  }, [summary]);

  const monthDays = useMemo(
    () =>
      Array.from(
        { length: new Date(year, month + 1, 0).getDate() },
        (_, i) => i + 1
      ).map((dayofTheMonth) => dayofTheMonth.toString()),
    [year, month]
  );

  return (
    <div>
      <CalendarHeader year={year} month={month} goTo={goTo} />
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
              <Trans>Day</Trans>
            </th>
            {lengths.map((length) => (
              <th
                colSpan={lengthsMaxPopulation[length]}
                key={length}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200"
              >
                <Trans>{length}h</Trans>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {monthDays.map((dayOfTheMonth) => {
            const day = `${year}-${(month + 1).toString().padStart(2, "0")}-${dayOfTheMonth.toString().padStart(2, "0")}`;
            const dayShiftsPerLength = summary.shiftsPerDayPerLength[day];
            return (
              <tr key={day} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">
                  {dayOfTheMonth}
                </td>
                {dayShiftsPerLength ? (
                  lengths.flatMap((length) => {
                    const shifts = dayShiftsPerLength[length];
                    if (!shifts) {
                      return (
                        <td
                          colSpan={lengthsMaxPopulation[length]}
                          className="border border-gray-200"
                        ></td>
                      );
                    }
                    return shifts.map((shift) => (
                      <td
                        key={[shift.pk, shift.sk].join("/")}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200"
                      >
                        <div className="flex flex-row items-center gap-2">
                          <Avatar size={40} {...shift.assignedTo} />
                          <span className="flex flex-col text-sm font-medium text-gray-900">
                            {shift.assignedTo?.name}
                            <span className="text-xs text-gray-400">
                              {shift.name}
                            </span>
                          </span>
                        </div>
                      </td>
                    ));
                  })
                ) : (
                  <td
                    colSpan={lengths.reduce(
                      (acc, length) => acc + lengthsMaxPopulation[length],
                      0
                    )}
                    className="border border-gray-200"
                  ></td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
