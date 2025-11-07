import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { memo, type FC, type PropsWithChildren, type ReactNode } from "react";

export type AttentionProps = PropsWithChildren<{
  title: ReactNode;
}>;

export const Attention: FC<AttentionProps> = memo(({ children, title }) => {
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
});

Attention.displayName = "Attention";
