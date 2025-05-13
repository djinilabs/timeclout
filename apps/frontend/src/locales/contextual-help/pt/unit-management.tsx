import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const unitManagementHelp: HelpSection = {
  title: "Gestão de Unidades",
  description: (
    <>
      Gira as suas unidades de negócio de forma eficaz. Crie, organize e
      mantenha unidades para estruturar as operações da sua empresa. Cada
      unidade pode ter múltiplas equipas com papéis e responsabilidades
      específicas.
    </>
  ),
  features: [
    {
      title: "Criação de Unidades",
      description:
        "Crie novas unidades de negócio com configurações e definições específicas",
    },
    {
      title: "Organização de Equipas",
      description:
        "Organize equipas dentro das unidades e Gira as suas relações",
    },
    {
      title: "Definições da Unidade",
      description: "Configure políticas e preferências específicas da unidade",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="unit-management" />,
  roles: <RoleBasedHelp context="unit-management" />,
};
