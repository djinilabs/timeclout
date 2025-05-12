import { classNames } from "../../utils/classNames";
import { Avatar } from "./Avatar";
import { User, type LeaveDay } from "./TeamLeaveSchedule";

export interface MemberLeaveInCalendarProps {
  member: User;
  leave: LeaveDay;
  leaveIndex: number;
  leaveRowCount: number;
}

export const MemberLeaveInCalendar = ({
  member,
  leave,
  leaveIndex,
  leaveRowCount,
}: MemberLeaveInCalendarProps) => {
  return (
    <div
      className={classNames(
        "p-2 border-gray-100 row-span-2 bg-gray-50 transition duration-300 ease-in data-[closed]:opacity-0",
        leaveIndex === 0 && "border-t",
        leaveIndex === leaveRowCount - 1 && "border-b"
      )}
    >
      <div className="flex items-center gap-1">
        <div
          key={`leave-icon-container-${leaveIndex}`}
          className="text-sm flex items-center"
        >
          <div
            key={`leave-icon-${leaveIndex}`}
            className="text-sm rounded-full p-1 bg-white"
            style={{
              backgroundColor: leave.color,
            }}
            title={leave.type}
          >
            {leave.icon}
          </div>
        </div>
        <div
          key={`leave-avatar-container-${leaveIndex}`}
          className="flex items-center -ml-2"
        >
          <Avatar size={25} {...member} />
        </div>
        <div
          key={`leave-name-${leaveIndex}`}
          className="text-tiny truncate text-gray-400"
        >
          {member.name}
        </div>
      </div>
    </div>
  );
};
