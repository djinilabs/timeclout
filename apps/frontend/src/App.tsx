import { FC, useMemo, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider as UrqlProvider } from "urql";
import { SessionProvider } from "next-auth/react";
import { ErrorBoundary, init as initSentry, withProfiler } from "@sentry/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "./Routes";
import { createClient } from "./graphql/graphql-client";
import { Suspense } from "./components/stateless/Suspense";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { dynamicActivate } from "./i18n";
import { RequiresSession } from "./components/RequiresSession";
import { AnalyticsProvider } from "./AnalyticsProvider";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

if (SENTRY_DSN) {
  console.debug("initializing Sentry...");
  initSentry({
    dsn: SENTRY_DSN,
  });
  console.debug("Sentry initialized.");
}

const AppComponent: FC = () => {
  const client = useMemo(() => createClient(), []);
  const queryClient = useMemo(() => new QueryClient(), []);

  useEffect(() => {
    dynamicActivate("pt");
  }, []);

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
      <AnalyticsProvider>
        <I18nProvider i18n={i18n}>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <SessionProvider
                refetchWhenOffline={false}
                basePath="/api/v1/auth"
              >
                <UrqlProvider value={client}>
                  <RequiresSession>
                    <Suspense>
                      <AppRoutes />
                    </Suspense>
                  </RequiresSession>
                </UrqlProvider>
              </SessionProvider>
            </QueryClientProvider>
          </BrowserRouter>
        </I18nProvider>
      </AnalyticsProvider>
    </ErrorBoundary>
  );
};

export const App = withProfiler(AppComponent, {
  name: "tt3.app",
});
