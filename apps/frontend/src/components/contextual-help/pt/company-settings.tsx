import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";
import { HelpSection } from "../types";

export const companySettingsHelp: HelpSection = {
  title: "Definições da Empresa",
  description: (
    <>
      Gira as definições e preferências da sua empresa. Configure políticas a
      nível da empresa, papéis de utilizador e outras definições
      organizacionais.
    </>
  ),
  features: [
    {
      title: "Perfil da Empresa",
      description: "Atualize as informações e imagem da empresa",
    },
    {
      title: "Gestão de Utilizadores",
      description: "Gira papéis e permissões de utilizadores em toda a empresa",
    },
    {
      title: "Definições de Políticas",
      description: "Configure políticas e preferências a nível da empresa",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="company-settings" />,
  roles: <RoleBasedHelp context="company-settings" />,
};
