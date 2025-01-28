import { FC } from "react";

export type Color =
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
  color: Color;
}

export interface BadgesProps {
  badges: Array<Badge>;
  onRemove: (badge: Badge) => void;
}

export interface BadgeRemoveButtonProps {
  onClick: () => void;
  color?: string;
}

export const Badges: FC<BadgesProps> = ({ badges, onRemove }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => {
        switch (badge.color) {
          case "gray":
            return (
              <span
                key={badge.name}
                className="inline-flex items-center gap-x-0.5 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
              >
                {badge.name}
                <button
                  type="button"
                  onClick={() => onRemove(badge)}
                  className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
                >
                  <span className="sr-only">Remove</span>
                  <svg
                    viewBox="0 0 14 14"
                    className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
                  >
                    <path d="M4 4l6 6m0-6l-6 6" />
                  </svg>
                  <span className="absolute -inset-1" />
                </button>
              </span>
            );
          case "red":
            return (
              <span
                key={badge.name}
                className="inline-flex items-center gap-x-0.5 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10"
              >
                {badge.name}
                <button
                  type="button"
                  onClick={() => onRemove(badge)}
                  className="group relative -mr-1 size-3.5 rounded-sm hover:bg-red-600/20"
                >
                  <span className="sr-only">Remove</span>
                  <svg
                    viewBox="0 0 14 14"
                    className="size-3.5 stroke-red-600/50 group-hover:stroke-red-600/75"
                  >
                    <path d="M4 4l6 6m0-6l-6 6" />
                  </svg>
                  <span className="absolute -inset-1" />
                </button>
              </span>
            );
          case "yellow":
            return (
              <span
                key={badge.name}
                className="inline-flex items-center gap-x-0.5 rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
              >
                {badge.name}
                <button
                  type="button"
                  onClick={() => onRemove(badge)}
                  className="group relative -mr-1 size-3.5 rounded-sm hover:bg-yellow-600/20"
                >
                  <span className="sr-only">Remove</span>
                  <svg
                    viewBox="0 0 14 14"
                    className="size-3.5 stroke-yellow-700/50 group-hover:stroke-yellow-700/75"
                  >
                    <path d="M4 4l6 6m0-6l-6 6" />
                  </svg>
                  <span className="absolute -inset-1" />
                </button>
              </span>
            );
          case "green":
            return (
              <span
                key={badge.name}
                className="inline-flex items-center gap-x-0.5 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
              >
                {badge.name}
                <button
                  type="button"
                  onClick={() => onRemove(badge)}
                  className="group relative -mr-1 size-3.5 rounded-sm hover:bg-green-600/20"
                >
                  <span className="sr-only">Remove</span>
                  <svg
                    viewBox="0 0 14 14"
                    className="size-3.5 stroke-green-700/50 group-hover:stroke-green-700/75"
                  >
                    <path d="M4 4l6 6m0-6l-6 6" />
                  </svg>
                  <span className="absolute -inset-1" />
                </button>
              </span>
            );
          case "blue":
            return (
              <span
                key={badge.name}
                className="inline-flex items-center gap-x-0.5 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
              >
                {badge.name}
                <button
                  type="button"
                  onClick={() => onRemove(badge)}
                  className="group relative -mr-1 size-3.5 rounded-sm hover:bg-blue-600/20"
                >
                  <span className="sr-only">Remove</span>
                  <svg
                    viewBox="0 0 14 14"
                    className="size-3.5 stroke-blue-700/50 group-hover:stroke-blue-700/75"
                  >
                    <path d="M4 4l6 6m0-6l-6 6" />
                  </svg>
                  <span className="absolute -inset-1" />
                </button>
              </span>
            );
          case "indigo":
            return (
              <span
                key={badge.name}
                className="inline-flex items-center gap-x-0.5 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
              >
                {badge.name}
                <button
                  type="button"
                  onClick={() => onRemove(badge)}
                  className="group relative -mr-1 size-3.5 rounded-sm hover:bg-indigo-600/20"
                >
                  <span className="sr-only">Remove</span>
                  <svg
                    viewBox="0 0 14 14"
                    className="size-3.5 stroke-indigo-600/50 group-hover:stroke-indigo-600/75"
                  >
                    <path d="M4 4l6 6m0-6l-6 6" />
                  </svg>
                  <span className="absolute -inset-1" />
                </button>
              </span>
            );
          case "purple":
            return (
              <span
                key={badge.name}
                className="inline-flex items-center gap-x-0.5 rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10"
              >
                {badge.name}
                <button
                  type="button"
                  onClick={() => onRemove(badge)}
                  className="group relative -mr-1 size-3.5 rounded-sm hover:bg-purple-600/20"
                >
                  <span className="sr-only">Remove</span>
                  <svg
                    viewBox="0 0 14 14"
                    className="size-3.5 stroke-violet-600/50 group-hover:stroke-violet-600/75"
                  >
                    <path d="M4 4l6 6m0-6l-6 6" />
                  </svg>
                  <span className="absolute -inset-1" />
                </button>
              </span>
            );
          case "pink":
            return (
              <span
                key={badge.name}
                className="inline-flex items-center gap-x-0.5 rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10"
              >
                {badge.name}
                <button
                  type="button"
                  onClick={() => onRemove(badge)}
                  className="group relative -mr-1 size-3.5 rounded-sm hover:bg-pink-600/20"
                >
                  <span className="sr-only">Remove</span>
                  <svg
                    viewBox="0 0 14 14"
                    className="size-3.5 stroke-pink-700/50 group-hover:stroke-pink-700/75"
                  >
                    <path d="M4 4l6 6m0-6l-6 6" />
                  </svg>
                  <span className="absolute -inset-1" />
                </button>
              </span>
            );
        }
      })}
    </div>
  );
};
