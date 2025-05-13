import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const teamManagementHelp: HelpSection = {
  title: "Gestão de Equipas",
  description: (
    <>
      Gira as suas equipas dentro desta unidade. Crie novas equipas, atribua
      membros e configure as definições da equipa. Cada equipa pode ter o seu
      próprio horário, políticas de ausência e modelos de turnos. Esta interface
      permite-lhe manter estruturas de equipa eficientes e garantir uma alocação
      adequada de recursos.
    </>
  ),
  features: [
    {
      title: "Criação de Equipas",
      description:
        "Crie novas equipas com configurações específicas e atribuição de membros",
    },
    {
      title: "Gestão de Membros",
      description: "Adicione, remova e gira membros da equipa e os seus papéis",
    },
    {
      title: "Definições da Equipa",
      description:
        "Configure políticas, horários e preferências específicas da equipa. Defina padrões de trabalho, direitos de ausência e requisitos de turnos.",
    },
  ],
  sections: [
    {
      title: "Processo de Configuração da Equipa",
      content: (
        <>
          <p>Para configurar uma nova equipa:</p>
          <ol>
            <li>Defina a estrutura e hierarquia da equipa</li>
            <li>Configure as definições e políticas da equipa</li>
            <li>Adicione membros à equipa e atribua papéis</li>
            <li>Configure modelos de turnos e horários</li>
            <li>Configure políticas e direitos de ausência</li>
          </ol>
        </>
      ),
    },
    {
      title: "Boas Práticas de Gestão de Equipas",
      content: (
        <>
          <ul>
            <li>Mantenha definições de papéis e responsabilidades claras</li>
            <li>Reveja regularmente a composição e desempenho da equipa</li>
            <li>
              Garanta uma distribuição justa de turnos e carga de trabalho
            </li>
            <li>Mantenha as definições e políticas da equipa atualizadas</li>
          </ul>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="team-management" />,
  roles: <RoleBasedHelp context="team-management" />,
};
