import { FC, memo } from "react";

import { Badge } from "../particles/Badge";

import { type ColorName } from "@/settings";

export interface Badge {
  name: string;
  color: ColorName;
}

export interface BadgesProps {
  badges: Array<Badge>;
  onRemove?: (badge: Badge) => void;
}

export interface BadgeRemoveButtonProps {
  onClick: () => void;
  color?: string;
}

export const Badges: FC<BadgesProps> = memo(({ badges, onRemove }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => {
        return (
          <Badge
            key={badge.name}
            {...badge}
            onRemove={onRemove && (() => onRemove(badge))}
          />
        );
      })}
    </div>
  );

  Badges.displayName = "Badges";
});
