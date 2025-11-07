import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";
import { HelpSection } from "../types";

export const teamLeaveCalendarHelp: HelpSection = {
  title: "Calendário de Ausências da Equipa",
  description: (
    <>
      Veja e Gira os pedidos de ausência dos membros da equipa num formato de
      calendário. Acompanhe pedidos de ausência aprovados e pendentes, e garanta
      uma cobertura adequada durante as ausências dos membros da equipa.
    </>
  ),
  features: [
    {
      title: "Resumo de Ausências",
      description:
        "Veja todos os pedidos de ausência dos membros da equipa numa vista de calendário",
    },
    {
      title: "Gestão de Pedidos",
      description: "Aprove ou rejeite pedidos de ausência e gira conflitos",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="team-leave-calendar" />,
  roles: <RoleBasedHelp context="team-leave-calendar" />,
};
