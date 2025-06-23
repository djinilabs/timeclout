import { useCallback, useMemo, useState } from "react";
import { getDefined } from "@/utils";
import { SchedulePositionTemplate } from "@/settings";
import { useTeamWithSettings } from "./useTeamWithSettings";
import { useSaveTeamSettings } from "./useSaveTeamSettings";

export const useTeamShiftPositionTemplates = (teamPk: string) => {
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

  const [
    creatingTeamShiftPositionTemplate,
    setCreatingTeamShiftPositionTemplate,
  ] = useState(false);

  const createTeamShiftPositionTemplate = useCallback(
    async (template: SchedulePositionTemplate) => {
      if (schedulePositionTemplates === undefined) {
        return;
      }
      setCreatingTeamShiftPositionTemplate(true);
      await saveTeamTemplates([...(schedulePositionTemplates ?? []), template]);
      setCreatingTeamShiftPositionTemplate(false);
    },
    [schedulePositionTemplates, saveTeamTemplates]
  );

  const deleteTeamShiftPositionTemplate = useCallback(
    async (template: SchedulePositionTemplate) => {
      if (schedulePositionTemplates === undefined) {
        return;
      }
      await saveTeamTemplates(
        schedulePositionTemplates.filter((t) => t.name !== template.name)
      );
    },
    [schedulePositionTemplates, saveTeamTemplates]
  );

  return useMemo(() => {
    return {
      teamShiftPositionTemplates: schedulePositionTemplates,
      creatingTeamShiftPositionTemplate,
      createTeamShiftPositionTemplate,
      deleteTeamShiftPositionTemplate,
    };
  }, [
    creatingTeamShiftPositionTemplate,
    createTeamShiftPositionTemplate,
    deleteTeamShiftPositionTemplate,
    schedulePositionTemplates,
  ]);
};
