import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useParams } from "react-router-dom";
import "react-day-picker/style.css";
import toast from "react-hot-toast";
import { Trans } from "@lingui/react/macro";
import { i18n } from "@lingui/core";
import { getDefined } from "@/utils";
import { leaveTypeParser } from "@/settings";
import { DayDate } from "@/day-date";
import companyWithSettingsQuery from "@/graphql-client/queries/companyWithSettings.graphql";
import { Button } from "./stateless/Button";
import { useQuery } from "../hooks/useQuery";
import { leaveTypeColors, leaveTypeIcons } from "../settings/leaveTypes";
import { useHolidays } from "../hooks/useHolidays";
import {
  CompanySettingsArgs,
  Query,
  QueryCompanyArgs,
} from "../graphql/graphql";
import { Suspense } from "./stateless/Suspense";
import { DayPicker } from "./stateless/DayPicker";

export type TimeOffRequest = {
  type: string;
  dateRange: [startDate?: string, endDate?: string];
  reason: string;
};

export interface QuotaFulfilmentProps {
  companyPk: string;
  simulatesLeave: boolean;
  simulatesLeaveType: string;
  startDate: string;
  endDate: string;
}

export type BookCompanyTimeOffProps = {
  onSubmit: (values: TimeOffRequest) => void;
  onCancel: () => void;
  location: { country: string; region: string };
  quotaFulfilment: (props: QuotaFulfilmentProps) => ReactNode;
};

export const BookCompanyTimeOff: FC<BookCompanyTimeOffProps> = ({
  onSubmit,
  onCancel,
  location,
  quotaFulfilment,
}) => {
  const { company } = useParams();
  const [companyWithSettings] = useQuery<
    { company: Query["company"] },
    QueryCompanyArgs & CompanySettingsArgs
  >({
    query: companyWithSettingsQuery,
    variables: {
      companyPk: getDefined(company, "No company provided"),
      name: "leaveTypes",
    },
  });

  const leaveTypes = useMemo(
    () =>
      companyWithSettings?.data?.company?.settings
        ? leaveTypeParser.parse(companyWithSettings?.data?.company?.settings)
        : [],
    [companyWithSettings]
  );

  const form = useForm<TimeOffRequest>({
    defaultValues: {
      type: leaveTypes[0].name,
      dateRange: [],
      reason: "",
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  // Holidays
  const [startDate, setStartDate] = useState(() => new DayDate(new Date()));
  const [endDate, setEndDate] = useState(() =>
    new DayDate(new Date()).nextMonth(1).endOfMonth()
  );

  const { data: holidays, error: holidaysError } = useHolidays(
    useMemo(
      () => ({
        country: location.country,
        region: location.region,
        startDate,
        endDate,
      }),
      [endDate, startDate, location]
    )
  );

  useEffect(() => {
    if (holidaysError) {
      toast.error("Error fetching holidays: " + holidaysError.message);
    }
  }, [holidaysError]);

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
        <p className="mt-1 text-sm/6 text-gray-600 py-5">
          <Trans>Request time off by filling this form:</Trans>
        </p>
        <div className="flex py-5 md:col-span-2">
          <div className="px-4 justify-end">
            <form.Field
              name="type"
              children={(field) => {
                return (
                  <div className="border-b border-gray-900/10 pb-6">
                    <legend className="text-sm/6 font-semibold text-gray-900">
                      <Trans>Type of Leave</Trans>
                    </legend>
                    <p className="mt-1 text-sm/6 text-gray-600">
                      <Trans>
                        What type of leave are you planning to take?
                      </Trans>
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
                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-teal-600 checked:bg-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
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
              name="reason"
              children={(field) => {
                return (
                  <div className="mt-2 col-span-full">
                    <label
                      htmlFor={field.name}
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      <Trans>Reason</Trans>
                    </label>
                    <textarea
                      autoFocus
                      value={field.state.value}
                      placeholder={i18n.t(
                        `Please provide a reason for your leave request.`
                      )}
                      onChange={(e) => field.handleChange(e.target.value)}
                      name={field.name}
                      id={field.name}
                      rows={4}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
        <div>
          <p className="mt-1 text-sm/6 text-gray-600 py-5">
            <Trans>Select the dates</Trans>
          </p>
          <form.Subscribe
            children={(state) => {
              const [startDate, endDate] = state.values.dateRange.map((date) =>
                date ? new Date(date) : undefined
              );
              return startDate && endDate ? (
                <Suspense>
                  {quotaFulfilment({
                    companyPk: getDefined(company, "No company provided"),
                    startDate: startDate.toISOString().split("T")[0],
                    endDate: endDate.toISOString().split("T")[0],
                    simulatesLeave: true,
                    simulatesLeaveType: state.values.type,
                  })}
                </Suspense>
              ) : null;
            }}
          />
        </div>
        <div className="flex py-5 col-span-2">
          <form.Field
            name="dateRange"
            children={(field) => {
              const [startDate, endDate] = field.state.value.map((date) =>
                date ? new Date(date) : undefined
              );
              const holidaysDates = Object.keys(holidays ?? {}).map(
                (date) => new Date(date + "T00:00:00Z")
              );
              return (
                <div>
                  <label
                    htmlFor="dateRange"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    <Trans>Date range</Trans>
                  </label>
                  <p className="mt-1 text-sm/6 text-gray-600">
                    {startDate && endDate ? (
                      <Trans>
                        From {startDate.toLocaleDateString()} to{" "}
                        {endDate.toLocaleDateString()}
                      </Trans>
                    ) : (
                      <Trans>Select the date range for your leave.</Trans>
                    )}
                  </p>
                  <DayPicker
                    ISOWeek
                    timeZone="UTC"
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
                    captionLayout="dropdown"
                    startMonth={new Date()}
                    endMonth={
                      new Date(new Date().setMonth(new Date().getMonth() + 24))
                    }
                    onSelect={(range) =>
                      field.handleChange([
                        range?.from?.toISOString().split("T")[0],
                        range?.to?.toISOString().split("T")[0],
                      ])
                    }
                    onMonthChange={(month) => {
                      setStartDate(new DayDate(month));
                      setEndDate(new DayDate(month).nextMonth(1).endOfMonth());
                    }}
                    modifiers={{
                      holiday: holidaysDates,
                      dayOfWeek: { dayOfWeek: [0, 6] },
                    }}
                    modifiersClassNames={{
                      holiday: "bg-red-500 text-white mx-auto rounded-full",
                      dayOfWeek: "bg-gray-100 text-gray-500 mx-auto",
                    }}
                  />
                </div>
              );
            }}
          />
        </div>
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
                <Trans>Cancel</Trans>
              </Button>
              <button
                type="submit"
                disabled={disabled}
                className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
                  disabled
                    ? "bg-teal-300 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-500"
                }`}
              >
                {disabled ? (
                  <Trans>Fill in all the form fields</Trans>
                ) : selectedLeaveType?.needsManagerApproval ? (
                  <Trans>
                    Submit request for {selectedLeaveType.name} and wait for
                    approval
                  </Trans>
                ) : (
                  <Trans>Create {selectedLeaveType?.name} leave</Trans>
                )}
              </button>
            </div>
          );
        }}
      />
    </form>
  );
};
