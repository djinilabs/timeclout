import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const timeOffDashboardHelp: HelpSection = {
  title: "Painel de Ausências",
  description: (
    <>
      Veja e Gira as ausências em toda a organização. Monitorize saldos de dias
      de ausência, ausências futuras e cobertura da equipa para garantir o bom
      funcionamento das operações.
    </>
  ),
  features: [
    {
      title: "Resumo de Ausências",
      description:
        "Veja todos os pedidos de ausência aprovados e pendentes em todas as equipas",
    },
    {
      title: "Acompanhamento de Saldos",
      description:
        "Monitorize os saldos de dias de ausência e quotas dos membros da equipa",
    },
    {
      title: "Planeamento de Cobertura",
      description:
        "Planeie a cobertura da equipa durante as ausências dos membros",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="time-off-dashboard" />,
  roles: <RoleBasedHelp context="time-off-dashboard" />,
};
