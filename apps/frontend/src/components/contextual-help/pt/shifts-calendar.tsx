import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const shiftsCalendarHelp: HelpSection = {
  title: "Gestão de Turnos",
  description: (
    <>
      Organize os horários de trabalho da equipa de forma eficaz. Crie e gira
      posições de turno garantindo uma cobertura adequada. O calendário mostra
      os turnos para o mês selecionado, com atualização automática para se
      manter atualizado. Utilize esta interface para manter níveis ótimos de
      pessoal e coordenar os horários da equipa.
    </>
  ),
  features: [
    {
      title: "Filtragem por intervalo de datas",
      description:
        "Visualize turnos dentro de datas de início e fim específicas. Utilize o seletor de datas para navegar entre meses e selecionar intervalos de datas personalizados para um planeamento focado.",
    },
    {
      title: "Atualizações em tempo real",
      description:
        "A atualização automática mantém o horário atual. As alterações feitas pelos membros da equipa são refletidas imediatamente, garantindo que todos tenham acesso à informação mais recente do horário.",
    },
    {
      title: "Gestão de posições",
      description:
        "Crie e edite posições de turno com detalhes personalizados, incluindo requisitos de função, horários e qualificações necessárias. Atribua membros da equipa às posições com base na sua disponibilidade e competências.",
    },
    {
      title: "Navegação no calendário",
      description:
        "Navegue facilmente entre meses e semanas utilizando controlos intuitivos. Amplie/reduza para visualizar diferentes períodos de tempo e obter uma melhor visão geral do horário.",
    },
    {
      title: "Atribuição de turnos",
      description:
        "Arraste e solte membros da equipa para os atribuir aos turnos. O sistema verifica automaticamente conflitos e requisitos de qualificação.",
    },
  ],
  sections: [
    {
      title: "Começar",
      content: (
        <>
          <p>Para começar a gerir turnos:</p>
          <ol>
            <li>
              Selecione o intervalo de datas desejado utilizando o seletor de
              datas
            </li>
            <li>Reveja os turnos e posições existentes</li>
            <li>Crie novas posições ou modifique as existentes</li>
            <li>Atribua membros da equipa aos turnos</li>
          </ol>
        </>
      ),
    },
    {
      title: "Boas Práticas",
      content: (
        <>
          <ul>
            <li>
              Planeie os turnos com pelo menos duas semanas de antecedência
            </li>
            <li>
              Considere as qualificações e preferências dos membros da equipa
            </li>
            <li>Mantenha uma distribuição equilibrada da carga de trabalho</li>
            <li>Reveja e atualize regularmente o horário</li>
          </ul>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="shifts-calendar" />,
  roles: <RoleBasedHelp />,
};
