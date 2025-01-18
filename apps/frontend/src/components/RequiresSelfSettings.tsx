import { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import meQuery from "@/graphql-client/queries/me.graphql";
import { useQuery } from "../hooks/useQuery";
import { Query, User } from "../graphql/graphql";

const isSelfSettingsComplete = (me: User) => {
  return me?.name && me?.email !== me.name;
};

export const RequiresSelfSettings: FC<PropsWithChildren> = ({ children }) => {
  const [result] = useQuery<{ me: Query["me"] }>({ query: meQuery });
  const me = result?.data?.me;
  if (!result.fetching && (!me || !isSelfSettingsComplete(me))) {
    return <Navigate to="/me/edit" />;
  }
  return <>{children}</>;
};
