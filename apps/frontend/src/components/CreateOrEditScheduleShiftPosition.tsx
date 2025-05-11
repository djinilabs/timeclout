import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import "react-day-picker/style.css";
import { dequal } from "dequal";
import { DayDate } from "@/day-date";
import { getDefined } from "@/utils";
import { SchedulePositionTemplate } from "@/settings";
import { Trans } from "@lingui/react/macro";
import { SelectUser } from "./stateless/SelectUser";
import { useQuery } from "../hooks/useQuery";
import teamWithMembersAndSettingsQuery from "@/graphql-client/queries/teamWithMembersAndSettings.graphql";
import {
  CreateShiftPositionInput,
  QueryTeamArgs,
  ShiftPosition,
  Team,
  TeamMembersArgs,
  TeamSettingsArgs,
  UpdateShiftPositionInput,
} from "../graphql/graphql";
import { TimeSchedulesEditor } from "./stateless/TimeSchedulesEditor";
import { EditQualifications } from "./EditQualifications";
import { Color, ColorPicker } from "./stateless/ColorPicker";
import { Button } from "./stateless/Button";
import { useTeamWithSettings } from "../hooks/useTeamWithSettings";
import { useSaveTeamSettings } from "../hooks/useSaveTeamSettings";
import { ListBox } from "./stateless/ListBox";
import { DayPicker } from "./stateless/DayPicker";
import { calculateShiftPositionSchedulesTotalInconvenience } from "../utils/calculateShiftPositionSchedulesTotalInconvenience";

