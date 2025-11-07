import { SparklesIcon } from "@heroicons/react/24/outline";
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";

import { Button } from "../particles/Button";

import { industryOptions, type IndustryOption } from "./industryOptions";

export interface DemoModeConfigData {
  industry: string;
  unitType: string;
  teamSize: number;
  companyName?: string;
  unitName?: string;
  teamName?: string;
}

interface DemoModeConfigProps {
  onSubmit: (data: DemoModeConfigData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const DemoModeConfig: React.FC<DemoModeConfigProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [selectedIndustry, setSelectedIndustry] =
    useState<IndustryOption | null>(null);

  const form = useForm({
    defaultValues: {
      industry: "",
      unitType: "",
      teamSize: 5,
      companyName: "",
      unitName: "",
      teamName: "",
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        industry: value.industry,
        unitType: value.unitType,
        teamSize: value.teamSize,
        companyName: value.companyName || undefined,
        unitName: value.unitName || undefined,
        teamName: value.teamName || undefined,
      });
    },
  });

  const handleIndustryChange = (industryValue: string) => {
    const industry = industryOptions.find((opt) => opt.value === industryValue);
    setSelectedIndustry(industry || null);

    if (industry) {
      form.setFieldValue("industry", industryValue);
      form.setFieldValue("unitType", industry.unitTypeSuggestions[0] || "");
      form.setFieldValue("teamSize", industry.teamSizeRange.default);
    }
  };

  const selectedIndustryOption = selectedIndustry;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-8 py-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-white/20 mb-4">
              <SparklesIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              <Trans>Create Your Demo Company</Trans>
            </h2>
            <p className="text-teal-100">
              <Trans>
                We&apos;ll generate a complete, industry-specific company
                structure with realistic data to help you explore all features.
              </Trans>
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-8"
          >
            {/* Industry Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  <Trans>Choose Your Industry</Trans>
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  <Trans>
                    Select an industry to get realistic company names, roles,
                    and work schedules
                  </Trans>
                </p>
                <select
                  value={form.store.state.values.industry}
                  onChange={(e) => handleIndustryChange(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  required
                >
                  <option value="">
                    <Trans>Select an industry...</Trans>
                  </option>
                  {industryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {selectedIndustryOption && (
                  <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">
                      {selectedIndustryOption.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Unit Type */}
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  <Trans>Department/Unit Type</Trans>
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  <Trans>
                    Choose the type of department or unit for your company
                  </Trans>
                </p>
                <select
                  value={form.store.state.values.unitType}
                  onChange={(e) =>
                    form.setFieldValue("unitType", e.target.value)
                  }
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  required
                >
                  <option value="">
                    <Trans>Select a unit type...</Trans>
                  </option>
                  {selectedIndustryOption?.unitTypeSuggestions.map(
                    (suggestion) => (
                      <option key={suggestion} value={suggestion}>
                        {suggestion}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* Team Size */}
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  <Trans>Team Size</Trans>
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  <Trans>
                    How many team members should we create? (Recommended: 5-10)
                  </Trans>
                </p>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min={selectedIndustryOption?.teamSizeRange.min || 1}
                    max={selectedIndustryOption?.teamSizeRange.max || 20}
                    value={form.store.state.values.teamSize}
                    onChange={(e) =>
                      form.setFieldValue(
                        "teamSize",
                        parseInt(e.target.value) || 5
                      )
                    }
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${
                        ((form.store.state.values.teamSize -
                          (selectedIndustryOption?.teamSizeRange.min || 1)) /
                          ((selectedIndustryOption?.teamSizeRange.max || 20) -
                            (selectedIndustryOption?.teamSizeRange.min || 1))) *
                        100
                      }%, #e5e7eb ${
                        ((form.store.state.values.teamSize -
                          (selectedIndustryOption?.teamSizeRange.min || 1)) /
                          ((selectedIndustryOption?.teamSizeRange.max || 20) -
                            (selectedIndustryOption?.teamSizeRange.min || 1))) *
                        100
                      }%, #e5e7eb 100%)`,
                    }}
                  />
                  <div className="w-16 text-center">
                    <span className="text-2xl font-bold text-teal-600">
                      {form.store.state.values.teamSize}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  <Trans>
                    Range: {selectedIndustryOption?.teamSizeRange.min || 1} -{" "}
                    {selectedIndustryOption?.teamSizeRange.max || 20} team
                    members
                  </Trans>
                </p>
              </div>
            </div>

            {/* Optional Custom Names */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                <Trans>Custom Names (Optional)</Trans>
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                <Trans>
                  Leave these empty to use industry-appropriate auto-generated
                  names, or customize them to your preference.
                </Trans>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Trans>Company Name</Trans>
                  </label>
                  <input
                    type="text"
                    value={form.store.state.values.companyName}
                    onChange={(e) =>
                      form.setFieldValue("companyName", e.target.value)
                    }
                    placeholder={i18n.t("e.g., City General Hospital")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Trans>Unit Name</Trans>
                  </label>
                  <input
                    type="text"
                    value={form.store.state.values.unitName}
                    onChange={(e) =>
                      form.setFieldValue("unitName", e.target.value)
                    }
                    placeholder={i18n.t("e.g., Emergency Department")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Trans>Team Name</Trans>
                  </label>
                  <input
                    type="text"
                    value={form.store.state.values.teamName}
                    onChange={(e) =>
                      form.setFieldValue("teamName", e.target.value)
                    }
                    placeholder={i18n.t("e.g., Night Shift Team")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3 text-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <Trans>Cancel</Trans>
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !form.store.state.values.industry}
                className="w-full sm:w-auto px-8 py-3 text-lg font-semibold bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <Trans>Creating Demo Company...</Trans>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <SparklesIcon className="mr-2 h-5 w-5" />
                    <Trans>Create Demo Company</Trans>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
