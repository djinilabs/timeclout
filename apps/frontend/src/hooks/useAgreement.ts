import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLocation } from "react-router-dom";

export const useAgreement = () => {
  const [hasAgreed, setHasAgreed] = useState<boolean | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { status } = useSession();
  const location = useLocation();

  useEffect(() => {
    // Only check agreement if user is authenticated
    if (status === "authenticated") {
      // Don't show agreement dialog on privacy statement or terms of service pages
      const isLegalPage =
        location.pathname === "/privacy-statement" ||
        location.pathname === "/terms-of-service";

      if (isLegalPage) {
        setHasAgreed(true);
        setIsDialogOpen(false);
        return;
      }

      const checkAgreement = () => {
        try {
          const agreementAccepted = localStorage.getItem(
            "tt3-agreement-accepted"
          );
          const hasAgreedBefore = agreementAccepted === "true";
          setHasAgreed(hasAgreedBefore);

          // If user hasn't agreed, show the dialog
          if (!hasAgreedBefore) {
            setIsDialogOpen(true);
          }
        } catch (error) {
          console.error("Failed to check agreement status:", error);
          // If we can't access localStorage, assume they haven't agreed
          setHasAgreed(false);
          setIsDialogOpen(true);
        }
      };

      checkAgreement();
    } else if (status === "unauthenticated") {
      // If user is not authenticated, don't show agreement dialog
      setHasAgreed(true);
      setIsDialogOpen(false);
    }
  }, [status, location.pathname]);

  const handleAgree = () => {
    setHasAgreed(true);
    setIsDialogOpen(false);
  };

  const handleDisagree = () => {
    // Close the session by redirecting to logout or clearing session
    // For now, we'll redirect to a logout endpoint
    window.location.href = "/api/v1/auth/signout";
  };

  const resetAgreement = () => {
    try {
      localStorage.removeItem("tt3-agreement-accepted");
      localStorage.removeItem("tt3-agreement-date");
      setHasAgreed(false);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Failed to reset agreement:", error);
    }
  };

  return {
    hasAgreed,
    isDialogOpen,
    handleAgree,
    handleDisagree,
    resetAgreement,
  };
};
