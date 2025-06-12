import {
  FC,
  PropsWithChildren,
  memo,
  Suspense as ReactSuspense,
  ReactNode,
} from "react";
import { Loading } from "../particles/Loading";

export interface SuspenseProps extends PropsWithChildren {
  fallback?: ReactNode;
}

export const Suspense: FC<SuspenseProps> = memo(
  ({ fallback = <Loading />, children }) => (
    <ReactSuspense fallback={fallback}>{children}</ReactSuspense>
  )
);
