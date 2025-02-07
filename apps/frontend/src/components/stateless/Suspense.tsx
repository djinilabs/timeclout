import { FC, PropsWithChildren, Suspense as ReactSuspense } from "react";
import { Loading } from "./Loading";

export const Suspense: FC<PropsWithChildren> = ({ children }) => (
  <ReactSuspense fallback={<Loading />}>{children}</ReactSuspense>
);
