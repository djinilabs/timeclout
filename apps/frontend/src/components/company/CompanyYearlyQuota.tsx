import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Trans } from "@lingui/react/macro";
import companyWithSettingsQuery from "@/graphql-client/queries/companyWithSettings.graphql";
import updateCompanySettingsMutation from "@/graphql-client/mutations/updateCompanySettings.graphql";
import { getDefined } from "@/utils";
import { useQuery } from "../../hooks/useQuery";
import {
  QueryCompanyArgs,
  CompanySettingsArgs,
  Query,
  Mutation,
  MutationUpdateCompanySettingsArgs,
} from "../../graphql/graphql";
import { Button } from "../particles/Button";
import { useMutation } from "../../hooks/useMutation";
import { useForm } from "@tanstack/react-form";
import { yearlyQuotaParser } from "@/settings";
import { i18n } from "@lingui/core";

export const CompanyYearlyQuota = () => {
  const navigate = useNavigate();
  const { company: companyPk } = useParams();
  const [companyWithSettingsQueryResponse] = useQuery<
    { company: Query["company"] },
    QueryCompanyArgs & CompanySettingsArgs
  >({
    query: companyWithSettingsQuery,
    variables: {
      companyPk: getDefined(companyPk, "No company provided"),
      name: "yearlyQuota",
    },
  });

  const company = companyWithSettingsQueryResponse?.data?.company;
  const yearlyQuotaSettings = company?.settings
    ? yearlyQuotaParser.parse(company.settings)
    : {
        resetMonth: 1, // January
        defaultQuota: 20, // 20 days
      };

  const [, updateSettings] = useMutation<
    Mutation["updateCompanySettings"],
    MutationUpdateCompanySettingsArgs
  >(updateCompanySettingsMutation);

  const form = useForm({
    defaultValues: {
      resetMonth: yearlyQuotaSettings.resetMonth,
      defaultQuota: yearlyQuotaSettings.defaultQuota,
    },
    onSubmit: async ({ value }) => {
      const result = await updateSettings({
        companyPk: getDefined(companyPk, "No company provided"),
        name: "yearlyQuota",
        settings: value,
      });
      if (!result.error) {
        toast.success(i18n.t("Settings updated successfully"));
      }
    },
  });

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-6 md:grid-cols-3">
      <p className="mt-1 text-sm/6 text-gray-600 py-5">
        <Trans>
          Configure the yearly leave quota settings for employees in this
          company:
        </Trans>
      </p>

      <div className="flex py-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          role="form"
          aria-label={i18n.t("Company yearly quota form")}
        >
          <div>
            <form.Field
              name="resetMonth"
              children={(field) => (
                <div className="border-b border-gray-900/10 pb-6">
                  <label
                    htmlFor="resetMonth"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    <Trans>Reset Month</Trans>
                  </label>
                  <p className="mt-2 text-sm text-gray-500">
                    <Trans>
                      Select the month when the yearly leave quota should reset
                      for all employees.
                    </Trans>
                  </p>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="resetMonth"
                      name="resetMonth"
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      onChange={(e) => {
                        field.handleChange(Number(e.target.value));
                      }}
                      value={field.state.value}
                      role="combobox"
                      aria-label={i18n.t("Reset month")}
                      aria-required="true"
                      aria-invalid={field.state.meta.errors.length > 0}
                      aria-describedby={
                        field.state.meta.errors.length > 0
                          ? `${field.name}-error`
                          : undefined
                      }
                    >
                      <option
                        role="option"
                        aria-label={i18n.t("January")}
                        value={1}
                      >
                        <Trans>January</Trans>
                      </option>
                      <option
                        role="option"
                        aria-label={i18n.t("February")}
                        value={2}
                      >
                        <Trans>February</Trans>
                      </option>
                      <option
                        role="option"
                        aria-label={i18n.t("March")}
                        value={3}
                      >
                        <Trans>March</Trans>
                      </option>
                      <option
                        role="option"
                        aria-label={i18n.t("April")}
                        value={4}
                      >
                        <Trans>April</Trans>
                      </option>
                      <option
                        role="option"
                        aria-label={i18n.t("May")}
                        value={5}
                      >
                        <Trans>May</Trans>
                      </option>
                      <option
                        role="option"
                        aria-label={i18n.t("June")}
                        value={6}
                      >
                        <Trans>June</Trans>
                      </option>
                      <option
                        role="option"
                        aria-label={i18n.t("July")}
                        value={7}
                      >
                        <Trans>July</Trans>
                      </option>
                      <option
                        role="option"
                        aria-label={i18n.t("August")}
                        value={8}
                      >
                        <Trans>August</Trans>
                      </option>
                      <option
                        role="option"
                        aria-label={i18n.t("September")}
                        value={9}
                      >
                        <Trans>September</Trans>
                      </option>
                      <option
                        role="option"
                        aria-label={i18n.t("October")}
                        value={10}
                      >
                        <Trans>October</Trans>
                      </option>
                      <option
                        role="option"
                        aria-label={i18n.t("November")}
                        value={11}
                      >
                        <Trans>November</Trans>
                      </option>
                      <option
                        role="option"
                        aria-label={i18n.t("December")}
                        value={12}
                      >
                        <Trans>December</Trans>
                      </option>
                    </select>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                  </div>
                </div>
              )}
            ></form.Field>

            <form.Field
              name="defaultQuota"
              children={(field) => (
                <div className="pt-6 border-b border-gray-900/10 pb-6">
                  <label
                    htmlFor="defaultQuota"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    <Trans>Default Yearly Quota (days)</Trans>
                  </label>
                  <p className="mt-2 text-sm text-gray-500">
                    <Trans>
                      Set the default number of leave days allocated to each
                      employee per year.
                    </Trans>
                  </p>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="defaultQuota"
                      id="defaultQuota"
                      min="0"
                      max="365"
                      className="ol-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(Number(e.target.value));
                      }}
                      role="textbox"
                      aria-label={i18n.t("Default yearly quota")}
                      aria-required="true"
                      aria-invalid={field.state.meta.errors.length > 0}
                      aria-describedby={
                        field.state.meta.errors.length > 0
                          ? `${field.name}-error`
                          : undefined
                      }
                    />
                  </div>
                </div>
              )}
            ></form.Field>

            <div className="flex justify-end pt-6 gap-2">
              <Button
                cancel
                onClick={() => navigate(`/companies/${companyPk}?tab=settings`)}
              >
                <Trans>Cancel</Trans>
              </Button>
              <Button type="submit">
                <Trans>Save Settings</Trans>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
