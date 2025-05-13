import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const teamInvitationsHelp: HelpSection = {
  title: "Convites para a Equipa",
  description: (
    <>
      Gira os convites para membros da equipa. Envie convites para novos
      membros, acompanhe convites pendentes e gira o acesso à equipa.
    </>
  ),
  features: [
    {
      title: "Enviar Convites",
      description: "Convide novos membros para se juntarem à sua equipa",
    },
    {
      title: "Gestão de Convites",
      description: "Acompanhe e gira convites pendentes",
    },
    {
      title: "Controlo de Acesso",
      description: "Configure papéis e permissões dos membros",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="team-invitations" />,
  roles: <RoleBasedHelp context="team-invitations" />,
};
