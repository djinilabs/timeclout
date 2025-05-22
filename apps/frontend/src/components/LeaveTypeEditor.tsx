import { useParams } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { Trans } from "@lingui/react/macro";
import { leaveTypeParser } from "@/settings";
import { IconPicker } from "./particles/IconPicker";
import { ColorPicker } from "./atoms/ColorPicker";

export type LeaveTypeEditorProps = {
  settings: unknown;
  onSubmit: (values: unknown) => void;
};

export const LeaveTypeEditor = ({
  settings,
  onSubmit,
}: LeaveTypeEditorProps) => {
  const leaveTypes = leaveTypeParser.parse(settings);
  const { settingId } = useParams();
  const leaveType = leaveTypes.find(
    (leaveType) => leaveType.name === settingId
  );

  const form = useForm({
    defaultValues: {
      name: leaveType?.name,
      icon: leaveType?.icon,
      color: leaveType?.color,
      showInCalendarAs: leaveType?.showInCalendarAs,
      visibleTo: leaveType?.visibleTo,
      deductsFromAnnualAllowance: leaveType?.deductsFromAnnualAllowance,
      needsManagerApproval: leaveType?.needsManagerApproval,
    },
    onSubmit: ({ value }) => {
      const newSettings = leaveTypes.map((leaveType) =>
        leaveType.name === settingId ? value : leaveType
      );
      onSubmit(newSettings);
    },
  });

  console.log(leaveType);

  if (!leaveType) {
    return null;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">
            <Trans>Leave Type "{leaveType.name}"</Trans>
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            <Trans>Edit the leave type "{leaveType.name}"</Trans>
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <form.Field
              name="name"
              children={(field) => (
                <div className="sm:col-span-4">
                  <label
                    htmlFor={field.name}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    <Trans>Name</Trans>
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-teal-600">
                      <input
                        id={field.name}
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            />

            <form.Field
              name="icon"
              children={(field) => (
                <div className="sm:col-span-4">
                  <label
                    htmlFor={field.name}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    <Trans>Icon</Trans>
                  </label>
                  <div className="mt-2">
                    <IconPicker
                      value={field.state.value}
                      onChange={(value) => field.handleChange(value)}
                    />
                  </div>
                </div>
              )}
            />

            <form.Field
              name="color"
              children={(field) => (
                <div className="col-span-full">
                  <label
                    htmlFor={field.name}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    <Trans>Pick a color</Trans>
                  </label>
                  <div className="mt-2">
                    <ColorPicker
                      value={field.state.value}
                      onChange={(value) => field.handleChange(value)}
                    />
                  </div>
                </div>
              )}
            />

            <form.Field
              name="showInCalendarAs"
              children={(field) => (
                <div className="sm:col-span-4">
                  <label
                    htmlFor={field.name}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    <Trans>Show in calendar as</Trans>
                  </label>
                  <div className="mt-2">
                    <select
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value as "busy" | "available" | "ooo"
                        )
                      }
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm/6"
                    >
                      <option value="busy">
                        <Trans>Busy</Trans>
                      </option>
                      <option value="available">
                        <Trans>Available</Trans>
                      </option>
                      <option value="ooo">
                        <Trans>Out of Office</Trans>
                      </option>
                    </select>
                  </div>
                </div>
              )}
            />

            <form.Field
              name="visibleTo"
              children={(field) => (
                <div className="sm:col-span-4">
                  <label
                    htmlFor={field.name}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    <Trans>Visible to</Trans>
                  </label>
                  <div className="mt-2">
                    <select
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value as "managers" | "employees"
                        )
                      }
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm/6"
                    >
                      <option value="managers">
                        <Trans>Managers only</Trans>
                      </option>
                      <option value="employees">
                        <Trans>All employees</Trans>
                      </option>
                    </select>
                  </div>
                </div>
              )}
            />

            <form.Field
              name="deductsFromAnnualAllowance"
              children={(field) => (
                <div className="col-span-full">
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id={field.name}
                        type="checkbox"
                        checked={field.state.value}
                        onChange={(e) => field.handleChange(e.target.checked)}
                        className="h-4 w-4 rounded-sm border-gray-300 text-teal-600 focus:ring-teal-600"
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label
                        htmlFor={field.name}
                        className="font-medium text-gray-900"
                      >
                        <Trans>Deducts from annual allowance</Trans>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            />

            <form.Field
              name="needsManagerApproval"
              children={(field) => (
                <div className="col-span-full">
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id={field.name}
                        type="checkbox"
                        checked={field.state.value}
                        onChange={(e) => field.handleChange(e.target.checked)}
                        className="h-4 w-4 rounded-sm border-gray-300 text-teal-600 focus:ring-teal-600"
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label
                        htmlFor={field.name}
                        className="font-medium text-gray-900"
                      >
                        <Trans>Requires manager approval</Trans>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          <Trans>Cancel</Trans>
        </button>
        <button
          type="submit"
          className="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          <Trans>Save</Trans>
        </button>
      </div>
    </form>
  );
};
