import { FC, useMemo } from "react";
import { Provider as UrqlProvider } from "urql";
import { SessionProvider } from "next-auth/react";
import { ErrorBoundary } from "@sentry/react";
import { AppLayout } from "./AppLayout";
import { AppRoutes } from "./Routes";
import { createClient } from "./graphql/graphql-client";

export const App: FC = () => {
  const client = useMemo(() => createClient(), []);
  return (
    <ErrorBoundary
      fallback={({ error }) => (
        <div className="p-4">
          <h2 className="text-xl font-bold text-red-600">
            Something went wrong
          </h2>
          <pre className="mt-2 text-sm">{(error as Error).message}</pre>
        </div>
      )}
    >
      <SessionProvider refetchWhenOffline={false} basePath="/api/v1/auth">
        <UrqlProvider value={client}>
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        </UrqlProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
};
