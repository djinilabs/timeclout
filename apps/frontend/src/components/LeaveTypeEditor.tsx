import { leaveTypesSchema } from "../settings/leaveTypes";
import { useParams } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { IconPicker } from "./IconPicker";
import { ColorPicker } from "./ColorPicker";

export type LeaveTypeEditorProps = {
  settings: any;
};

export const LeaveTypeEditor = ({ settings }: LeaveTypeEditorProps) => {
  const leaveTypes = leaveTypesSchema.parse(settings);
  const { settingId } = useParams();
  const leaveType = leaveTypes.find(
    (leaveType) => leaveType.name === settingId
  );

  const form = useForm({
    defaultValues: {
      name: leaveType?.name,
      icon: leaveType?.icon,
      color: leaveType?.color,
    },
  });

  console.log(leaveType);

  if (!leaveType) {
    return null;
  }

  return (
    <form onSubmit={form.handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">
            Leave Type &quot;{leaveType.name}&quot;
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Edit the leave type &quot;{leaveType.name}&quot;
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
                    Name
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                      <input
                        id={field.name}
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
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
                    Icon
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
                    Pick a color
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
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};
