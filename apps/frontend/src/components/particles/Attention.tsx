import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import type { FC, PropsWithChildren, ReactNode } from "react";

export interface AttentionProps {
  title: ReactNode;
}

export const Attention: FC<PropsWithChildren<AttentionProps>> = ({
  children,
  title,
}) => {
  return (
    <div className="rounded-md bg-yellow-50 p-4">
      <div className="flex">
        <div className="shrink-0">
          <ExclamationTriangleIcon
            aria-hidden="true"
            className="size-5 text-yellow-400"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">{title}</h3>
          <div className="mt-2 text-sm text-yellow-700">{children}</div>
        </div>
      </div>
    </div>
  );
};
