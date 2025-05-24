import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const workScheduleSettingsHelp: HelpSection = {
  title: "Definições do Horário de Trabalho",
  description: (
    <>
      Configure as definições do horário de trabalho da sua equipa. Defina horas
      de trabalho, fuso horário e outras preferências relacionadas com o horário
      para garantir uma gestão adequada dos turnos.
    </>
  ),
  features: [
    {
      title: "Horas de Trabalho",
      description: "Defina as horas de trabalho padrão e os períodos de pausa",
    },
    {
      title: "Configuração do Fuso Horário",
      description:
        "Configure o fuso horário da equipa para um agendamento preciso",
    },
    {
      title: "Preferências de Horário",
      description:
        "Defina preferências e restrições relacionadas com o horário",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="work-schedule-settings" />,
  roles: <RoleBasedHelp context="work-schedule-settings" />,
};