export interface CreateOrEditScheduleShiftPositionProps {
  day: DayDate;
  onCancel: () => void;
  onCreate: (input: CreateShiftPositionInput) => void;
  onUpdate: (input: UpdateShiftPositionInput) => void;
  editingShiftPosition?: ShiftPosition;
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

export interface CreateOrEditScheduleShiftPositionForm {
  day: DayDate;
  name: string;
  color?: Color | undefined;
  requiredSkills: string[];
  schedules: ShiftPositionSchedule[];
  assignedTo?: User | null;
}

export const CreateOrEditScheduleShiftPosition: FC<
  CreateOrEditScheduleShiftPositionProps
> = ({ day, onCancel, onCreate, onUpdate, editingShiftPosition }) => {
  const form = useForm<
    CreateOrEditScheduleShiftPositionForm,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  >({
    defaultValues: useMemo(
      () => ({
        name: editingShiftPosition?.name ?? "",
        color: editingShiftPosition?.color as Color | undefined,
        day: editingShiftPosition?.day
          ? new DayDate(editingShiftPosition.day)
          : day,
        requiredSkills: editingShiftPosition?.requiredSkills ?? [],
        schedules:
          (editingShiftPosition?.schedules as ShiftPositionSchedule[]) ?? [
            {
              startHourMinutes: [9, 0],
              endHourMinutes: [17, 0],
              inconveniencePerHour: 1,
            },
          ],
        assignedTo: editingShiftPosition?.assignedTo ?? null,
      }),
      [day, editingShiftPosition]
    ),
    onSubmit: async ({ value }) => {
      if (!editingShiftPosition) {
        onCreate({
          team: getDefined(teamPk, "No team provided"),
          day: value.day.toString(),
          name: value.name,
          color: value.color,
          requiredSkills: value.requiredSkills,
          schedules: value.schedules,
          assignedTo: value.assignedTo?.pk,
        });
      } else {
        onUpdate({
          pk: editingShiftPosition.pk,
          sk: editingShiftPosition.sk,
          day: value.day.toString(),
          name: value.name,
          color: value.color,
          requiredSkills: value.requiredSkills,
          schedules: value.schedules,
          assignedTo: value.assignedTo?.pk,
        });
      }
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

  const [totalInconvenience, setTotalInconvenience] = useState(
    calculateShiftPositionSchedulesTotalInconvenience(
      form.store.state.values.schedules
    )
  );

  useEffect(() => {
    return form.store.subscribe((state) => {
      const newSkills = state.currentVal.values.requiredSkills;
      if (!dequal(skills, newSkills)) {
        setSkills(newSkills);
      }
      setTotalInconvenience(
        calculateShiftPositionSchedulesTotalInconvenience(
          state.currentVal.values.schedules
        )
      );
    });
  }, [form, skills]);

  const forbiddenBefore = useMemo(() => {
    return new DayDate(new Date());
  }, []);

  // schedule position templates

  const [usingTemplate, setUsingTemplate] = useState(false);
  const [usingWhichTemplate, setUsingWhichTemplate] = useState<
    string | undefined
  >(undefined);

  const { saveTeamSettings: saveTeamTemplates } =
    useSaveTeamSettings<"schedulePositionTemplates">({
      teamPk: getDefined(teamPk, "No team provided"),
      name: "schedulePositionTemplates",
    });

  const { settings: schedulePositionTemplates } =
    useTeamWithSettings<"schedulePositionTemplates">({
      teamPk: getDefined(teamPk, "No team provided"),
      settingsName: "schedulePositionTemplates",
    });

  const [creatingTeamTemplate, setCreatingTeamTemplate] = useState(false);

  const createTeamTemplate = useCallback(
    async (template: SchedulePositionTemplate) => {
      if (schedulePositionTemplates === undefined) {
        return;
      }
      setCreatingTeamTemplate(true);
      await saveTeamTemplates([...(schedulePositionTemplates ?? []), template]);
      setCreatingTeamTemplate(false);
    },
    [schedulePositionTemplates, saveTeamTemplates]
  );

  // when using template, we need to set the form state to the values in the template
  // using a useEffect
  useEffect(() => {
    if (usingWhichTemplate) {
      const template = schedulePositionTemplates?.find(
        (template) => template.name === usingWhichTemplate
      );
      if (template) {
        form.reset(
          {
            // ...form.store.state.values,
            day: form.store.state.values.day,
            ...template,
          } as CreateOrEditScheduleShiftPositionForm,
          {
            keepDefaultValues: true,
          }
        );
      }
    }
  }, [form, schedulePositionTemplates, usingWhichTemplate]);

  return (
    <div>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <p className="mt-1 text-sm/6 text-gray-600">
              {editingShiftPosition ? (
                <Trans>Edit a position in the team schedule.</Trans>
              ) : (
                <Trans>Insert a position into the team schedule.</Trans>
              )}
            </p>

            <div className="mt-10 grid gap-y-8">
              {!editingShiftPosition &&
                schedulePositionTemplates &&
                schedulePositionTemplates.length > 0 && (
                  <fieldset>
                    <legend className="text-sm/6 font-semibold text-gray-900">
                      <Trans>Use template?</Trans>
                    </legend>
                    <p className="mt-1 text-sm/6 text-gray-600">
                      <Trans>Use a template to create this position.</Trans>
                    </p>
                    <div className="mt-6 space-y-6">
                      <div key="select" className="flex items-center">
                        <input
                          id="select"
                          name="notification-method"
                          type="radio"
                          className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden not-checked:before:hidden"
                          checked={usingTemplate}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUsingTemplate(true);
                            }
                          }}
                        />
                        <label
                          htmlFor="select"
                          className="ml-3 block text-sm/6 font-medium text-gray-900"
                        >
                          <Trans>Use template</Trans>
                        </label>
                      </div>
                    </div>
                  </fieldset>
                )}

              {usingTemplate && (
                <div className="col-span-full">
                  <ListBox
                    options={
                      schedulePositionTemplates?.map((template) => ({
                        key: template.name,
                        value: template.name,
                      })) ?? []
                    }
                    selected={usingWhichTemplate}
                    onChange={(option) => {
                      setUsingWhichTemplate(option as string);
                    }}
                  />
                </div>
              )}

              <div className="border-b border-gray-900/10 col-span-full grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <form.Field
                  name="requiredSkills"
                  children={(field) => (
                    <>
                      <div className="col-span-full">
                        <label
                          htmlFor={field.name}
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          <Trans>Required qualifications</Trans>
                        </label>
                        <p className="mt-3 text-sm/6 text-gray-600 mb-2">
                          <Trans>
                            Set the qualifications required for this position.
                          </Trans>
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
                          <Trans>Schedule</Trans>
                        </label>
                        <p className="mt-3 text-sm/6 text-gray-600 mb-2">
                          <Trans>Set the schedule for this position.</Trans>
                        </p>
                        <TimeSchedulesEditor
                          schedules={field.state.value}
                          onChange={(schedules) =>
                            field.handleChange(schedules)
                          }
                        />
                        <p className="mt-3 text-sm/6 text-gray-600 mb-2">
                          <Trans>
                            Total inconvenience: {totalInconvenience}
                          </Trans>
                        </p>
                      </div>
                    </>
                  )}
                />

                <form.Field
                  name="color"
                  children={(field) => (
                    <>
                      <div className="col-span-full">
                        <label
                          htmlFor={field.name}
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          <Trans>Color</Trans>
                        </label>
                        <p className="mt-3 text-sm/6 text-gray-600 mb-2">
                          <Trans>Set a color to this position</Trans>
                        </p>
                        <ColorPicker
                          value={field.state.value}
                          onChange={(color) => field.handleChange(color)}
                        />
                      </div>
                    </>
                  )}
                />

                <form.Field
                  name="name"
                  children={(field) => (
                    <>
                      <div className="col-span-full">
                        <label
                          htmlFor={field.name}
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          <Trans>Name</Trans>
                        </label>
                        <p className="mt-3 text-sm/6 text-gray-600 mb-2">
                          <Trans>Set a name to this position</Trans>
                        </p>
                        <input
                          type="text"
                          className={`col-start-1 row-start-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                            field.state.meta.errors.length > 0
                              ? "placeholder:text-red-300 outline-red-300 focus:outline-red-600"
                              : ""
                          }`}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                />

                {!usingTemplate && !editingShiftPosition && (
                  <form.Subscribe
                    children={(state) => (
                      <div className="my-6 col-span-full">
                        <Button
                          onClick={() => {
                            createTeamTemplate({
                              name: state.values.name,
                              color: state.values.color,
                              requiredSkills: state.values.requiredSkills,
                              schedules: state.values.schedules,
                            });
                          }}
                          disabled={!state.values.name || creatingTeamTemplate}
                        >
                          {creatingTeamTemplate ? (
                            <Trans>Saving...</Trans>
                          ) : (
                            <Trans>Save as template</Trans>
                          )}
                        </Button>
                        <p className="text-sm/6 text-gray-600">
                          <Trans>
                            By saving this as a template, you can reuse it to
                            create new positions in the future.
                          </Trans>
                        </p>
                      </div>
                    )}
                  />
                )}
              </div>

              <form.Field
                name="day"
                children={(field) => (
                  <div className="sm:col-span-4">
                    <label
                      htmlFor={field.name}
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      <Trans>Day</Trans>
                    </label>
                    <p className="mt-3 text-sm/6 text-gray-600 mb-2">
                      <Trans>Set the day for this position.</Trans>
                    </p>
                    <DayPicker
                      mode="single"
                      ISOWeek
                      timeZone="UTC"
                      required
                      disabled={{
                        before: new Date(),
                      }}
                      onMonthChange={(d) => {
                        if (d) {
                          const day = new DayDate(
                            d.getFullYear(),
                            d.getMonth() + 1,
                            Math.min(field.state.value.getDayOfMonth(), 27)
                          );
                          if (!day.isBefore(forbiddenBefore)) {
                            field.handleChange(day);
                          }
                        }
                      }}
                      month={field.state.value.firstOfMonth().toDate()}
                      selected={field.state.value.toDate()}
                      onSelect={(d) =>
                        d &&
                        field.handleChange(
                          new DayDate(
                            d.getFullYear(),
                            d.getMonth() + 1,
                            d.getDate()
                          )
                        )
                      }
                    />
                  </div>
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
                        <Trans>Assigned to</Trans>
                      </label>
                      <p className="mt-3 text-sm/6 text-gray-600 mb-2">
                        <Trans>Set the user assigned to this position.</Trans>
                      </p>
                      <SelectUser
                        users={teamWithMembersAndSettings?.team?.members ?? []}
                        user={field.state.value}
                        allowEmpty
                        onChange={(user) => {
                          console.log("user", user);
                          field.handleChange(user);
                        }}
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
            <Trans>Cancel</Trans>
          </button>
          <button
            type="submit"
            className="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-2xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            <Trans>Save Changes</Trans>
          </button>
        </div>
      </form>
    </div>
  );
};
