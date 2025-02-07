import { FC, PropsWithChildren, memo, Suspense as ReactSuspense } from "react";
import { Loading } from "./Loading";

export const Suspense: FC<PropsWithChildren> = memo(({ children }) => (
  <ReactSuspense fallback={<Loading />}>{children}</ReactSuspense>
));
