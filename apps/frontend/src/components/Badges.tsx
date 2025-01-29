import { FC } from "react";
import { Badge } from "./Badge";

export type BadgeColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "indigo"
  | "gray"
  | "pink";

export interface Badge {
  name: string;
  color: BadgeColor;
}

export interface BadgesProps {
  badges: Array<Badge>;
  onRemove?: (badge: Badge) => void;
}

export interface BadgeRemoveButtonProps {
  onClick: () => void;
  color?: string;
}

export const Badges: FC<BadgesProps> = ({ badges, onRemove }) => {
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
};
