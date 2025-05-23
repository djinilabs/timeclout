import { type FC, type PropsWithChildren } from "react";
import { useSession } from "next-auth/react";
import Login from "./Login";
import { Loading } from "./particles/Loading";

export const RequiresSession: FC<PropsWithChildren> = ({ children }) => {
  const { status } = useSession({ required: false });
  if (status === "loading") {
    return <Loading />;
  }
  if (status === "unauthenticated") {
    return <Login />;
  }
  return children;
};
