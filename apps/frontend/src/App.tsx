import { FC, useMemo, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider as UrqlProvider } from "urql";
import { SessionProvider } from "next-auth/react";
import { ErrorBoundary, init as initSentry, withProfiler } from "@sentry/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "./Routes";
import { createClient as createGraphqlClient } from "./graphql/graphql-client";
import { Suspense } from "./components/atoms/Suspense";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { dynamicActivate } from "./i18n";
import { AnalyticsProvider } from "./AnalyticsProvider";
import { RequiresSession } from "./components/molecules/RequiresSession";
import { AppLocalSettingsProvider } from "./contexts/AppLocalSettingsContext";
import "./styles/print.css";
import { monitorActivityFetch } from "./utils/monitorActivityFetch";
import { FetchActivityProvider } from "./providers/FetchActivityProvider";
import { DragAndDropProvider } from "./providers/DragAndDropProvider";
import { Loading } from "./components/particles/Loading";
import { locales } from "./i18n";
import { LocaleProvider } from "./providers/LocaleProvider";
import { AgreementWrapper } from "./components/molecules/AgreementWrapper";

const SENTRY_DSN = process.env.VITE_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  console.debug("initializing Sentry...");
  initSentry({
    dsn: SENTRY_DSN,
  });
  console.debug("Sentry initialized.");
}

const saveLocale = (locale: string) => {
  localStorage.setItem("locale", locale);
};

const loadLocale = () => {
  const locale = localStorage.getItem("locale");
  if (locale) {
    return locale;
  }
  return null;
};

const detectLocale = () => {
  // first, try to load preference from localStorage
  const locale = loadLocale();
  if (locale) {
    return locale;
  }
  // then, try to load preference from browser
  for (const language of navigator.languages) {
    const localeStr = language.split("-")[0];
    if (Object.keys(locales).includes(localeStr)) {
      console.log("detected locale", localeStr);
      return localeStr;
    }
  }
  return null;
};

const detectOrDefaultLocale = () => {
  const locale = detectLocale();
  if (locale) {
    return locale;
  }
  return "en";
};

const AppComponent: FC = () => {
  // locale
  const [locale, setLocale] = useState<string>(detectOrDefaultLocale);
  const [isLocaleActivated, setIsLocaleActivated] = useState(false);

  // urql
  const monitorFetch = useMemo(() => monitorActivityFetch(), []);
  const graphqlClient = useMemo(
    () =>
      createGraphqlClient({
        fetch: monitorFetch.fetch,
        locale,
      }),
    [monitorFetch, locale]
  );
  const queryClient = useMemo(() => new QueryClient(), []);
  useEffect(() => {
    setIsLocaleActivated(false);
    dynamicActivate(locale).finally(() => {
      setIsLocaleActivated(true);
    });
  }, [locale]);

  const setLocaleAndSave = (locale: string) => {
    setLocale(locale);
    saveLocale(locale);
  };

  // render
  if (!isLocaleActivated) {
    return <Loading />;
  }

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
      <LocaleProvider locale={locale} setLocale={setLocaleAndSave}>
        <AnalyticsProvider>
          <I18nProvider i18n={i18n}>
            <BrowserRouter>
              <AppLocalSettingsProvider>
                <QueryClientProvider client={queryClient}>
                  <SessionProvider
                    refetchWhenOffline={false}
                    basePath="/api/v1/auth"
                  >
                    <UrqlProvider value={graphqlClient}>
                      <FetchActivityProvider monitorFetch={monitorFetch}>
                        <DragAndDropProvider>
                          <RequiresSession>
                            <AgreementWrapper>
                              <Suspense>
                                <AppRoutes />
                              </Suspense>
                            </AgreementWrapper>
                          </RequiresSession>
                        </DragAndDropProvider>
                      </FetchActivityProvider>
                    </UrqlProvider>
                  </SessionProvider>
                </QueryClientProvider>
              </AppLocalSettingsProvider>
            </BrowserRouter>
          </I18nProvider>
        </AnalyticsProvider>
      </LocaleProvider>
    </ErrorBoundary>
  );
};

export const App = withProfiler(AppComponent, {
  name: "tt3.app",
});
