import { useState, useEffect, useMemo } from "react";
import { useLocation, useMatch } from "react-router-dom";
import Joyride, { CallBackProps, STATUS } from "react-joyride";
import { useLingui } from "@lingui/react";
import { useTour } from "../contexts/TourContext";

interface TourStep {
  target: string;
  content: string;
  title?: string;
  placement?: "top" | "bottom" | "left" | "right" | "bottom";
}

// Define tour steps for different routes
const tourSteps: Record<string, TourStep[]> = {
  "/": [
    {
      target: "body",
      content: "Welcome to Team Time Table! Let us show you around.",
      placement: "bottom",
    },
    {
      target: ".companies-list",
      content: "Here you can see all your companies and their key information.",
      placement: "bottom",
    },
    {
      target: ".new-company-button",
      content: "Click here to create a new company.",
      placement: "bottom",
    },
  ],
  "/companies": [
    {
      target: ".companies-list",
      content: "Here you can see all your companies and their key information.",
      placement: "bottom",
    },
    {
      target: ".new-company-button",
      content: "Click here to create a new company.",
      placement: "bottom",
    },
  ],
  "/companies/:company": [
    {
      target: ".company-header",
      content:
        "This is your company dashboard. Here you can see an overview of your company.",
      placement: "bottom",
    },
    {
      target: ".units-list",
      content: "Here you can see all the units in your company.",
      placement: "bottom",
    },
    {
      target: ".new-unit-button",
      content: "Click here to create a new unit.",
      placement: "bottom",
    },
  ],
  "/companies/:company/units/:unit": [
    {
      target: ".unit-header",
      content: "This is your unit dashboard. Here you can manage your unit.",
      placement: "bottom",
    },
    {
      target: ".teams-list",
      content: "Here you can see all the teams in this unit.",
      placement: "bottom",
    },
    {
      target: ".new-team-button",
      content: "Click here to create a new team.",
      placement: "bottom",
    },
  ],
  "/companies/:company/units/:unit/teams/:team": [
    {
      target: ".team-header",
      content:
        "This is your team dashboard. Here you can manage your team members and their leave requests.",
      placement: "bottom",
    },
    {
      target: ".team-members-list",
      content: "Here you can see all the members in this team.",
      placement: "bottom",
    },
    {
      target: ".new-member-button",
      content: "Click here to add a new team member.",
      placement: "bottom",
    },
  ],
  "/me/edit": [
    {
      target: ".profile-settings",
      content: "Update your profile information and preferences here.",
      placement: "bottom",
    },
  ],
  "/leave-requests/pending": [
    {
      target: ".pending-requests-list",
      content: "Here you can see and manage all pending leave requests.",
      placement: "bottom",
    },
  ],
};

export function OnboardingTour() {
  const [run, setRun] = useState(false);
  const location = useLocation();
  const { i18n } = useLingui();
  const { isTourRunning, stopTour } = useTour();

  // Use React Router's useMatch to match routes
  const rootMatch = useMatch("/");
  const companiesMatch = useMatch("/companies");
  const companyMatch = useMatch("/companies/:company");
  const unitMatch = useMatch("/companies/:company/units/:unit");
  const teamMatch = useMatch("/companies/:company/units/:unit/teams/:team");
  const meEditMatch = useMatch("/me/edit");
  const pendingRequestsMatch = useMatch("/leave-requests/pending");

  const routeMatch = useMemo((): string | undefined => {
    if (rootMatch) return "/";
    if (companiesMatch) return "/companies";
    if (companyMatch) return "/companies/:company";
    if (unitMatch) return "/companies/:company/units/:unit";
    if (teamMatch) return "/companies/:company/units/:unit/teams/:team";
    if (meEditMatch) return "/me/edit";
    if (pendingRequestsMatch) return "/leave-requests/pending";
  }, [
    rootMatch,
    companiesMatch,
    companyMatch,
    unitMatch,
    teamMatch,
    meEditMatch,
    pendingRequestsMatch,
  ]);

  useEffect(() => {
    // Check if this is the user's first visit to this page
    if (!routeMatch) return;
    const hasSeenTour = localStorage.getItem(`tour-${routeMatch}`);
    if (!hasSeenTour || isTourRunning) {
      setRun(true);
    }
  }, [location, isTourRunning, routeMatch]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if (
      routeMatch &&
      (status === STATUS.FINISHED || status === STATUS.SKIPPED)
    ) {
      console.log("Tour finished or skipped", routeMatch);
      // Save that the user has seen this tour
      localStorage.setItem(`tour-${routeMatch}`, "true");
      setRun(false);
      stopTour();
    }
  };

  // Determine which route is matched and get corresponding steps
  const steps = useMemo(() => {
    if (routeMatch) return tourSteps[routeMatch];
    return [];
  }, [routeMatch]);

  // Debug logging
  console.debug("Tour Debug:", {
    currentPath: location.pathname,
    matches: {
      root: rootMatch,
      companies: companiesMatch,
      company: companyMatch,
      unit: unitMatch,
      team: teamMatch,
      meEdit: meEditMatch,
      pendingRequests: pendingRequestsMatch,
    },
    hasSteps: steps.length > 0,
    isRunning: run,
    isTourRunning,
  });

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      debug
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "#0D9488", // Tailwind teal-600
          zIndex: 1000,
        },
        tooltip: {
          backgroundColor: "white",
          borderRadius: "0.5rem",
          padding: "1rem",
        },
        buttonNext: {
          backgroundColor: "#0D9488",
        },
        buttonBack: {
          color: "#0D9488",
        },
        buttonSkip: {
          color: "#6B7280", // Tailwind gray-500
        },
      }}
      locale={{
        back: i18n._("Back"),
        close: i18n._("Close"),
        last: i18n._("Done"),
        next: i18n._("Next"),
        skip: i18n._("Skip"),
      }}
    />
  );
}
