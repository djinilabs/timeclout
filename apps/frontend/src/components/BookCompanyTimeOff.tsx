import { FC } from "react";
import { useForm } from "@tanstack/react-form";

type FormValues = {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
};

type BookCompanyTimeOffProps = {
  onSubmit: (values: FormValues) => void;
};

export const BookCompanyTimeOff: FC<BookCompanyTimeOffProps> = ({
  onSubmit,
}) => {
  const form = useForm<FormValues>({
    defaultValues: {
      type: "",
      startDate: "",
      endDate: "",
      reason: "",
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  const leaveTypes = [
    { id: "vacation", label: "Vacation" },
    { id: "sick", label: "Sick Leave" },
    { id: "personal", label: "Personal Leave" },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Leave Type
          </label>
          <select
            id="type"
            name="type"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            {leaveTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>

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

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Book Time Off
          </button>
        </div>
      </form>
    </div>
  );
};
