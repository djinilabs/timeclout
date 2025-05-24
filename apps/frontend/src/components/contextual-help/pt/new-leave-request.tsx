import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const newLeaveRequestHelp: HelpSection = {
  title: "Novo Pedido de Ausência",
  description: (
    <>
      Submeta um novo pedido de ausência para aprovação. Especifique o tipo de
      ausência, duração e qualquer informação adicional exigida pela política de
      ausências da sua equipa.
    </>
  ),
  features: [
    {
      title: "Seleção do Tipo de Ausência",
      description:
        "Escolha entre os tipos de ausência disponíveis de acordo com a política da sua equipa",
    },
    {
      title: "Intervalo de Datas",
      description:
        "Selecione as datas de início e fim para o seu período de ausência",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="new-leave-request" />,
  roles: <RoleBasedHelp context="new-leave-request" />,
};
