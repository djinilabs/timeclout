import { FC, useMemo } from "react";
import { Provider as UrqlProvider } from "urql";
import { SessionProvider } from "next-auth/react";
import { ErrorBoundary, init as initSentry, withProfiler } from "@sentry/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "./AppLayout";
import { AppRoutes } from "./Routes";
import { createClient } from "./graphql/graphql-client";
import { BrowserRouter } from "react-router-dom";
import { Suspense } from "./components/stateless/Suspense";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

if (SENTRY_DSN) {
  initSentry({
    dsn: SENTRY_DSN,
  });
}

const AppComponent: FC = () => {
  const client = useMemo(() => createClient(), []);
  const queryClient = useMemo(() => new QueryClient(), []);
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
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <SessionProvider refetchWhenOffline={false} basePath="/api/v1/auth">
            <UrqlProvider value={client}>
              <AppLayout>
                <Suspense>
                  <AppRoutes />
                </Suspense>
              </AppLayout>
            </UrqlProvider>
          </SessionProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export const App = withProfiler(AppComponent, {
  name: "tt3.app",
});
