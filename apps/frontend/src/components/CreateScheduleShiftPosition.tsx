import { FC, useEffect, useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { DayDate } from "@/day-date";
import { TimeSchedulesEditor } from "./TimeSchedulesEditor";
import { SelectUser } from "./SelectUser";
import { useParams } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import teamWithMembersAndSettingsQuery from "@/graphql-client/queries/teamWithMembersAndSettings.graphql";
import createShiftPositionMutation from "@/graphql-client/mutations/createShiftPosition.graphql";
import {
  QueryTeamArgs,
  Team,
  TeamMembersArgs,
  TeamSettingsArgs,
} from "../graphql/graphql";
import { getDefined } from "@/utils";
import { EditQualifications } from "./EditQualifications";
import { useMutation } from "../hooks/useMutation";
import toast from "react-hot-toast";

export interface CreateScheduleShiftPositionProps {
  day: DayDate;
  onCancel: () => void;
  onSuccess: () => void;
}

export interface ShiftPositionSchedule {
  startHourMinutes: [number, number];
  endHourMinutes: [number, number];
  inconveniencePerHour: number;
}

export interface User {
  pk: string;
  name: string;
  email: string;
  emailMd5: string;
}

export interface CreateScheduleShiftPositionForm {
  day: DayDate;
  requiredSkills: string[];
  schedules: ShiftPositionSchedule[];
  assignedTo?: User;
}

export const CreateScheduleShiftPosition: FC<
  CreateScheduleShiftPositionProps
> = ({ day, onCancel }) => {
  const form = useForm<CreateScheduleShiftPositionForm>({
    defaultValues: useMemo(
      () => ({
        day,
        requiredSkills: [],
        schedules: [
          {
            startHourMinutes: [9, 0],
            endHourMinutes: [17, 0],
            inconveniencePerHour: 1,
          },
        ],
      }),
      [day]
    ),
    onSubmit: async (values) => {
      // Handle form submission
      console.log(values);
    },
  });

  const { team: teamPk } = useParams();
  const [skills, setSkills] = useState<string[]>([]);

  const [{ data: teamWithMembersAndSettings }] = useQuery<
    { team: Team },
    QueryTeamArgs & TeamMembersArgs & TeamSettingsArgs
  >({
    query: teamWithMembersAndSettingsQuery,
    variables: {
      teamPk: getDefined(teamPk, "No team provided"),
      qualifications: skills,
      name: "qualifications",
    },
  });

  useEffect(() => {
    return form.store.subscribe((state) => {
      setSkills(state.currentVal.values.requiredSkills);
    });
  }, [form]);

  const [, createShiftPosition] = useMutation(createShiftPositionMutation);

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
              name="requiredSkills"
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
                    <EditQualifications
                      qualifications={field.state.value}
                      onChange={(qualifications) =>
                        field.handleChange(qualifications)
                      }
                      qualificationSettings={
                        teamWithMembersAndSettings?.team.settings
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

            <form.Field
              name="assignedTo"
              children={(field) => (
                <>
                  <div className="col-span-full">
                    <label
                      htmlFor={field.name}
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Assigned to
                    </label>
                    <p className="mt-3 text-sm/6 text-gray-600 mb-2">
                      Set the user assigned to this position.
                    </p>
                    <SelectUser
                      users={teamWithMembersAndSettings?.team?.members ?? []}
                      user={field.state.value}
                      onChange={(user) => field.handleChange(user)}
                    />
                  </div>
                </>
              )}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm/6 font-semibold text-gray-900"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={async () => {
            const { error } = await createShiftPosition({
              input: {
                team: teamPk,
                day: form.state.values.day.toString(),
                requiredSkills: form.state.values.requiredSkills,
                schedules: form.state.values.schedules,
                assignedTo: form.state.values.assignedTo?.pk,
              },
            });
            if (!error) {
              toast.success("Shift position created");
            }
          }}
          className="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};
