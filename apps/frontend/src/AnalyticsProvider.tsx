import { PostHogProvider } from "posthog-js/react";
import { FC, PropsWithChildren } from "react";

const postHogOptions = {
  // Default to EU endpoint, can be overridden via VITE_PUBLIC_POSTHOG_HOST env var
  api_host:
    import.meta.env.VITE_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
  // Enable autocapture for automatic UI interaction tracking
  // This automatically captures button clicks, form submissions, link clicks,
  // text inputs, and other DOM interactions
  autocapture: true,
  // Disable automatic pageview capture - manual pageview tracking is handled by the PostHogTracker component for better control
  capture_pageview: false,
  // Enable page leave tracking
  capture_pageleave: true,
};

export const AnalyticsProvider: FC<PropsWithChildren> = ({ children }) => {
  const key = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
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
