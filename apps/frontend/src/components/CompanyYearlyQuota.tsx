import { useParams, useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import companyWithSettingsQuery from "@/graphql-client/queries/companyWithSettings.graphql";
import updateCompanySettingsMutation from "@/graphql-client/mutations/updateCompanySettings.graphql";
import { useQuery } from "../hooks/useQuery";
import {
  QueryCompanyArgs,
  CompanySettingsArgs,
  Query,
  Mutation,
  MutationUpdateCompanySettingsArgs,
} from "../graphql/graphql";
import { getDefined } from "@/utils";
import { Button } from "./Button";
import { useMutation } from "../hooks/useMutation";
import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";
import { yearlyQuotaParser } from "@/settings";

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
        toast.success("Settings updated successfully");
      }
    },
  });

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-6 md:grid-cols-3">
      <p className="mt-1 text-sm/6 text-gray-600 py-5">
        Configure the yearly leave quota settings for employees in this company:
      </p>

      <div className="flex py-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
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
                    Reset Month
                  </label>
                  <p className="mt-2 text-sm text-gray-500">
                    Select the month when the yearly leave quota should reset
                    for all employees.
                  </p>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="resetMonth"
                      name="resetMonth"
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      onChange={(e) => {
                        field.handleChange(Number(e.target.value));
                      }}
                      value={field.state.value}
                    >
                      <option value={1}>January</option>
                      <option value={2}>February</option>
                      <option value={3}>March</option>
                      <option value={4}>April</option>
                      <option value={5}>May</option>
                      <option value={6}>June</option>
                      <option value={7}>July</option>
                      <option value={8}>August</option>
                      <option value={9}>September</option>
                      <option value={10}>October</option>
                      <option value={11}>November</option>
                      <option value={12}>December</option>
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
                    Default Yearly Quota (days)
                  </label>
                  <p className="mt-2 text-sm text-gray-500">
                    Set the default number of leave days allocated to each
                    employee per year.
                  </p>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="defaultQuota"
                      id="defaultQuota"
                      min="0"
                      max="365"
                      className="ol-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(Number(e.target.value));
                      }}
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
                Cancel
              </Button>
              <Button type="submit">Save Settings</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
