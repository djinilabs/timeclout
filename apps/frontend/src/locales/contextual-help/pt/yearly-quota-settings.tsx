import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const yearlyQuotaSettingsHelp: HelpSection = {
  title: "Definições de Quota Anual",
  description: (
    <>
      Configure as quotas anuais de ausência para a sua equipa. Defina
      diferentes tipos de ausência, as suas durações e quaisquer regras ou
      restrições específicas aplicáveis.
    </>
  ),
  features: [
    {
      title: "Tipos de Ausência",
      description: "Defina diferentes tipos de ausência e as respetivas quotas",
    },
    {
      title: "Regras de Quota",
      description: "Configure regras para utilização e transferência de quotas",
    },
    {
      title: "Restrições",
      description:
        "Configure quaisquer restrições ou condições especiais para as ausências",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="yearly-quota-settings" />,
  roles: <RoleBasedHelp context="yearly-quota-settings" />,
};
