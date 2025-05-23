import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const companyDashboardHelp: HelpSection = {
  title: "Painel da Empresa",
  description: (
    <>
      Bem-vindo ao painel da sua empresa. Aqui pode gerir as unidades, equipas e
      definições gerais da sua empresa. Este é o centro de todas as operações a
      nível da empresa.
    </>
  ),
  features: [
    {
      title: "Gestão de Unidades",
      description: "Crie e gira unidades de negócio dentro da sua empresa",
    },
    {
      title: "Visão Geral das Equipas",
      description:
        "Veja todas as equipas em diferentes unidades e o seu estado atual",
    },
    {
      title: "Definições da Empresa",
      description: "Configure políticas e preferências a nível da empresa",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="company-dashboard" />,
  roles: <RoleBasedHelp context="company-dashboard" />,
};
