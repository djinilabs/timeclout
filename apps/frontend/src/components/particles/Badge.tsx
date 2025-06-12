import { FC, memo } from "react";
import { type ColorName } from "@/settings";

export interface BadgeProps {
  name: string;
  color: ColorName;
  onRemove?: () => void;
}

export const Badge: FC<BadgeProps> = memo(({ name, color, onRemove }) => {
  switch (color) {
    case "gray":
      return (
        <span
          key={name}
          className="inline-flex items-center gap-x-0.5 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
          role="status"
          aria-label={`Badge: ${name}`}
        >
          {name}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove()}
              className="group relative -mr-1 size-3.5 rounded-xs hover:bg-gray-500/20"
              aria-label={`Remove ${name} badge`}
              aria-clickable
              role="button"
            >
              <span className="sr-only">Remove</span>
              <svg
                viewBox="0 0 14 14"
                className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
                aria-hidden="true"
              >
                <path d="M4 4l6 6m0-6l-6 6" />
              </svg>
              <span className="absolute -inset-1" />
            </button>
          )}
        </span>
      );
    case "red":
      return (
        <span
          key={name}
          className="inline-flex items-center gap-x-0.5 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10"
          role="status"
          aria-label={`Badge: ${name}`}
        >
          {name}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove()}
              className="group relative -mr-1 size-3.5 rounded-xs hover:bg-red-600/20"
              aria-label={`Remove ${name} badge`}
              aria-clickable
              role="button"
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
          )}
        </span>
      );
    case "yellow":
      return (
        <span
          key={name}
          className="inline-flex items-center gap-x-0.5 rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
          role="status"
          aria-label={`Badge: ${name}`}
        >
          {name}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove()}
              className="group relative -mr-1 size-3.5 rounded-xs hover:bg-yellow-600/20"
              aria-label={`Remove ${name} badge`}
              aria-clickable
              role="button"
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
          )}
        </span>
      );
    case "green":
      return (
        <span
          key={name}
          className="inline-flex items-center gap-x-0.5 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
          role="status"
          aria-label={`Badge: ${name}`}
        >
          {name}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove()}
              className="group relative -mr-1 size-3.5 rounded-xs hover:bg-green-600/20"
              aria-label={`Remove ${name} badge`}
              aria-clickable
              role="button"
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
          )}
        </span>
      );
    case "blue":
      return (
        <span
          key={name}
          className="inline-flex items-center gap-x-0.5 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
          role="status"
          aria-label={`Badge: ${name}`}
        >
          {name}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove()}
              className="group relative -mr-1 size-3.5 rounded-xs hover:bg-blue-600/20"
              aria-label={`Remove ${name} badge`}
              aria-clickable
              role="button"
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
          )}
        </span>
      );
    case "indigo":
      return (
        <span
          key={name}
          className="inline-flex items-center gap-x-0.5 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
          role="status"
          aria-label={`Badge: ${name}`}
        >
          {name}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove()}
              className="group relative -mr-1 size-3.5 rounded-xs hover:bg-indigo-600/20"
              aria-label={`Remove ${name} badge`}
              aria-clickable
              role="button"
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
          )}
        </span>
      );
    case "purple":
      return (
        <span
          key={name}
          className="inline-flex items-center gap-x-0.5 rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10"
          role="status"
          aria-label={`Badge: ${name}`}
        >
          {name}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove()}
              className="group relative -mr-1 size-3.5 rounded-xs hover:bg-purple-600/20"
              aria-label={`Remove ${name} badge`}
              aria-clickable
              role="button"
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
          )}
        </span>
      );
    case "pink":
      return (
        <span
          key={name}
          className="inline-flex items-center gap-x-0.5 rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10"
          role="status"
          aria-label={`Badge: ${name}`}
        >
          {name}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove()}
              className="group relative -mr-1 size-3.5 rounded-xs hover:bg-pink-600/20"
              aria-label={`Remove ${name} badge`}
              aria-clickable
              role="button"
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
          )}
        </span>
      );
    case "orange":
      return (
        <span
          key={name}
          className="inline-flex items-center gap-x-0.5 rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-700/10"
          role="status"
          aria-label={`Badge: ${name}`}
        >
          {name}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove()}
              className="group relative -mr-1 size-3.5 rounded-xs hover:bg-orange-600/20"
              aria-label={`Remove ${name} badge`}
              aria-clickable
              role="button"
            >
              <span className="sr-only">Remove</span>
              <svg
                viewBox="0 0 14 14"
                className="size-3.5 stroke-orange-700/50 group-hover:stroke-orange-700/75"
              >
                <path d="M4 4l6 6m0-6l-6 6" />
              </svg>
              <span className="absolute -inset-1" />
            </button>
          )}
        </span>
      );
    case "teal":
      return (
        <span
          key={name}
          className="inline-flex items-center gap-x-0.5 rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-700/10"
          role="status"
          aria-label={`Badge: ${name}`}
        >
          {name}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove()}
              className="group relative -mr-1 size-3.5 rounded-xs hover:bg-teal-600/20"
              aria-label={`Remove ${name} badge`}
              aria-clickable
              role="button"
            >
              <span className="sr-only">Remove</span>
              <svg
                viewBox="0 0 14 14"
                className="size-3.5 stroke-teal-700/50 group-hover:stroke-teal-700/75"
              >
                <path d="M4 4l6 6m0-6l-6 6" />
              </svg>
              <span className="absolute -inset-1" />
            </button>
          )}
        </span>
      );
    case "lime":
      return (
        <span
          key={name}
          className="inline-flex items-center gap-x-0.5 rounded-md bg-lime-50 px-2 py-1 text-xs font-medium text-lime-700 ring-1 ring-inset ring-lime-700/10"
          role="status"
          aria-label={`Badge: ${name}`}
        >
          {name}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove()}
              className="group relative -mr-1 size-3.5 rounded-xs hover:bg-lime-600/20"
              aria-label={`Remove ${name} badge`}
              aria-clickable
              role="button"
            >
              <span className="sr-only">Remove</span>
              <svg
                viewBox="0 0 14 14"
                className="size-3.5 stroke-lime-700/50 group-hover:stroke-lime-700/75"
              >
                <path d="M4 4l6 6m0-6l-6 6" />
              </svg>
              <span className="absolute -inset-1" />
            </button>
          )}
        </span>
      );
    default:
      return null;
  }
});
