import { useCallback, useMemo, useState } from "react";

import { useSaveTeamSettings } from "./useSaveTeamSettings";
import { useTeamWithSettings } from "./useTeamWithSettings";

import { ScheduleDayTemplate } from "@/settings";

export const useTeamDayTemplates = (teamPk: string) => {
  const { saveTeamSettings: saveTeamDayTemplates } =
    useSaveTeamSettings<"scheduleDayTemplates">({
      teamPk: teamPk,
      name: "scheduleDayTemplates",
    });

  const { settings: scheduleDayTemplates } =
    useTeamWithSettings<"scheduleDayTemplates">({
      teamPk: teamPk,
      settingsName: "scheduleDayTemplates",
    });

  const [creatingTeamScheduleDayTemplate, setCreatingTeamScheduleDayTemplate] =
    useState(false);

  const createTeamScheduleDayTemplate = useCallback(
    async (name: string, template: ScheduleDayTemplate) => {
      if (scheduleDayTemplates === undefined) {
        return;
      }
      setCreatingTeamScheduleDayTemplate(true);
      await saveTeamDayTemplates({
        ...(scheduleDayTemplates ?? {}),
        [name]: template,
      });
      setCreatingTeamScheduleDayTemplate(false);
    },
    [scheduleDayTemplates, saveTeamDayTemplates]
  );

  const deleteTeamScheduleDayTemplate = useCallback(
    async (name: string) => {
      if (scheduleDayTemplates === undefined) {
        return;
      }
      await saveTeamDayTemplates(
        Object.fromEntries(
          Object.entries(scheduleDayTemplates).filter(([key]) => key !== name)
        )
      );
    },
    [scheduleDayTemplates, saveTeamDayTemplates]
  );

  return useMemo(() => {
    return {
      teamDayTemplates: scheduleDayTemplates,
      creatingTeamScheduleDayTemplate,
      createTeamScheduleDayTemplate,
      deleteTeamScheduleDayTemplate,
    };
  }, [
    creatingTeamScheduleDayTemplate,
    createTeamScheduleDayTemplate,
    deleteTeamScheduleDayTemplate,
    scheduleDayTemplates,
  ]);
};
