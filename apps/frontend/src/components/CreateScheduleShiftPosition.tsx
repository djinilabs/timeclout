import { FC } from "react";
import { useForm } from "@tanstack/react-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { DayDate } from "@/day-date";
import { Badge, Badges } from "./Badges";
import { TimeSchedulesEditor } from "./TimeSchedulesEditor";

export interface CreateScheduleShiftPositionProps {
  day: DayDate;
}

export interface ShiftPositionSchedule {
  startHourMinutes: [number, number];
  endHourMinutes: [number, number];
  inconveniencePerHour: number;
}

export interface CreateScheduleShiftPositionForm {
  day: DayDate;
  badges: Badge[];
  schedules: ShiftPositionSchedule[];
}

export const CreateScheduleShiftPosition: FC<
  CreateScheduleShiftPositionProps
> = ({ day }) => {
  const form = useForm<CreateScheduleShiftPositionForm>({
    defaultValues: {
      day,
      badges: [
        { name: "Badge 1", color: "gray" },
        { name: "Badge 2", color: "red" },
        { name: "Badge 3", color: "yellow" },
        { name: "Badge 4", color: "green" },
        { name: "Badge 5", color: "blue" },
        { name: "Badge 6", color: "indigo" },
        { name: "Badge 7", color: "purple" },
        { name: "Badge 8", color: "pink" },
      ],
      schedules: [
        {
          startHourMinutes: [9, 0],
          endHourMinutes: [17, 0],
          inconveniencePerHour: 1,
        },
      ],
    },
    onSubmit: async (values) => {
      // Handle form submission
      console.log(values);
    },
  });

  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <p className="mt-1 text-sm/6 text-gray-600">
            Insert a position into the team schedule.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <form.Field
              name="day"
              children={(field) => (
                <div className="sm:col-span-4">
                  <label
                    htmlFor={field.name}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Day
                  </label>
                  <p className="mt-3 text-sm/6 text-gray-600 mb-2">
                    Set the day for this position.
                  </p>
                  <DayPicker
                    mode="single"
                    ISOWeek
                    timeZone="UTC"
                    required
                    disabled={{
                      before: new Date(),
                    }}
                    selected={field.state.value.toDate()}
                    onSelect={(d) => d && field.handleChange(new DayDate(d))}
                  />
                </div>
              )}
            />

            <form.Field
              name="badges"
              children={(field) => (
                <>
                  <div className="col-span-full">
                    <label
                      htmlFor={field.name}
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Required skills
                    </label>
                    <p className="mt-3 text-sm/6 text-gray-600 mb-2">
                      Set the skills required for this position.
                    </p>
                    <Badges
                      badges={field.state.value}
                      onRemove={(badge) =>
                        field.handleChange(
                          field.state.value.filter((b) => b.name !== badge.name)
                        )
                      }
                    />
                  </div>
                </>
              )}
            />

            <form.Field
              name="schedules"
              children={(field) => (
                <>
                  <div className="col-span-full">
                    <label
                      htmlFor={field.name}
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Schedule
                    </label>
                    <p className="mt-3 text-sm/6 text-gray-600 mb-2">
                      Set the schedule for this position.
                    </p>
                    <TimeSchedulesEditor
                      schedules={field.state.value}
                      onChange={(schedules) => field.handleChange(schedules)}
                    />
                  </div>
                </>
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
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};
