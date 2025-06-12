import { forwardRef } from "react";
import { Avatar } from "../particles/Avatar";
import { type PartialUser, type LeaveDay } from "../types";
import { Hint } from "../particles/Hint";
import { i18n } from "@lingui/core";

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
      <Hint
        hint={i18n.t("{type} leave for {member}", {
          type: leave.type,
          member: member.name,
        })}
      >
        <div className="flex items-center justify-start gap-1">
          {showAvatar && (
            <div
              key={`leave-avatar-container-${leaveIndex}`}
              className="flex items-center justify-center"
            >
              <Avatar size={25} {...member} />
            </div>
          )}
          <div
            className="text-sm flex -mt-2 -ml-2"
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
