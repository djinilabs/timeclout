import { useSession } from "next-auth/react";
import { usePostHog } from "posthog-js/react";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hashes a string using SHA-256 and returns the hex representation.
 * Used to create pseudonymous user identifiers without sending PII.
 * Falls back to a simple hash if Web Crypto API is not available (very old browsers).
 */
const hashUserId = async (userId: string): Promise<string> => {
  // Check if Web Crypto API is available (requires secure context: HTTPS or localhost)
  if (typeof crypto !== "undefined" && crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(userId);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (error) {
      console.warn("Web Crypto API failed, using fallback hash:", error);
    }
  }

  // Fallback for unsupported browsers: simple hash function
  // This is not cryptographically secure but provides basic pseudonymization
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Convert to positive hex string
  return Math.abs(hash).toString(16).padStart(8, "0");
};

/**
 * Component that tracks route changes and identifies users in PostHog.
 * This component should be placed inside both BrowserRouter and PostHogProvider.
 */
export const PostHogTracker: React.FC = () => {
  const posthog = usePostHog();
  const { data: session } = useSession();
  const location = useLocation();
  const previousPathRef = useRef<string | null>(null);
  const hashedUserIdRef = useRef<{ userId: string; hash: string } | null>(null);

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

  // Identify users when authenticated using only a hashed ID (no PII)
  useEffect(() => {
    if (!posthog) {
      return;
    }

    if (session?.user?.id) {
      const currentUserId = session.user.id;
      const cached = hashedUserIdRef.current;

      // Use cached hash if it's for the same user ID
      if (cached && cached.userId === currentUserId) {
        posthog.identify(cached.hash);
      } else {
        // Hash the user ID and identify with the hash only (no PII)
        hashUserId(currentUserId).then((hashedId) => {
          hashedUserIdRef.current = { userId: currentUserId, hash: hashedId };
          posthog.identify(hashedId);
        });
      }
    } else {
      // Reset identification when user logs out
      hashedUserIdRef.current = null;
      posthog.reset();
    }
  }, [session?.user?.id, posthog]);

  // This component doesn't render anything
  return null;
};
