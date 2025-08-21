/* eslint-disable react/no-children-prop */
import "react-day-picker/style.css";
import { Trans } from "@lingui/react/macro";
import { useForm } from "@tanstack/react-form";
import { dequal } from "dequal";
import { FC, useEffect, useMemo, useState } from "react";

import {
  QueryTeamArgs,
  Team,
  TeamMembersArgs,
  TeamSettingsArgs,
} from "../../graphql/graphql";
import { useQuery } from "../../hooks/useQuery";
import { useTeamShiftPositionTemplates } from "../../hooks/useTeamShiftPositionTemplates";
import { calculateShiftPositionSchedulesTotalInconvenience } from "../../utils/calculateShiftPositionSchedulesTotalInconvenience";
import { Color, ColorPicker } from "../atoms/ColorPicker";
import { EditQualifications } from "../team/EditQualifications";
import { TimeSchedulesEditor } from "../team-shifts/TimeSchedulesEditor";

import teamWithMembersAndSettingsQuery from "@/graphql-client/queries/teamWithMembersAndSettings.graphql";
import { getDefined } from "@/utils";

export interface CreateShiftPositionTemplateDialogProps {
  onClose: () => void;
  teamPk: string;
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

export interface CreateShiftPositionTemplateForm {
  name: string;
  color?: Color | undefined;
  requiredSkills: string[];
  schedules: ShiftPositionSchedule[];
}

export const CreateShiftPositionTemplate: FC<
  CreateShiftPositionTemplateDialogProps
> = ({ onClose, teamPk }) => {
  const { creatingTeamShiftPositionTemplate, createTeamShiftPositionTemplate } =
    useTeamShiftPositionTemplates(getDefined(teamPk, "No team provided"));

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

  const form = useForm<
    CreateShiftPositionTemplateForm,
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
        name: "",
        color: undefined,
        requiredSkills: [],
        schedules: [
          {
            startHourMinutes: [9, 0],
            endHourMinutes: [17, 0],
            inconveniencePerHour: 1,
          },
        ],
        assignedTo: null,
      }),
      []
    ),
    onSubmit: async ({ value }) => {
      createTeamShiftPositionTemplate({
        name: value.name,
        color: value.color,
        requiredSkills: value.requiredSkills,
        schedules: value.schedules,
      });
      onClose();
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

  return (
    <div>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          form.handleSubmit();
        }}
        role="form"
        aria-label={"Create schedule position template form"}
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <p className="mt-1 text-sm/6 text-gray-600" role="doc-subtitle">
              <Trans>Create a position template.</Trans>
            </p>

            <div className="mt-10 grid gap-y-8">
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
                          <Trans>Acceptable Qualifications</Trans>
                        </label>
                        <p className="mt-3 text-sm/6 text-gray-600 mb-2">
                          <Trans>
                            Set any of the qualifications that can fill this
                            position.
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
                          aria-invalid={field.state.meta.errors.length > 0}
                          aria-describedby={
                            field.state.meta.errors.length > 0
                              ? `${field.name}-error`
                              : undefined
                          }
                        />
                        {field.state.meta.errors.length > 0 && (
                          <div
                            id={`${field.name}-error`}
                            className="text-red-600 text-sm mt-1"
                            role="alert"
                          >
                            {field.state.meta.errors.join(", ")}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm/6 font-semibold text-gray-900"
            onClick={onClose}
            aria-label="Cancel changes"
            disabled={creatingTeamShiftPositionTemplate}
          >
            <Trans>Cancel</Trans>
          </button>
          <button
            type="submit"
            className="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-2xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            aria-label="Save changes to schedule position"
            disabled={creatingTeamShiftPositionTemplate}
          >
            <Trans>Create Template</Trans>
          </button>
        </div>
      </form>
    </div>
  );
};
