import { FC } from "react";
import { AppLayout } from "./AppLayout";
import { AppRoutes } from "./Routes";
import { SessionProvider } from "next-auth/react";

export const App: FC = () => {
  return (
    <SessionProvider refetchWhenOffline={false} basePath="/api/v1/auth">
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </SessionProvider>
  );
};
