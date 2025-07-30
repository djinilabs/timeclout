import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const workScheduleSettingsHelp: HelpSection = {
  title: "Configurações do Horário de Trabalho",
  description: (
    <>
      Configure os{" "}
      <strong>
        horários de trabalho, fuso horário e preferências de horário
      </strong>{" "}
      da sua equipa. Estas configurações afetam como os turnos são exibidos e
      agendados.
    </>
  ),
  features: [
    {
      title: "Horários de Trabalho",
      description:
        "Defina dias de trabalho padrão, horários de início/fim e períodos de pausa",
    },
    {
      title: "Fuso Horário",
      description:
        "Configure o fuso horário da equipa para agendamento preciso de turnos",
    },
    {
      title: "Regras de Horário",
      description:
        "Defina períodos de descanso, regras de horas extras e restrições de agendamento",
    },
  ],
  sections: [
    {
      title: "Configurar Horários de Trabalho",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            • <strong>Dias de Trabalho:</strong> Selecione quais dias da semana
            são dias de trabalho
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Horários de Início/Fim:</strong> Defina horários padrão de
            início e fim dos turnos
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Pausas:</strong> Defina períodos obrigatórios de pausa
            durante os turnos
          </p>
          <p className="text-xs text-gray-600">
            • <strong>Regras de Horas Extras:</strong> Configure quando os
            turnos contam como horas extras
          </p>
        </div>
      ),
    },
    {
      title: "Configuração do Fuso Horário",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            • Escolha o <strong>fuso horário principal</strong> da sua equipa
            para todo o agendamento
          </p>
          <p className="text-xs text-gray-600">
            • Todos os horários dos turnos serão exibidos neste fuso horário
          </p>
          <p className="text-xs text-gray-600">
            • Considere as mudanças de horário de verão ao configurar os
            horários
          </p>
        </div>
      ),
    },
  ],
  screenshots: [
    {
      caption: "Formulário de configurações do horário de trabalho",
      alt: "Configuração do horário de trabalho",
    },
    {
      caption: "Seleção de fuso horário e configuração de horários",
      alt: "Configuração de fuso horário e horários",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="work-schedule-settings" />,
  roles: <RoleBasedHelp context="work-schedule-settings" />,
};
