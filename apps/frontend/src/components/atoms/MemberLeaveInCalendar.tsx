import { forwardRef } from "react";
import { Avatar } from "../particles/Avatar";
import { type PartialUser, type LeaveDay } from "../types";
import { Hint } from "../particles/Hint";

export interface MemberLeaveInCalendarProps {
  member: PartialUser;
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
      <Hint hint={leave.type}>
        <div
          className="flex items-center justify-center gap-1"
          style={{
            marginTop: `${leaveIndex * 1.5}rem`,
          }}
        >
          <div
            className="text-sm flex -mt-2"
            key={`leave-icon-container-${leaveIndex}`}
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
              className="flex items-center justify-center -ml-2"
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
      </Hint>
    );
  }
);
