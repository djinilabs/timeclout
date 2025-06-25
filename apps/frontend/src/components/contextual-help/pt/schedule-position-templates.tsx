import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const schedulePositionTemplatesHelp: HelpSection = {
  title: "Modelos de Posições de Horário",
  description: (
    <>
      Visualize e gere <strong>modelos para posições de horário</strong>. Estes
      modelos são criados no diálogo <em>"Adicionar Posição"</em> da secção
      Calendário de Turnos e são utilizados para manter{" "}
      <u>consistência na criação de turnos</u>. Cada modelo inclui um nome e cor
      para fácil identificação, facilitando o preenchimento de posições com{" "}
      <strong>membros da equipa qualificados</strong>.
    </>
  ),
  features: [
    {
      title: "Visão Geral de Modelos",
      description: (
        <>
          Visualize todos os modelos de posições criados no{" "}
          <strong>Calendário de Turnos</strong>. Estes modelos servem como{" "}
          <em>base para criar turnos</em> e atribuir membros da equipa.
        </>
      ),
    },
    {
      title: "Codificação por Cores",
      description: (
        <>
          Cada tipo de posição tem uma <strong>cor distinta</strong> para
          identificação rápida no horário. As cores são atribuídas ao{" "}
          <em>criar posições</em> no Calendário de Turnos.
        </>
      ),
    },
    {
      title: "Gestão de Modelos",
      description: (
        <>
          Revise e gere <strong>modelos de posições existentes</strong>. Note
          que novos modelos devem ser criados no diálogo{" "}
          <u>'Adicionar Posição'</u> da secção Calendário de Turnos.
        </>
      ),
    },
    {
      title: "Pré-visualização Visual",
      description: (
        <>
          Veja como cada modelo de posição aparece no horário com a sua{" "}
          <em>cor e nome atribuídos</em>. Isto ajuda a manter{" "}
          <strong>consistência</strong> no horário da equipa.
        </>
      ),
    },
  ],
  sections: [
    {
      title: "Criar Novos Modelos de Posições",
      content: (
        <>
          <p>Para criar novos modelos de posições:</p>
          <ol>
            <li>
              Navegue para a secção <strong>Calendário de Turnos</strong>
            </li>
            <li>
              Clique em <em>"Adicionar Posição"</em> na vista do calendário
            </li>
            <li>
              Introduza um <strong>nome descritivo</strong> para a posição
            </li>
            <li>
              Selecione uma <em>cor</em> do seletor de cores
            </li>
            <li>
              <u>Guarde</u> o novo modelo de posição
            </li>
          </ol>
          <p className="mt-2">
            O novo modelo aparecerá automaticamente nesta página de
            configurações e estará disponível para uso na{" "}
            <strong>criação futura de turnos</strong>.
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
              Use <strong>nomes claros e descritivos</strong> para modelos de
              posições
            </li>
            <li>
              Escolha <em>cores distintas</em> para diferentes tipos de posições
            </li>
            <li>
              Mantenha nomes de modelos <u>consistentes</u> com terminologia da
              equipa
            </li>
            <li>
              Revise e atualize regularmente modelos conforme{" "}
              <em>necessidades da equipa mudam</em>
            </li>
            <li>
              Considere criar modelos para todos os{" "}
              <strong>tipos de posições comuns</strong>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Configurar Modelos de Posições de Horário e Modelos de Dia",
      content: (
        <>
          <p>
            <strong>Modelos de Posições de Horário</strong> permitem-lhe definir
            funções ou posições reutilizáveis (ex: <em>"Enfermeiro"</em>,{" "}
            <em>"Rececionista"</em>,<em>"Supervisor"</em>) com a sua própria
            cor, <strong>competências necessárias</strong> e horários de turno
            padrão. Crie estes no diálogo <u>"Adicionar Posição"</u> no
            Calendário de Turnos. Use nomes claros e cores distintas para fácil
            identificação.
          </p>
          <p className="mt-2">
            <strong>Modelos de Dia de Horário</strong> são coleções de modelos
            de posições que representam um dia de trabalho típico (ex:{" "}
            <em>"Dia Útil Padrão"</em>, <em>"Cobertura de Fim de Semana"</em>).
            Pode criar e gerir modelos de dia na{" "}
            <strong>secção Modelos de Dia</strong>. Arraste e largue modelos de
            posições para construir um modelo de dia, depois arraste modelos de
            dia para o calendário para preencher rapidamente uma{" "}
            <u>semana ou mês</u>.
          </p>
          <p className="mt-2">
            <strong>Boas Práticas:</strong> Revise regularmente os seus modelos
            para garantir que correspondem às{" "}
            <em>necessidades da sua equipa</em>. Use modelos de dia para{" "}
            <strong>acelerar o agendamento</strong> e manter consistência.
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
