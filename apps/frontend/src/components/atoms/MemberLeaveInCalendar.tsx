import { FC, memo } from "react";
import { i18n } from "@lingui/core";
import { type PartialUser, type LeaveDay } from "../types";
import { Avatar } from "../particles/Avatar";
import { Hint } from "../particles/Hint";

export interface MemberLeaveInCalendarProps {
  member: PartialUser;
  leave: LeaveDay;
  leaveIndex: number;
  showName?: boolean;
  showAvatar?: boolean;
}

export const MemberLeaveInCalendar: FC<MemberLeaveInCalendarProps> = memo(
  ({ member, leave, leaveIndex, showName = true, showAvatar = true }) => {
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
