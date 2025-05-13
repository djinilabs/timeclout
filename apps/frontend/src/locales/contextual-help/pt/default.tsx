import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const defaultHelp: HelpSection = {
  title: "Centro de Ajuda",
  description: (
    <>
      Bem-vindo ao centro de ajuda. Selecione uma secção para saber mais sobre
      as suas funcionalidades e características.
    </>
  ),
  features: [
    {
      title: "Navegação",
      description:
        "Utilize o menu de navegação para aceder a diferentes secções da aplicação.",
    },
    {
      title: "Ajuda Contextual",
      description:
        "Cada secção fornece orientação e informação específica relevante para a sua tarefa atual.",
    },
  ],
  dependencies: <FeatureDependenciesHelp />,
  roles: <RoleBasedHelp />,
};

export default defaultHelp;
