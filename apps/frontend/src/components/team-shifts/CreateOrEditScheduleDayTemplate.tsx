/* eslint-disable react/no-children-prop */
import "react-day-picker/style.css";
import { XMarkIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Trans } from "@lingui/react/macro";
import { useForm } from "@tanstack/react-form";
import { FC, useMemo, useCallback, useState } from "react";

import { type AnalyzedShiftPosition } from "../../hooks/useAnalyzeTeamShiftsCalendar";
import { useTeamDayTemplates } from "../../hooks/useTeamDayTemplates";
import { type ShiftPositionWithFake } from "../../hooks/useTeamShiftPositionsMap";
import { useTeamShiftPositionTemplates } from "../../hooks/useTeamShiftPositionTemplates";
import { ShiftPosition } from "../atoms/ShiftPosition";

import { ScheduleDayTemplate, SchedulePositionTemplate } from "@/settings";
import { getDefined } from "@/utils";

export interface CreateOrEditScheduleDayTemplateDialogProps {
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

export interface CreateOrEditScheduleDayTemplateForm {
  name: string;
  shiftPositionTemplates: ScheduleDayTemplate;
}

// Helper function to convert template to analyzed shift position for display
const convertTemplateToAnalyzedShiftPosition = (
  template: SchedulePositionTemplate,
  index: number
): AnalyzedShiftPosition => {
  const baseShiftPosition: ShiftPositionWithFake = {
    pk: `template-${index}`,
    sk: `template-${index}`,
    name: template.name,
    color: template.color,
    requiredSkills: template.requiredSkills,
    schedules: template.schedules,
    day: "template",
    isTemplate: true,
    fake: false,
    original: {
      pk: `template-${index}`,
      sk: `template-${index}`,
      name: template.name,
      color: template.color,
      requiredSkills: template.requiredSkills,
      schedules: template.schedules,
      day: "template",
    } as ShiftPositionWithFake,
  };

  return {
    ...baseShiftPosition,
    rowSpan: 1,
    rowStart: 1,
    rowEnd: 1,
    hasLeaveConflict: false,
    hasIssueWithMaximumIntervalBetweenShiftsRule: false,
    hasIssueWithMinimumNumberOfShiftsPerWeekInStandardWorkday: false,
    hasIssueWithMinimumRestSlotsAfterShiftRule: false,
    workerInconvenienceEqualityDeviation: undefined,
    workerSlotEqualityDeviation: undefined,
    workerSlotProximityDeviation: undefined,
  };
};

export const CreateOrEditScheduleDayTemplate: FC<
  CreateOrEditScheduleDayTemplateDialogProps
> = ({ onClose, teamPk }) => {
  const { teamShiftPositionTemplates } = useTeamShiftPositionTemplates(teamPk);
  const [dragging, setDragging] = useState<SchedulePositionTemplate | null>(
    null
  );
  const [selectedTemplates, setSelectedTemplates] = useState<
    SchedulePositionTemplate[]
  >([]);

  const { creatingTeamScheduleDayTemplate, createTeamScheduleDayTemplate } =
    useTeamDayTemplates(getDefined(teamPk, "No team provided"));

  const form = useForm<
    CreateOrEditScheduleDayTemplateForm,
    undefined,
    undefined,
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
        shiftPositionTemplates: [],
      }),
      []
    ),
    onSubmit: async ({ value }) => {
      createTeamScheduleDayTemplate(value.name, selectedTemplates);
      onClose();
    },
  });

  const onTemplateDragStart = useCallback(
    (
      shiftPosition: ShiftPositionWithFake,
      e: React.DragEvent<HTMLDivElement>
    ) => {
      // Extract the template from the shift position
      const template: SchedulePositionTemplate = {
        name: shiftPosition.name || "",
        color: shiftPosition.color || undefined,
        requiredSkills: shiftPosition.requiredSkills,
        schedules: shiftPosition.schedules,
      };
      setDragging(template);
      e.dataTransfer.dropEffect = "copy";
      e.currentTarget.setAttribute("aria-grabbed", "true");
    },
    [setDragging]
  );

  const onTemplateDragEnd = useCallback(
    (
      _shiftPosition: ShiftPositionWithFake,
      e: React.DragEvent<HTMLDivElement>
    ) => {
      setDragging(null);
      e.currentTarget.setAttribute("aria-grabbed", "false");
    },
    [setDragging]
  );

  const onDropZoneDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },
    []
  );

  const onDropZoneDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const draggedTemplate = dragging as SchedulePositionTemplate;
      if (draggedTemplate) {
        const contains = selectedTemplates.filter(
          (t) => t.name === draggedTemplate.name
        );
        const templateToAdd =
          contains.length > 0
            ? {
                ...draggedTemplate,
                name: `${draggedTemplate.name} (${contains.length + 1})`,
              }
            : draggedTemplate;
        setSelectedTemplates((prev) => [...prev, templateToAdd]);
      }
      setDragging(null);
    },
    [dragging, setDragging, selectedTemplates]
  );

  const removeTemplate = useCallback(
    (templateToRemove: SchedulePositionTemplate) => {
      setSelectedTemplates((prev) =>
        prev.filter((t) => t.name !== templateToRemove.name)
      );
    },
    []
  );

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
              <Trans>Create a schedule day template.</Trans>
            </p>

            <div className="mt-10 grid gap-y-8">
              <div className="border-b border-gray-900/10 col-span-full grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <form.Field
                  name="name"
                  children={(field) => (
                    <>
                      <div className="col-span-full">
                        <label
                          htmlFor={field.name}
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          <Trans>Template Name</Trans>
                        </label>
                        <p className="mt-3 text-sm/6 text-gray-600 mb-2">
                          <Trans>Set a name for this day template</Trans>
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

                {/* Available Templates Section */}
                <div className="col-span-full">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    <Trans>Available Shift Position Templates</Trans>
                  </label>
                  <p className="mt-3 text-sm/6 text-gray-600 mb-4">
                    <Trans>
                      Drag templates from here to add them to your day template
                    </Trans>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {!teamShiftPositionTemplates ||
                    teamShiftPositionTemplates.length === 0 ? (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        <Trans>No shift position templates available.</Trans>
                      </div>
                    ) : (
                      teamShiftPositionTemplates.map((template, index) => {
                        const analyzedShiftPosition =
                          convertTemplateToAnalyzedShiftPosition(
                            template,
                            index
                          );

                        return (
                          <div
                            key={`${template.name}-${index}`}
                            className="relative border border-gray-200 rounded-lg transition-colors hover:border-gray-300 cursor-grab"
                            draggable
                            onDragStart={(e) =>
                              onTemplateDragStart(analyzedShiftPosition, e)
                            }
                            onDragEnd={(e) =>
                              onTemplateDragEnd(analyzedShiftPosition, e)
                            }
                          >
                            <ShiftPosition
                              teamPk={teamPk}
                              shiftPosition={analyzedShiftPosition}
                              showScheduleDetails={true}
                              showMenu={false}
                              marginLeftAccordingToSchedule={false}
                              onShiftPositionDragStart={onTemplateDragStart}
                              onShiftPositionDragEnd={onTemplateDragEnd}
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Selected Templates Drop Zone */}
                <div className="col-span-full">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    <Trans>Day Template Contents</Trans>
                  </label>
                  <p className="mt-3 text-sm/6 text-gray-600 mb-4">
                    <Trans>Drop zone for shift position templates</Trans>
                  </p>
                  <div
                    className="min-h-32 border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors"
                    onDragOver={onDropZoneDragOver}
                    onDrop={onDropZoneDrop}
                    style={{
                      borderColor: dragging ? "#10b981" : "#d1d5db",
                      backgroundColor: dragging ? "#f0fdf4" : "transparent",
                    }}
                  >
                    {selectedTemplates.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <PlusCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm">
                            <Trans>Drop shift position templates here</Trans>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedTemplates.map((template, index) => {
                          const analyzedShiftPosition =
                            convertTemplateToAnalyzedShiftPosition(
                              template,
                              index
                            );

                          return (
                            <div
                              key={`selected-${template.name}-${index}`}
                              className="relative"
                            >
                              <ShiftPosition
                                teamPk={teamPk}
                                shiftPosition={analyzedShiftPosition}
                                showScheduleDetails={true}
                                showMenu={false}
                                marginLeftAccordingToSchedule={false}
                              />
                              <button
                                type="button"
                                onClick={() => removeTemplate(template)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                aria-label={`Remove ${template.name} from day template`}
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
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
            disabled={creatingTeamScheduleDayTemplate}
          >
            <Trans>Cancel</Trans>
          </button>
          <button
            type="submit"
            className="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-2xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Save changes to schedule day template"
            disabled={
              creatingTeamScheduleDayTemplate || selectedTemplates.length === 0
            }
          >
            <Trans>Create Day Template</Trans>
          </button>
        </div>
      </form>
    </div>
  );
};
