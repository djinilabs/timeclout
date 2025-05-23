import { type FC, type PropsWithChildren } from "react";
import { useSession } from "next-auth/react";
import Login from "./Login";

export const RequiresSession: FC<PropsWithChildren> = ({ children }) => {
  const { status } = useSession();
  if (status === "unauthenticated") {
    return <Login />;
  }
  return children;
};
