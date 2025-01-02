import { FC, useMemo } from "react";
import { Provider as UrqlProvider } from "urql";
import { AppLayout } from "./AppLayout";
import { AppRoutes } from "./Routes";
import { SessionProvider } from "next-auth/react";
import { createClient } from "./graphql/graphql-client";

export const App: FC = () => {
  const client = useMemo(() => createClient(), []);
  return (
    <SessionProvider refetchWhenOffline={false} basePath="/api/v1/auth">
      <UrqlProvider value={client}>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </UrqlProvider>
    </SessionProvider>
  );
};
