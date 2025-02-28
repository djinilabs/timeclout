import { useParams } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";
import { Trans } from "@lingui/react/macro";
import { getDefined } from "@/utils";
import { type WorkSchedule, worksScheduleParser } from "@/settings";
import companyWithSettingsQuery from "@/graphql-client/queries/companyWithSettings.graphql";
import updateCompanySettingsMutation from "@/graphql-client/mutations/updateCompanySettings.graphql";
import { useQuery } from "../hooks/useQuery";
import { useMutation } from "../hooks/useMutation";
import { Button } from "./stateless/Button";
import {
  QueryCompanyArgs,
  CompanySettingsArgs,
  Query,
  Mutation,
  MutationUpdateCompanySettingsArgs,
} from "../graphql/graphql";

const workDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const defaultWorkHours = {
  start: "09:00",
  end: "17:00",
};

const defaultWorkSchedule = {
  monday: {
    isWorkDay: true,
    ...defaultWorkHours,
  },
  tuesday: {
    isWorkDay: true,
    ...defaultWorkHours,
  },
  wednesday: {
    isWorkDay: true,
    ...defaultWorkHours,
  },
  thursday: {
    isWorkDay: true,
    ...defaultWorkHours,
  },
  friday: {
    isWorkDay: true,
    ...defaultWorkHours,
  },
  saturday: {
    isWorkDay: false,
  },
  sunday: {
    isWorkDay: false,
  },
};

export const CompanyWorkSchedule = () => {
  const { company: companyPk } = useParams();
  const [companyWithSettingsQueryResponse] = useQuery<
    { company: Query["company"] },
    QueryCompanyArgs & CompanySettingsArgs
  >({
    query: companyWithSettingsQuery,
    variables: {
      companyPk: getDefined(companyPk, "No company provided"),
      name: "workSchedule",
    },
  });

  const company = companyWithSettingsQueryResponse?.data?.company;
  const workScheduleSettings =
    company?.settings && worksScheduleParser.parse(company.settings);

  const [, updateSettings] = useMutation<
    Mutation["updateCompanySettings"],
    MutationUpdateCompanySettingsArgs
  >(updateCompanySettingsMutation);

  const form = useForm<WorkSchedule>({
    defaultValues: workScheduleSettings ?? defaultWorkSchedule,
    onSubmit: async ({ value }) => {
      const result = await updateSettings({
        companyPk: getDefined(companyPk, "No company provided"),
        name: "workSchedule",
        settings: value,
      });
      if (!result.error) {
        toast.success("Work schedule updated successfully");
      }
    },
  });

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-6 md:grid-cols-3">
      <p className="mt-1 text-sm/6 text-gray-600 py-5">
        <Trans>
          Configure the standard work schedule for employees in this company:
        </Trans>
      </p>

      <div className="flex py-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium leading-6 text-gray-900">
                <Trans>Work Days</Trans>
              </h3>
              <div className="mt-4 space-y-3">
                {workDays.map((day) => (
                  <div key={day} className="flex items-center">
                    <form.Field
                      name={day}
                      children={(field) => (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={field.state.value.isWorkDay}
                              onChange={(e) =>
                                field.handleChange({
                                  ...field.state.value,
                                  isWorkDay: e.target.checked,
                                })
                              }
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <span className="ml-3 text-sm capitalize">
                              {day}
                            </span>
                          </div>
                          {field.state.value.isWorkDay && (
                            <div className="flex gap-2 items-center pl-8">
                              <input
                                type="time"
                                value={field.state.value.start}
                                onChange={(e) =>
                                  field.handleChange({
                                    ...field.state.value,
                                    start: e.target.value,
                                  })
                                }
                                className="rounded border-gray-300 text-sm"
                              />
                              <span className="text-sm text-gray-500">
                                <Trans>to</Trans>
                              </span>
                              <input
                                type="time"
                                value={field.state.value.end}
                                onChange={(e) =>
                                  field.handleChange({
                                    ...field.state.value,
                                    end: e.target.value,
                                  })
                                }
                                className="rounded border-gray-300 text-sm"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit">
              <Trans>Save Changes</Trans>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
