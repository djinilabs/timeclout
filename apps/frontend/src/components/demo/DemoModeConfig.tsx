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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          <Trans>Populate Your Account with Demo Data</Trans>
        </h2>
        <p className="text-gray-600">
          <Trans>
            We'll create a realistic company structure based on your industry to
            help you get started quickly.
          </Trans>
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        {/* Industry Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Trans>Industry *</Trans>
          </label>
          <select
            value={form.store.state.values.industry}
            onChange={(e) => handleIndustryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
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
            <p className="mt-1 text-sm text-gray-500">
              {selectedIndustryOption.description}
            </p>
          )}
        </div>

        {/* Unit Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Trans>Unit Type *</Trans>
          </label>
          <select
            value={form.store.state.values.unitType}
            onChange={(e) => form.setFieldValue("unitType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            required
          >
            <option value="">
              <Trans>Select a unit type...</Trans>
            </option>
            {selectedIndustryOption?.unitTypeSuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion}>
                {suggestion}
              </option>
            ))}
          </select>
        </div>

        {/* Team Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Trans>Team Size *</Trans>
          </label>
          <input
            type="number"
            value={form.store.state.values.teamSize}
            onChange={(e) =>
              form.setFieldValue("teamSize", parseInt(e.target.value) || 5)
            }
            min={selectedIndustryOption?.teamSizeRange.min || 1}
            max={selectedIndustryOption?.teamSizeRange.max || 20}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            required
          />
          {selectedIndustryOption && (
            <p className="mt-1 text-sm text-gray-500">
              <Trans>
                Recommended: {selectedIndustryOption.teamSizeRange.min}-
                {selectedIndustryOption.teamSizeRange.max} people
              </Trans>
            </p>
          )}
        </div>

        {/* Optional Custom Names */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <Trans>Custom Names (Optional)</Trans>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Trans>Company Name</Trans>
              </label>
              <input
                type="text"
                value={form.store.state.values.companyName}
                onChange={(e) =>
                  form.setFieldValue("companyName", e.target.value)
                }
                placeholder={i18n.t("Leave empty for auto-generated name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Trans>Unit Name</Trans>
              </label>
              <input
                type="text"
                value={form.store.state.values.unitName}
                onChange={(e) => form.setFieldValue("unitName", e.target.value)}
                placeholder={i18n.t("Leave empty for auto-generated name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Trans>Team Name</Trans>
              </label>
              <input
                type="text"
                value={form.store.state.values.teamName}
                onChange={(e) => form.setFieldValue("teamName", e.target.value)}
                placeholder={i18n.t("Leave empty for auto-generated name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button type="button" onClick={onCancel} disabled={isLoading}>
            <Trans>Cancel</Trans>
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !form.store.state.values.industry}
          >
            {isLoading ? (
              <Trans>Populating...</Trans>
            ) : (
              <Trans>Populate My Account</Trans>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
