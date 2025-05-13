import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp";
import { RoleBasedHelp } from "../components/RoleBasedHelp";

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
  ],
  dependencies: (
    <FeatureDependenciesHelp context="schedule-position-templates" />
  ),
  roles: <RoleBasedHelp context="schedule-position-templates" />,
};
