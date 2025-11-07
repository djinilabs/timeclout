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
      className="max-w-4xl mx-auto"
      role="status"
      aria-label="Demo mode prompt section"
    >
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 mb-6">
          <SparklesIcon className="h-8 w-8 text-teal-600" aria-hidden="true" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          <Trans>Welcome to Your New Account!</Trans>
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          <Trans>
            Get started quickly with a complete company setup, or build your own
            from scratch. Choose the option that works best for you.
          </Trans>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <button
          type="button"
          className="demo-mode-button inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:from-teal-700 hover:to-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 transition-all duration-200 transform hover:scale-105"
          onClick={handleStartDemoMode}
          aria-label="Start demo mode"
        >
          <SparklesIcon aria-hidden="true" className="mr-3 h-6 w-6" />
          <Trans>Quick Start with Demo Data</Trans>
        </button>

        <Button
          to="/companies/new"
          className="new-company-button inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 transition-all duration-200"
          aria-label="Create new company manually"
        >
          <PlusIcon aria-hidden="true" className="mr-3 h-6 w-6" />
          <Trans>Create Company Manually</Trans>
        </Button>
      </div>

      {/* Demo Data Preview */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            <Trans>What You&apos;ll Get with Demo Data</Trans>
          </h3>
          <p className="text-gray-600">
            <Trans>
              A complete, industry-specific company setup ready for immediate
              exploration
            </Trans>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Company Structure */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h4 className="ml-3 text-sm font-semibold text-gray-900">
                <Trans>Company Structure</Trans>
              </h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • <Trans>Industry-specific company with realistic name</Trans>
              </li>
              <li>
                • <Trans>Department/unit with appropriate naming</Trans>
              </li>
              <li>
                • <Trans>Team with industry-relevant roles</Trans>
              </li>
              <li>
                • <Trans>Work schedule matching industry standards</Trans>
              </li>
            </ul>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h4 className="ml-3 text-sm font-semibold text-gray-900">
                <Trans>Team Members</Trans>
              </h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • <Trans>5-10 realistic team members with names & emails</Trans>
              </li>
              <li>
                •{" "}
                <Trans>
                  Industry-specific roles (nurses, sales associates, etc.)
                </Trans>
              </li>
              <li>
                • <Trans>Relevant qualifications & certifications</Trans>
              </li>
              <li>
                • <Trans>Proper team hierarchy and permissions</Trans>
              </li>
            </ul>
          </div>

          {/* Schedules & Templates */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="ml-3 text-sm font-semibold text-gray-900">
                <Trans>Schedules & Templates</Trans>
              </h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • <Trans>Day and week schedule templates</Trans>
              </li>
              <li>
                • <Trans>Multiple shift patterns (day, night, weekend)</Trans>
              </li>
              <li>
                • <Trans>Industry-appropriate work hours</Trans>
              </li>
              <li>
                • <Trans>Ready-to-use scheduling patterns</Trans>
              </li>
            </ul>
          </div>

          {/* Sample Data */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h4 className="ml-3 text-sm font-semibold text-gray-900">
                <Trans>Sample Data</Trans>
              </h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • <Trans>5-8 realistic leave requests</Trans>
              </li>
              <li>
                • <Trans>Various leave types (vacation, sick, training)</Trans>
              </li>
              <li>
                • <Trans>Future-dated requests for testing</Trans>
              </li>
              <li>
                • <Trans>Realistic reasons and durations</Trans>
              </li>
            </ul>
          </div>

          {/* Industry Customization */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h4 className="ml-3 text-sm font-semibold text-gray-900">
                <Trans>Industry Customization</Trans>
              </h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • <Trans>Healthcare, Retail, Manufacturing, etc.</Trans>
              </li>
              <li>
                • <Trans>Industry-specific roles & qualifications</Trans>
              </li>
              <li>
                • <Trans>Appropriate work schedules & shift patterns</Trans>
              </li>
              <li>
                • <Trans>Realistic company & team names</Trans>
              </li>
            </ul>
          </div>

          {/* Ready to Explore */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="ml-3 text-sm font-semibold text-gray-900">
                <Trans>Ready to Explore</Trans>
              </h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • <Trans>Immediate access to all platform features</Trans>
              </li>
              <li>
                • <Trans>Test scheduling, leave management, etc.</Trans>
              </li>
              <li>
                • <Trans>Perfect for learning and demonstrations</Trans>
              </li>
              <li>
                • <Trans>Can be modified or deleted anytime</Trans>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-blue-700 font-medium">
            <Trans>
              <strong>Perfect for:</strong> Learning the platform, testing
              features, demonstrations, or getting a quick start on your real
              company setup.
            </Trans>
          </p>
        </div>
      </div>
    </div>
  );
};
