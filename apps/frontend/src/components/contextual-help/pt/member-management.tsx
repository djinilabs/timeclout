import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";
import { HelpSection } from "../types";

export const memberManagementHelp: HelpSection = {
  title: "Gestão de Membros",
  description: (
    <>
      Gira os membros da sua equipa de forma eficaz. Adicione novos membros,
      atribua papéis e configure definições individuais. Cada membro pode ter
      qualificações, preferências e disponibilidade específicas.
    </>
  ),
  features: [
    {
      title: "Adição de Membros",
      description:
        "Adicione novos membros à equipa com os seus detalhes e preferências",
    },
    {
      title: "Atribuição de Papéis",
      description: "Atribua e gira papéis e permissões dos membros",
    },
    {
      title: "Definições de Membros",
      description:
        "Configure definições e preferências individuais dos membros",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="member-management" />,
  roles: <RoleBasedHelp context="member-management" />,
};
