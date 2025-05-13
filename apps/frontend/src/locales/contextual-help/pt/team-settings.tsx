import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const teamSettingsHelp: HelpSection = {
  title: "Definições da Equipa",
  description: (
    <>
      Configure as definições e preferências da sua equipa. Gira políticas
      específicas da equipa, papéis dos membros e definições operacionais.
    </>
  ),
  features: [
    {
      title: "Perfil da Equipa",
      description: "Atualize as informações e configuração da equipa",
    },
    {
      title: "Gestão de Membros",
      description: "Gira os membros da equipa e os seus papéis",
    },
    {
      title: "Políticas da Equipa",
      description: "Configure políticas e preferências específicas da equipa",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="team-settings" />,
  roles: <RoleBasedHelp context="team-settings" />,
};
