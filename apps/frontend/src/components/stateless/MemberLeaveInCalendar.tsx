import { forwardRef } from "react";
import { Avatar } from "../particles/Avatar";
import { User, type LeaveDay } from "./TeamLeaveSchedule";

export interface MemberLeaveInCalendarProps {
  member: User;
  leave: LeaveDay;
  leaveIndex: number;
  showName?: boolean;
  showAvatar?: boolean;
}

export const MemberLeaveInCalendar = forwardRef(
  ({
    member,
    leave,
    leaveIndex,
    showName = true,
    showAvatar = true,
  }: MemberLeaveInCalendarProps) => {
    return (
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
        {showAvatar && (
          <div
            key={`leave-avatar-container-${leaveIndex}`}
            className="flex items-center -ml-2"
          >
            <Avatar size={25} {...member} />
          </div>
        )}
        {showName && (
          <div
            key={`leave-name-${leaveIndex}`}
            className="text-tiny truncate text-gray-400"
          >
            {member.name}
          </div>
        )}
      </div>
    );
  }
);
