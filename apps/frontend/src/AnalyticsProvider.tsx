import { FC, PropsWithChildren } from "react";
import { PostHogProvider } from "posthog-js/react";

const postHogOptions = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
};

export const AnalyticsProvider: FC<PropsWithChildren> = ({ children }) => {
  const key = process.env.VITE_PUBLIC_POSTHOG_KEY;
  if (!key) {
    return children;
  }
  console.log("Using posthog provider");
  return (
    <PostHogProvider apiKey={key} options={postHogOptions}>
      {children}
    </PostHogProvider>
  );
};
