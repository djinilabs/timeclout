import { FC } from "react";
import { useForm } from "@tanstack/react-form";
import { useParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Button } from "./Button";
import { useQuery } from "../hooks/useQuery";
import { companyWithSettingsQuery } from "../graphql/queries/companyWithSettings";
import {
  leaveTypeColors,
  leaveTypeIcons,
  leaveTypesSchema,
} from "../settings/leaveTypes";

type FormValues = {
  type: string;
  dateRange: [startDate?: string, endDate?: string];
  reason: string;
};

type BookCompanyTimeOffProps = {
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
};

export const BookCompanyTimeOff: FC<BookCompanyTimeOffProps> = ({
  onSubmit,
  onCancel,
}) => {
  const { company } = useParams();
  const [companyWithSettings] = useQuery({
    query: companyWithSettingsQuery,
    variables: {
      companyPk: company,
      name: "leaveTypes",
    },
  });

  const unparsedLeaveTypes = companyWithSettings?.data?.company?.settings;
  const leaveTypes = leaveTypesSchema.parse(unparsedLeaveTypes);

  const form = useForm<FormValues>({
    defaultValues: {
      type: leaveTypes[0].name,
      dateRange: [],
      reason: "",
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-6">
      <p className="mt-1 text-sm/6 text-gray-600 py-5">
        Book time off by filling this form:
      </p>
      <div className="flex py-5 col-span-5">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="type"
              children={(field) => {
                return (
                  <div className="border-b border-gray-900/10 pb-6">
                    <legend className="text-sm/6 font-semibold text-gray-900">
                      Type of Leave
                    </legend>
                    <p className="mt-1 text-sm/6 text-gray-600">
                      What type of leave are you planning to take?
                    </p>
                    <div className="mt-6 space-y-3">
                      {leaveTypes.map((leaveType) => (
                        <div key={leaveType.name} className="flex items-center">
                          <input
                            id={leaveType.name}
                            name={leaveType.name}
                            type="radio"
                            checked={field.state.value === leaveType.name}
                            onChange={() => field.handleChange(leaveType.name)}
                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                          />
                          <label
                            htmlFor={leaveType.name}
                            className="ml-3 block text-sm/6 font-medium"
                            style={{ color: leaveTypeColors[leaveType.color] }}
                          >
                            <span className="inline-flex items-center">
                              {leaveTypeIcons[leaveType.icon]}&nbsp;
                              {leaveType.name}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            />

            <form.Field
              name="dateRange"
              children={(field) => {
                const [startDate, endDate] = field.state.value.map((date) =>
                  date ? new Date(date) : undefined
                );
                return (
                  <div className="border-b border-gray-900/10 pb-6">
                    <label
                      htmlFor="dateRange"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Date range
                    </label>
                    <p className="mt-1 text-sm/6 text-gray-600">
                      {startDate && endDate
                        ? `From ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`
                        : "Select the date range for your leave."}
                    </p>
                    <DayPicker
                      mode="range"
                      required
                      selected={{
                        from: startDate,
                        to: endDate,
                      }}
                      disabled={{
                        before: new Date(),
                      }}
                      numberOfMonths={2}
                      onSelect={(range) =>
                        field.handleChange([
                          range?.from?.toISOString().split("T")[0],
                          range?.to?.toISOString().split("T")[0],
                        ])
                      }
                    />
                  </div>
                );
              }}
            />

            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Reason
              </label>
              <textarea
                name="reason"
                id="reason"
                rows={4}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <form.Subscribe
              children={(state) => {
                const selectedLeaveType = leaveTypes.find(
                  (leaveType) => leaveType.name === state.values.type
                );
                const disabled =
                  form.state.isSubmitting ||
                  !state.values.dateRange.filter(Boolean).length;
                return (
                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Button cancel onClick={() => onCancel()}>
                      Cancel
                    </Button>
                    <button
                      type="submit"
                      disabled={disabled}
                      className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                        disabled
                          ? "bg-indigo-300 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-500"
                      }`}
                    >
                      {disabled
                        ? "Fill in all the form fields"
                        : selectedLeaveType?.needsManagerApproval
                          ? `Submit request for ${selectedLeaveType.name} and wait for approval`
                          : `Create ${selectedLeaveType?.name} leave`}
                    </button>
                  </div>
                );
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
