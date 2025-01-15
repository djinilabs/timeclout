import { FC, useState } from "react";
import { classNames } from "../utils/classNames";
import { Day, Month } from "../utils/generateYearMonthsDays";
import { type LeaveDay } from "./YearCalendar";
import { Popover } from "./Popover";
import { LeaveRequest } from "./LeaveRequest";

interface CalendarDayProps {
  day: Day;
  dayIdx: number;
  month: Month;
  isLeave: LeaveDay;
  isHovering: boolean;
  setHoveringDay: (day: string | null) => void;
}

export const CalendarDay: FC<CalendarDayProps> = ({
  day,
  dayIdx,
  month,
  isLeave,
  isHovering,
  setHoveringDay,
}) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const buttonClassName = classNames(
    day.isCurrentMonth ? "bg-white text-gray-900" : "bg-gray-50 text-gray-400",
    dayIdx === 0 ? "rounded-tl-lg" : "",
    dayIdx === 6 ? "rounded-tr-lg" : "",
    dayIdx === month.days.length - 7 ? "rounded-bl-lg" : "",
    dayIdx === month.days.length - 1 ? "rounded-br-lg" : "",
    "hover:bg-gray-100"
  );
  const element = (
    <button
      ref={setReferenceElement}
      key={day.date}
      type="button"
      className={classNames(buttonClassName, "py-1.5")}
      onMouseEnter={() =>
        isLeave && day.isCurrentMonth && setHoveringDay(day.date)
      }
      onMouseLeave={() => isLeave && day.isCurrentMonth && setHoveringDay(null)}
    >
      <time
        dateTime={day.date}
        className={classNames(
          day.isToday ? "bg-teal-600 font-semibold text-white" : "",
          "mx-auto flex size-7 items-center justify-center rounded-full"
        )}
        style={
          isLeave
            ? {
                backgroundColor: isLeave?.color,
              }
            : undefined
        }
      >
        {isLeave && !isHovering
          ? isLeave.icon
          : day.date.split("-").pop()?.replace(/^0/, "")}
      </time>
    </button>
  );
  if (isHovering && isLeave?.leaveRequest && day.isCurrentMonth) {
    return (
      <div
        key={day.date}
        className={classNames(buttonClassName, "bg-gray-100")}
      >
        {element}
        <Popover referenceElement={referenceElement} placement="bottom-start">
          <LeaveRequest {...isLeave.leaveRequest} />
        </Popover>
      </div>
    );
  }
  return element;
};
