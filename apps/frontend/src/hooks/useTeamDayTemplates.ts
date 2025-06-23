import { useCallback, useMemo, useState } from "react";
import { SchedulePositionTemplate } from "@/settings";
import { useTeamWithSettings } from "./useTeamWithSettings";
import { useSaveTeamSettings } from "./useSaveTeamSettings";
import { ScheduleDayTemplate } from "libs/settings/src/scheduleDayTemplates";

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

  const [
    creatingTeamShiftPositionTemplate,
    setCreatingTeamShiftPositionTemplate,
  ] = useState(false);

  const createTeamShiftPositionTemplate = useCallback(
    async (template: ScheduleDayTemplate) => {
      if (scheduleDayTemplates === undefined) {
        return;
      }
      setCreatingTeamShiftPositionTemplate(true);
      await saveTeamDayTemplates({ ...(scheduleDayTemplates ?? {}), template });
      setCreatingTeamShiftPositionTemplate(false);
    },
    [scheduleDayTemplates, saveTeamDayTemplates]
  );

  const deleteTeamShiftPositionTemplate = useCallback(
    async (template: SchedulePositionTemplate) => {
      if (scheduleDayTemplates === undefined) {
        return;
      }
      await saveTeamDayTemplates(
        Object.fromEntries(
          Object.entries(scheduleDayTemplates).filter(
            ([key]) => key !== template.name
          )
        )
      );
    },
    [scheduleDayTemplates, saveTeamDayTemplates]
  );

  return useMemo(() => {
    return {
      teamDayTemplates: scheduleDayTemplates,
      creatingTeamShiftPositionTemplate,
      createTeamShiftPositionTemplate,
      deleteTeamShiftPositionTemplate,
    };
  }, [
    creatingTeamShiftPositionTemplate,
    createTeamShiftPositionTemplate,
    deleteTeamShiftPositionTemplate,
    scheduleDayTemplates,
  ]);
};
