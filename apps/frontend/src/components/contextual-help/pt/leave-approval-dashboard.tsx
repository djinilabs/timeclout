import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";
import { HelpSection } from "../types";

export const leaveApprovalDashboardHelp: HelpSection = {
  title: "Painel de Aprovação de Ausências",
  description: (
    <>
      Reveja e gira pedidos de ausência pendentes. Aprove ou rejeite pedidos com
      base na cobertura da equipa e no cumprimento das políticas.
    </>
  ),
  features: [
    {
      title: "Revisão de Pedidos",
      description: "Reveja pedidos de ausência pendentes e os seus detalhes",
    },
    {
      title: "Verificação de Cobertura",
      description:
        "Verifique a cobertura da equipa durante os períodos de ausência pedidos",
    },
    {
      title: "Cumprimento de Políticas",
      description:
        "Verifique os pedidos em relação às políticas de ausência da equipa",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="leave-approval-dashboard" />,
  roles: <RoleBasedHelp context="leave-approval-dashboard" />,
};
