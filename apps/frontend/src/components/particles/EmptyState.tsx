import {
  BuildingOfficeIcon,
  CalendarDaysIcon,
  DocumentDuplicateIcon,
  EnvelopeIcon,
  UsersIcon,
  Squares2X2Icon,
  ClockIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { Trans } from "@lingui/react/macro";
import { FC, ReactNode } from "react";

import { Button } from "./Button";

export type EmptyStateIcon =
  | "building"
  | "calendar"
  | "document"
  | "envelope"
  | "users"
  | "grid"
  | "clock"
  | "inbox"
  | "custom";

export interface EmptyStateProps {
  icon?: EmptyStateIcon | ReactNode;
  title: string | ReactNode;
  description?: string | ReactNode;
  action?: {
    label: string | ReactNode;
    onClick?: () => void;
    to?: string;
    variant?: "primary" | "secondary" | "ghost" | "danger";
  };
  secondaryAction?: {
    label: string | ReactNode;
    onClick?: () => void;
    to?: string;
  };
  className?: string;
}

const iconMap = {
  building: BuildingOfficeIcon,
  calendar: CalendarDaysIcon,
  document: DocumentDuplicateIcon,
  envelope: EnvelopeIcon,
  users: UsersIcon,
  grid: Squares2X2Icon,
  clock: ClockIcon,
  inbox: InboxIcon,
};

export const EmptyState: FC<EmptyStateProps> = ({
  icon = "inbox",
  title,
  description,
  action,
  secondaryAction,
  className = "",
}) => {
  const IconComponent =
    typeof icon === "string" && icon !== "custom" ? iconMap[icon] : null;
  const isCustomIcon = icon !== "custom" && typeof icon !== "string";

  return (
    <div
      className={`py-12 px-4 text-center sm:px-6 lg:px-8 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto max-w-md">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          {isCustomIcon && icon}
          {IconComponent && (
            <IconComponent
              className="h-8 w-8 text-gray-400"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Title */}
        <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>

        {/* Description */}
        {description && (
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        )}

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {action && (
              <Button
                onClick={action.onClick}
                to={action.to}
                variant={action.variant || "primary"}
                aria-label={
                  typeof action.label === "string"
                    ? action.label
                    : "Primary action"
                }
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                to={secondaryAction.to}
                variant="secondary"
                aria-label={
                  typeof secondaryAction.label === "string"
                    ? secondaryAction.label
                    : "Secondary action"
                }
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

