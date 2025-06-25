import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const leaveRequestManagementHelp: HelpSection = {
  title: "Gestão Abrangente de Pedidos de Licença",
  description: (
    <>
      Simplifique e otimize o <strong>processo de gestão de licenças</strong> da
      sua equipa. Este sistema abrangente permite-lhe submeter, acompanhar,
      aprovar e gerir pedidos de licença eficientemente garantindo{" "}
      <em>conformidade com políticas da empresa</em>e{" "}
      <u>regulamentações laborais</u>. Desde pedidos individuais até planeamento
      de licenças da equipa, o TT3 fornece todas as ferramentas necessárias para{" "}
      <strong>gestão eficaz de tempo livre</strong>.
    </>
  ),
  features: [
    {
      title: "Submissão Inteligente de Pedidos",
      description: (
        <>
          Submeta pedidos de licença com <strong>informação detalhada</strong>{" "}
          incluindo tipo de licença, datas, duração e razões. O sistema valida
          automaticamente pedidos contra <em>quotas disponíveis</em>, políticas
          da equipa e <u>conflitos de agendamento</u> para garantir
          processamento suave.
        </>
      ),
    },
    {
      title: "Fluxos de Trabalho de Aprovação Automatizados",
      description: (
        <>
          Processos de aprovação simplificados com{" "}
          <strong>encaminhamento automático</strong> para gestores apropriados
          baseado na estrutura da equipa e políticas de licença. O sistema
          acompanha <em>estado de aprovação</em>, envia notificações e garante{" "}
          <u>processamento atempado</u> de todos os pedidos.
        </>
      ),
    },
    {
      title: "Acompanhamento Abrangente de Pedidos",
      description: (
        <>
          Acompanhe o estado de todos os pedidos de licença desde{" "}
          <strong>submissão até aprovação/rejeição</strong>. Visualize histórico
          de pedidos, <em>cronogramas de aprovação</em> e quaisquer modificações
          feitas durante o processo. Mantenha{" "}
          <u>rastos de auditoria completos</u> para conformidade e
          transparência.
        </>
      ),
    },
    {
      title: "Gestão e Validação de Quotas",
      description: (
        <>
          Validação automática de pedidos de licença contra{" "}
          <strong>quotas individuais e da equipa</strong>. O sistema previne{" "}
          <em>sobre-alocação</em>, acompanha utilização de quotas e fornece
          visibilidade clara dos <u>saldos de licença disponíveis</u> para todos
          os membros da equipa.
        </>
      ),
    },
    {
      title: "Deteção e Resolução de Conflitos",
      description: (
        <>
          Identifique e resolva <strong>conflitos de agendamento</strong> entre
          pedidos de licença e atribuições de trabalho. O sistema alerta
          gestores sobre <em>problemas potenciais de cobertura</em> e sugere
          soluções para manter <u>continuidade operacional</u>.
        </>
      ),
    },
    {
      title: "Conformidade de Políticas e Relatórios",
      description: (
        <>
          Garanta que todos os pedidos de licença cumprem{" "}
          <strong>políticas da empresa</strong>, regulamentações laborais e
          regras específicas da equipa. Gere relatórios abrangentes sobre{" "}
          <em>padrões de licença</em>, taxas de aprovação e{" "}
          <u>conformidade de políticas</u> para revisão da gestão.
        </>
      ),
    },
  ],
  sections: [
    {
      title: "Processo de Pedido de Licença",
      content: (
        <>
          <p>
            Siga este processo simplificado para gestão eficaz de pedidos de
            licença:
          </p>
          <ol className="space-y-2">
            <li>
              <strong>Submeter Pedido:</strong> Complete o formulário de pedido
              de licença com toda a <em>informação necessária</em> incluindo
              datas, tipo de licença e razão para o pedido
            </li>
            <li>
              <strong>Validação do Sistema:</strong> O sistema valida
              automaticamente o pedido contra <strong>quotas, políticas</strong>{" "}
              e conflitos de agendamento
            </li>
            <li>
              <strong>Revisão do Gestor:</strong> Gestores apropriados revêem o
              pedido baseado na <em>estrutura da equipa</em> e fluxos de
              trabalho de aprovação
            </li>
            <li>
              <strong>Aprovação/Rejeição:</strong> Gestores aprovam ou rejeitam
              pedidos com <u>comentários e justificação</u> para transparência
            </li>
            <li>
              <strong>Notificação e Atualizações:</strong> Todas as partes
              recebem notificações sobre <em>alterações de estado do pedido</em>{" "}
              e quaisquer ações necessárias
            </li>
            <li>
              <strong>Integração de Horário:</strong> Pedidos aprovados são
              automaticamente integrados nos <strong>horários da equipa</strong>{" "}
              e calendários de licença
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Boas Práticas para Gestão de Licenças",
      content: (
        <>
          <ul className="space-y-2">
            <li>
              <strong>Submissão Antecipada:</strong> Submeta pedidos de licença{" "}
              <u>com antecedência</u> para permitir planeamento adequado e
              processamento de aprovação
            </li>
            <li>
              <strong>Comunicação Clara:</strong> Forneça{" "}
              <em>razões detalhadas</em> e contexto para pedidos de licença para
              facilitar tomada de decisões informada
            </li>
            <li>
              <strong>Consciência de Políticas:</strong> Familiarize-se com{" "}
              <strong>políticas de licença da equipa e empresa</strong> para
              garantir que os pedidos cumprem todos os requisitos
            </li>
            <li>
              <strong>Monitorização de Quotas:</strong> Verifique regularmente o
              seu <em>saldo de licença</em> e utilização de quotas para planear
              tempo livre eficazmente
            </li>
            <li>
              <strong>Respostas Atempadas:</strong> Gestores devem responder aos
              pedidos de licença <u>promptamente</u> para manter planeamento da
              equipa e moral
            </li>
            <li>
              <strong>Documentação:</strong> Mantenha registos de todos os{" "}
              <strong>pedidos de licença e aprovações</strong> para conformidade
              e referência futura
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Gerir Pedidos de Licença Eficazmente",
      content: (
        <>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-800">
                Para Membros da Equipa
              </h5>
              <p className="text-sm text-gray-600">
                Submeta pedidos <em>cedo</em>, forneça{" "}
                <strong>razões claras</strong> e monitore o seu saldo de quotas.
                Comunique com o seu gestor sobre quaisquer{" "}
                <u>circunstâncias especiais</u> ou pedidos urgentes.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">Para Gestores</h5>
              <p className="text-sm text-gray-600">
                Revistam pedidos <strong>promptamente</strong>, considerem{" "}
                <em>necessidades de cobertura da equipa</em> e forneçam feedback
                claro. Equilibrem necessidades individuais com
                <u>requisitos operacionais</u>.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Para Administradores
              </h5>
              <p className="text-sm text-gray-600">
                Monitorem <em>padrões de licença</em>, garantam{" "}
                <strong>conformidade de políticas</strong> e otimizem fluxos de
                trabalho de aprovação. Usem análises para identificar tendências
                e melhorar processos.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Resolução de Conflitos
              </h5>
              <p className="text-sm text-gray-600">
                Abordem <strong>conflitos de agendamento</strong> proativamente
                trabalhando com membros da equipa para encontrar{" "}
                <em>soluções alternativas</em> ou ajustar timing do pedido.
              </p>
            </div>
          </div>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="leave-request-management" />,
  roles: <RoleBasedHelp context="leave-request-management" />,
};
