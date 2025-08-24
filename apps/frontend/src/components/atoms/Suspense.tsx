import {
  FC,
  PropsWithChildren,
  memo,
  Suspense as ReactSuspense,
  ReactNode,
} from "react";

import { Loading } from "../particles/Loading";

export interface SuspenseProperties extends PropsWithChildren {
  fallback?: ReactNode;
}

export const Suspense: FC<SuspenseProperties> = memo(
  ({ fallback = <Loading />, children }) => (
    <ReactSuspense fallback={fallback}>{children}</ReactSuspense>
  )
);

Suspense.displayName = "Suspense";
