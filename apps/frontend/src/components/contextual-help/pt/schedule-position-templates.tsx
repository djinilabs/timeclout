import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const schedulePositionTemplatesHelp: HelpSection = {
  title: "Modelos de Posição de Horário",
  description: (
    <>
      Visualize e gira modelos para posições de horário. Estes modelos são
      criados no diálogo "Adicionar Posição" da secção Calendário de Turnos e
      são utilizados para manter a consistência na criação de turnos. Cada
      modelo inclui um nome e uma cor para fácil identificação, facilitando o
      preenchimento de posições com membros da equipa qualificados.
    </>
  ),
  features: [
    {
      title: "Visão Geral dos Modelos",
      description:
        "Visualize todos os modelos de posição criados no Calendário de Turnos. Estes modelos servem como base para criar turnos e atribuir membros da equipa.",
    },
    {
      title: "Codificação por Cores",
      description:
        "Cada tipo de posição tem uma cor distinta para rápida identificação no horário. As cores são atribuídas ao criar posições no Calendário de Turnos.",
    },
    {
      title: "Gestão de Modelos",
      description:
        "Reveja e Gira os modelos de posição existentes. Note que novos modelos devem ser criados no diálogo 'Adicionar Posição' da secção Calendário de Turnos.",
    },
    {
      title: "Pré-visualização Visual",
      description:
        "Veja como cada modelo de posição aparece no horário com a sua cor e nome atribuídos. Isto ajuda a manter a consistência no horário da equipa.",
    },
  ],
  sections: [
    {
      title: "Criar Novos Modelos de Posição",
      content: (
        <>
          <p>Para criar novos modelos de posição:</p>
          <ol>
            <li>Navegue até à secção Calendário de Turnos</li>
            <li>Clique em "Adicionar Posição" na vista do calendário</li>
            <li>Introduza um nome descritivo para a posição</li>
            <li>Selecione uma cor no seletor de cores</li>
            <li>Guarde o novo modelo de posição</li>
          </ol>
          <p className="mt-2">
            O novo modelo aparecerá automaticamente nesta página de definições e
            estará disponível para utilização na criação futura de turnos.
          </p>
        </>
      ),
    },
    {
      title: "Boas Práticas",
      content: (
        <>
          <ul>
            <li>
              Utilize nomes claros e descritivos para os modelos de posição
            </li>
            <li>Escolha cores distintas para diferentes tipos de posição</li>
            <li>
              Mantenha os nomes dos modelos consistentes com a terminologia da
              equipa
            </li>
            <li>
              Reveja e atualize regularmente os modelos à medida que as
              necessidades da equipa mudam
            </li>
            <li>
              Considere criar modelos para todos os tipos de posição comuns
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Configuração de Modelos de Posição e Modelos de Dia",
      content: (
        <>
          <p>
            <strong>Modelos de Posição de Horário</strong> permitem definir
            funções reutilizáveis (ex: "Enfermeiro", "Rececionista",
            "Supervisor") com cor, competências e horários padrão. Crie estes
            modelos no diálogo "Adicionar Posição" do Calendário de Turnos. Use
            nomes claros e cores distintas para fácil identificação.
          </p>
          <p className="mt-2">
            <strong>Modelos de Dia de Horário</strong> são conjuntos de modelos
            de posição que representam um dia típico (ex: "Dia Útil", "Cobertura
            de Fim de Semana"). Pode criar e gerir modelos de dia na secção de
            Modelos de Dia. Arraste modelos de posição para construir um modelo
            de dia e depois arraste modelos de dia para o calendário para
            preencher rapidamente uma semana ou mês.
          </p>
          <p className="mt-2">
            <strong>Boas Práticas:</strong> Reveja regularmente os seus modelos
            para garantir que refletem as necessidades da equipa. Use modelos de
            dia para acelerar o agendamento e manter a consistência.
          </p>
        </>
      ),
    },
  ],
  dependencies: (
    <FeatureDependenciesHelp context="schedule-position-templates" />
  ),
  roles: <RoleBasedHelp context="schedule-position-templates" />,
};
