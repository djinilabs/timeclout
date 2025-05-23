import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const unitSettingsHelp: HelpSection = {
  title: "Definições da Unidade",
  description: (
    <>
      Configure as definições da sua unidade de negócio. Gira preferências
      específicas da unidade, estruturas de equipa e definições operacionais.
    </>
  ),
  features: [
    {
      title: "Perfil da Unidade",
      description: "Atualize as informações e configuração da unidade",
    },
    {
      title: "Estrutura da Equipa",
      description: "Gira a organização da equipa dentro da unidade",
    },
    {
      title: "Políticas da Unidade",
      description: "Configure políticas e preferências específicas da unidade",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="unit-settings" />,
  roles: <RoleBasedHelp context="unit-settings" />,
};
