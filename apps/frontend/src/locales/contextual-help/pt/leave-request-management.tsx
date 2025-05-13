import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

export const leaveRequestManagementHelp: HelpSection = {
  title: "Gestão de Pedidos de Ausência",
  description: (
    <>
      Gira os seus pedidos de ausência e acompanhe o seu estado. Veja o
      histórico de pedidos, verifique o estado de aprovação e monitorize o saldo
      de dias de ausência restantes. Esta interface ajuda-o a planear e gerir o
      seu tempo livre de forma eficaz, cumprindo as políticas da empresa.
    </>
  ),
  features: [
    {
      title: "Histórico de Pedidos",
      description:
        "Veja todos os seus pedidos de ausência submetidos e o respetivo estado. Filtre e ordene pedidos por data, tipo e estado. Aceda a informações detalhadas sobre cada pedido, incluindo comentários de aprovação e documentos de suporte.",
    },
    {
      title: "Resumo de Saldo",
      description:
        "Verifique o saldo de dias de ausência restantes e a utilização da quota. Veja a repartição por tipo de ausência, acompanhe as taxas de acumulação e monitorize direitos de ausência futuros. Receba alertas quando o saldo estiver baixo.",
    },
    {
      title: "Estado do Pedido",
      description:
        "Acompanhe o estado de aprovação dos seus pedidos de ausência em tempo real. Receba notificações sobre alterações de estado e veja os motivos de aprovação/rejeição. Consulte o histórico completo do fluxo de aprovação.",
    },
    {
      title: "Calendário de Ausências",
      description:
        "Visualize os seus períodos de ausência aprovados num calendário interativo. Veja pedidos sobrepostos de colegas de equipa e identifique potenciais conflitos. Planeie as suas ausências em função dos horários da equipa.",
    },
  ],
  sections: [
    {
      title: "Submeter um Pedido de Ausência",
      content: (
        <>
          <p>Para submeter um novo pedido de ausência:</p>
          <ol>
            <li>Selecione o tipo e a duração da ausência</li>
            <li>Verifique o saldo disponível</li>
            <li>Adicione a documentação necessária</li>
            <li>Reveja a cobertura da equipa e o impacto</li>
            <li>Submeta para aprovação</li>
          </ol>
        </>
      ),
    },
    {
      title: "Boas Práticas",
      content: (
        <>
          <ul>
            <li>Submeta os pedidos com antecedência sempre que possível</li>
            <li>Consulte o calendário da equipa para potenciais conflitos</li>
            <li>Mantenha a documentação atualizada</li>
            <li>Monitorize regularmente o seu saldo de ausências</li>
            <li>Acompanhe adequadamente os pedidos pendentes</li>
          </ul>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="leave-request-management" />,
  roles: <RoleBasedHelp context="leave-request-management" />,
};
