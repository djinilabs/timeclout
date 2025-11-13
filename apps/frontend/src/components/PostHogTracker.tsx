import { usePostHog } from "posthog-js/react";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component that tracks route changes and identifies users in PostHog.
 * This component should be placed inside both BrowserRouter and PostHogProvider.
 */
export const PostHogTracker: React.FC = () => {
  const posthog = usePostHog();
  const { data: session } = useSession();
  const location = useLocation();
  const previousPathRef = useRef<string | null>(null);

  // Track route changes
  useEffect(() => {
    if (!posthog) {
      return;
    }

    const currentPath = location.pathname + location.search;

    // Only track if the path has actually changed
    if (previousPathRef.current !== currentPath) {
      // Track pageview event
      posthog.capture("$pageview", {
        $current_url: window.location.href,
        pathname: location.pathname,
        search: location.search,
      });

      previousPathRef.current = currentPath;
    }
  }, [location, posthog]);

  // Identify users when authenticated
  useEffect(() => {
    if (!posthog) {
      return;
    }

    if (session?.user) {
      // Identify the user with their ID and additional properties
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
      });
    } else {
      // Reset identification when user logs out
      posthog.reset();
    }
  }, [session, posthog]);

  // This component doesn't render anything
  return null;
};

