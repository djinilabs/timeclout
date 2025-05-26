import { useState, useEffect, useMemo } from "react";
import { useLocation, useMatch } from "react-router-dom";
import Joyride, { CallBackProps, STATUS } from "react-joyride";
import { useLingui } from "@lingui/react";
import { i18n } from "@lingui/core";
import { once } from "@/utils";
import { useTour } from "../hooks/useTour";

interface TourStep {
  target: string;
  content: string;
  title?: string;
  placement?: "top" | "bottom" | "left" | "right" | "bottom";
}

// Define tour steps for different routes
const tourSteps = once(
  (): Record<string, TourStep[]> => ({
    "/": [
      {
        target: "body",
        content: i18n._("Welcome to Team Time Table! Let us show you around."),
        placement: "bottom",
      },
      {
        target: ".companies-list",
        content: i18n._(
          "Here you can see all your companies and their key information."
        ),
        placement: "bottom",
      },
      {
        target: ".new-company-button",
        content: i18n._("Click here to create a new company."),
        placement: "bottom",
      },
    ],
    "/companies": [
      {
        target: ".companies-list",
        content: i18n._(
          "Here you can see all your companies and their key information."
        ),
        placement: "bottom",
      },
      {
        target: ".new-company-button",
        content: i18n._("Click here to create a new company."),
        placement: "bottom",
      },
    ],
    "/companies/new": [
      {
        target: ".company-form",
        content: i18n._("Fill in your company details here."),
        placement: "bottom",
      },
      {
        target: ".company-name-input",
        content: i18n._("Enter your company name."),
        placement: "bottom",
      },
      {
        target: ".company-submit-button",
        content: i18n._("Click here to create your company."),
        placement: "bottom",
      },
    ],
    "/companies/:company": [
      {
        target: ".company-header",
        content: i18n._(
          "This is your company dashboard. Here you can see an overview of your company."
        ),
        placement: "bottom",
      },
      {
        target: ".units-list",
        content: i18n._("Here you can see all the units in your company."),
        placement: "bottom",
      },
      {
        target: ".new-unit-button",
        content: i18n._("Click here to create a new unit."),
        placement: "bottom",
      },
      {
        target: ".company-settings-button",
        content: i18n._("Access company settings and configurations here."),
        placement: "bottom",
      },
    ],
    "/companies/:company/units/new": [
      {
        target: ".unit-form",
        content: i18n._("Fill in your unit details here."),
        placement: "bottom",
      },
      {
        target: ".unit-name-input",
        content: i18n._("Enter your unit name."),
        placement: "bottom",
      },
      {
        target: ".unit-submit-button",
        content: i18n._("Click here to create your unit."),
        placement: "bottom",
      },
    ],
    "/companies/:company/units/:unit": [
      {
        target: ".unit-header",
        content: i18n._(
          "This is your unit dashboard. Here you can manage your unit."
        ),
        placement: "bottom",
      },
      {
        target: ".teams-list",
        content: i18n._("Here you can see all the teams in this unit."),
        placement: "bottom",
      },
      {
        target: ".new-team-button",
        content: i18n._("Click here to create a new team."),
        placement: "bottom",
      },
      {
        target: ".unit-settings-button",
        content: i18n._("Access unit settings and configurations here."),
        placement: "bottom",
      },
    ],
    "/companies/:company/units/:unit/teams/new": [
      {
        target: ".team-form",
        content: i18n._("Fill in your team details here."),
        placement: "bottom",
      },
      {
        target: ".team-name-input",
        content: i18n._("Enter your team name."),
        placement: "bottom",
      },
      {
        target: ".team-submit-button",
        content: i18n._("Click here to create your team."),
        placement: "bottom",
      },
    ],
    "/companies/:company/units/:unit/teams/:team": [
      {
        target: ".team-header",
        content: i18n._(
          "This is your team dashboard. Here you can manage your team members and their leave requests."
        ),
        placement: "bottom",
      },
      {
        target: ".team-members-list",
        content: i18n._("Here you can see all the members in this team."),
        placement: "bottom",
      },
      {
        target: ".new-member-button",
        content: i18n._("Click here to add a new team member."),
        placement: "bottom",
      },
      {
        target: ".team-invite-button",
        content: i18n._("Invite new members to join your team."),
        placement: "bottom",
      },
      {
        target: ".leave-requests-section",
        content: i18n._("View and manage team members' leave requests here."),
        placement: "bottom",
      },
    ],
    "/companies/:company/units/:unit/teams/:team/members/new": [
      {
        target: ".member-form",
        content: i18n._("Add a new team member here."),
        placement: "bottom",
      },
      {
        target: ".member-email-input",
        content: i18n._("Enter the member's email address."),
        placement: "bottom",
      },
      {
        target: ".member-role-select",
        content: i18n._("Select the member's role in the team."),
        placement: "bottom",
      },
      {
        target: ".member-submit-button",
        content: i18n._("Click here to add the member to your team."),
        placement: "bottom",
      },
    ],
    "/companies/:company/units/:unit/teams/:team/leave-requests/new": [
      {
        target: ".leave-request-form",
        content: i18n._("Submit a new leave request here."),
        placement: "bottom",
      },
      {
        target: ".leave-type-select",
        content: i18n._("Select the type of leave you're requesting."),
        placement: "bottom",
      },
      {
        target: ".leave-date-range",
        content: i18n._("Choose the start and end dates for your leave."),
        placement: "bottom",
      },
      {
        target: ".leave-submit-button",
        content: i18n._("Click here to submit your leave request."),
        placement: "bottom",
      },
    ],
    "/leave-requests/pending": [
      {
        target: ".pending-requests-list",
        content: i18n._(
          "Here you can see and manage all pending leave requests."
        ),
        placement: "bottom",
      },
      {
        target: ".request-actions",
        content: i18n._("Approve or reject leave requests here."),
        placement: "bottom",
      },
    ],
    "/me/edit": [
      {
        target: ".profile-settings",
        content: i18n._(
          "Update your profile information and preferences here."
        ),
        placement: "bottom",
      },
      {
        target: ".name-input",
        content: i18n._("Update your professional name."),
        placement: "bottom",
      },
      {
        target: ".country-region-select",
        content: i18n._("Set your location preferences."),
        placement: "bottom",
      },
    ],
  })
);

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
    if (routeMatch) return tourSteps()[routeMatch];
    return [];
  }, [routeMatch]);

  // Debug logging
  // console.debug("Tour Debug:", {
  //   currentPath: location.pathname,
  //   matches: {
  //     root: rootMatch,
  //     companies: companiesMatch,
  //     company: companyMatch,
  //     unit: unitMatch,
  //     team: teamMatch,
  //     meEdit: meEditMatch,
  //     pendingRequests: pendingRequestsMatch,
  //   },
  //   hasSteps: steps.length > 0,
  //   isRunning: run,
  //   isTourRunning,
  // });

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
