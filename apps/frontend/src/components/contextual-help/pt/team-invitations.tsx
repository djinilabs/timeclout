import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const teamInvitationsHelp: HelpSection = {
  title: "Convites da Equipa",
  description: (
    <>
      <strong>Convide novos membros</strong> para se juntarem à sua equipa e
      gere convites pendentes. Controle quem tem acesso aos horários e dados da
      sua equipa.
    </>
  ),
  features: [
    {
      title: "Enviar Convites",
      description:
        "Clique em 'Convidar Membro' para enviar convites por email com acesso à equipa",
    },
    {
      title: "Acompanhar Estado",
      description:
        "Monitore convites pendentes, aceites e expirados em tempo real",
    },
    {
      title: "Gerir Acesso",
      description:
        "Defina funções e permissões dos membros durante o processo de convite",
    },
  ],
  sections: [
    {
      title: "Como Convidar Alguém",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            1. Clique no botão <strong>"Convidar Membro"</strong>
          </p>
          <p className="text-xs text-gray-600">
            2. Introduza o <strong>endereço de email</strong> e selecione a{" "}
            <strong>função</strong>
          </p>
          <p className="text-xs text-gray-600">
            3. Escolha as <strong>permissões</strong> (visualizar, editar,
            gerir)
          </p>
          <p className="text-xs text-gray-600">
            4. Envie o convite - receberão um email com instruções de
            configuração
          </p>
        </div>
      ),
    },
    {
      title: "Estado do Convite",
      content: (
        <div className="space-y-2">
          <div className="flex items-center text-xs">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
            <span className="text-gray-600">
              <strong>Pendente:</strong> Convite enviado, à espera de resposta
            </span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-gray-600">
              <strong>Aceite:</strong> Membro juntou-se à equipa
            </span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
            <span className="text-gray-600">
              <strong>Expirado:</strong> Convite expirado (7 dias)
            </span>
          </div>
        </div>
      ),
    },
  ],
  screenshots: [
    {
      caption: "Diálogo Convidar Membro com seleção de função",
      alt: "Formulário de convite da equipa",
    },
    {
      caption: "Lista de convites pendentes com indicadores de estado",
      alt: "Vista de gestão de convites",
    },
  ],
  dependencies: <FeatureDependenciesHelp context="team-invitations" />,
  roles: <RoleBasedHelp context="team-invitations" />,
};
