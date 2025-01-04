import { type FC, type PropsWithChildren } from "react";
import { useSession } from "next-auth/react";
export const RequiresSession: FC<PropsWithChildren> = ({ children }) => {
  const { status } = useSession();
  if (status === "unauthenticated") {
    window.location.href =
      "/api/v1/auth/signin?callbackUrl=" +
      encodeURIComponent(window.location.href);
    return null;
  }
  return <>{children}</>;
};
