import { FC } from "react";

export interface Badge {
  name: string;
  color: string;
}

export interface BadgesProps {
  badges: Array<Badge>;
  onRemove: (badge: Badge) => void;
}

export interface BadgeRemoveButtonProps {
  onClick: () => void;
  color?: string;
}

export const BadgeRemoveButton: FC<BadgeRemoveButtonProps> = ({
  onClick,
  color,
}) => {
  return (
    <button
      type="button"
      className={`group relative -mr-1 size-3.5 rounded-sm hover:bg-${color}/20`}
      onClick={onClick}
    >
      <span className="sr-only">Remove</span>
      <svg
        viewBox="0 0 14 14"
        className={`size-3.5 stroke-${color}/50 group-hover:stroke-${color}/75`}
      >
        <path d="M4 4l6 6m0-6l-6 6" />
      </svg>
    </button>
  );
};

export const Badges: FC<BadgesProps> = ({ badges, onRemove }) => {
  return (
    <div className="flex gap-2">
      {badges.map((badge) => (
        <span
          key={badge.name}
          className={`inline-flex items-center gap-x-0.5 rounded-md bg-${badge.color} px-2 py-1 text-xs font-medium text-${badge.color} ring-1 ring-inset ring-${badge.color}/10`}
        >
          {badge.name}
          <BadgeRemoveButton
            onClick={() => onRemove(badge)}
            color={badge.color}
          />
        </span>
      ))}
    </div>
  );
};
