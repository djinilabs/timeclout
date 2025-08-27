import { PlusIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { useState } from "react";
import toast from "react-hot-toast";

import { useMutation } from "../../hooks/useMutation";
import { Button } from "../particles/Button";
import { DemoModeConfig, type DemoModeConfigData } from "./DemoModeConfig";
import { DemoModeProgress } from "./DemoModeProgress";
import populateDemoAccountMutation from "@/graphql-client/mutations/populateDemoAccount.graphql";

type DemoModeState = "prompt" | "config" | "progress" | "success";

export const DemoModePrompt: React.FC = () => {
  const [demoModeState, setDemoModeState] = useState<DemoModeState>("prompt");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [, populateDemoAccount] = useMutation(populateDemoAccountMutation);

  const handleStartDemoMode = () => {
    setDemoModeState("config");
  };

  const handleCancelDemoMode = () => {
    setDemoModeState("prompt");
  };

  const handleSubmitDemoConfig = async (data: DemoModeConfigData) => {
    setDemoModeState("progress");
    setProgress(0);
    setCurrentStep(i18n.t("Initializing demo account..."));
    setStatusMessage(
      i18n.t("Setting up your industry-specific company structure...")
    );

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Update steps
      setTimeout(() => {
        setCurrentStep(i18n.t("Creating company..."));
        setStatusMessage(
          i18n.t("Setting up company settings and work schedules...")
        );
      }, 1000);

      setTimeout(() => {
        setCurrentStep(i18n.t("Creating unit..."));
        setStatusMessage(i18n.t("Setting up organizational structure..."));
      }, 2000);

      setTimeout(() => {
        setCurrentStep(i18n.t("Creating team..."));
        setStatusMessage(i18n.t("Setting up team configuration..."));
      }, 3000);

      setTimeout(() => {
        setCurrentStep(i18n.t("Adding team members..."));
        setStatusMessage(
          i18n.t("Creating realistic user profiles with qualifications...")
        );
      }, 4000);

      setTimeout(() => {
        setCurrentStep(i18n.t("Setting up shifts and schedules..."));
        setStatusMessage(
          i18n.t("Creating industry-appropriate work schedules...")
        );
      }, 5000);

      // Call the actual API
      const response = await populateDemoAccount({
        input: {
          industry: data.industry,
          unitType: data.unitType,
          teamSize: data.teamSize,
          companyName: data.companyName,
          unitName: data.unitName,
          teamName: data.teamName,
        },
      });

      clearInterval(progressInterval);

      if (response.error) {
        toast.error(
          i18n.t("Failed to populate demo account: {message}", {
            message: response.error.message,
          })
        );
        setDemoModeState("config");
        return;
      }

      // Success
      setProgress(100);
      setCurrentStep(i18n.t("Demo account created successfully!"));
      setStatusMessage(i18n.t("Redirecting to your new company..."));

      setTimeout(() => {
        setDemoModeState("success");
        // Reload the page to show the new company
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error(
        i18n.t("An unexpected error occurred: {message}", {
          message: error instanceof Error ? error.message : "Unknown error",
        })
      );
      setDemoModeState("config");
    }
  };

  if (demoModeState === "config") {
    return (
      <DemoModeConfig
        onSubmit={handleSubmitDemoConfig}
        onCancel={handleCancelDemoMode}
        isLoading={false}
      />
    );
  }

  if (demoModeState === "progress") {
    return (
      <DemoModeProgress
        currentStep={currentStep}
        progress={progress}
        message={statusMessage}
      />
    );
  }

  if (demoModeState === "success") {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <SparklesIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          <Trans>Demo Account Created Successfully!</Trans>
        </h3>
        <p className="text-gray-600">
          <Trans>Redirecting to your new company...</Trans>
        </p>
      </div>
    );
  }

  // Default prompt state
  return (
    <div
      className="text-center"
      role="status"
      aria-label="Demo mode prompt section"
    >
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 mb-4">
        <SparklesIcon className="h-6 w-6 text-teal-600" aria-hidden="true" />
      </div>

      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        <Trans>Welcome to Your New Account!</Trans>
      </h3>

      <p className="mt-1 text-sm text-gray-500 mb-6">
        <Trans>
          Get started quickly by letting us create a realistic company structure
          for you, or create your own from scratch.
        </Trans>
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          className="demo-mode-button inline-flex items-center rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          onClick={handleStartDemoMode}
          aria-label="Start demo mode"
        >
          <SparklesIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />
          <Trans>Quick Start with Demo Data</Trans>
        </button>

        <Button
          to="/companies/new"
          className="new-company-button"
          aria-label="Create new company manually"
        >
          <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />
          <Trans>Create Company Manually</Trans>
        </Button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <Trans>
            <strong>Demo Mode:</strong> We&apos;ll create a realistic company
            with team members, work schedules, and sample data based on your
            industry. Perfect for exploring the platform&apos;s features!
          </Trans>
        </p>
      </div>
    </div>
  );
};
