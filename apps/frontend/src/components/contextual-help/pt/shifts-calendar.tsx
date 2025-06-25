import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const shiftsCalendarHelp: HelpSection = {
  title: "Gestão e Agendamento de Turnos",
  description: (
    <>
      O{" "}
      <strong>coração do sistema de gestão de força de trabalho do TT3</strong>.
      Crie, organize e gere horários de trabalho da equipa com{" "}
      <em>precisão e eficiência</em>. Esta interface de calendário abrangente
      permite visualizar <strong>turnos ao longo de períodos de tempo</strong>,
      atribuir membros da equipa com base em <u>qualificações</u>, e garantir{" "}
      <strong>cobertura ideal</strong> para as suas operações. O sistema
      atualiza automaticamente em <em>tempo real</em>, mantendo todos informados
      sobre alterações de horário.
    </>
  ),
  features: [
    {
      title: "Gestão Inteligente de Intervalos de Datas",
      description: (
        <>
          Navegue facilmente entre{" "}
          <strong>meses, semanas e intervalos de datas personalizados</strong>.
          Utilize o seletor de datas intuitivo para focar em períodos
          específicos para <em>planeamento detalhado</em> ou obter uma visão
          geral de <strong>horários a longo prazo</strong>. Perfeito tanto para{" "}
          <u>planeamento operacional a curto prazo</u> como para{" "}
          <u>agendamento estratégico a longo prazo</u>.
        </>
      ),
    },
    {
      title: "Sincronização em Tempo Real",
      description: (
        <>
          Experimente atualizações verdadeiramente{" "}
          <strong>em tempo real</strong> com sondagem automática que mantém os
          horários atuais em todos os membros da equipa. As alterações feitas
          por qualquer <em>utilizador autorizado</em> são{" "}
          <u>refletidas instantaneamente</u>, eliminando confusão e garantindo
          que todos trabalhem com a informação mais atualizada.{" "}
          <strong>Não é necessário atualizar manualmente</strong>.
        </>
      ),
    },
    {
      title: "Gestão Avançada de Posições",
      description: (
        <>
          Crie posições de turno sofisticadas com especificações detalhadas
          incluindo <strong>requisitos de função</strong>, <em>horários</em>,{" "}
          <u>pré-requisitos de qualificação</u> e notas personalizadas. Cada
          posição pode ter <strong>requisitos únicos</strong>, facilitando a
          garantia de que a{" "}
          <em>pessoa certa é atribuída à função certa na altura certa</em>.
        </>
      ),
    },
    {
      title: "Navegação Flexível no Calendário",
      description: (
        <>
          Navegue pelo seu horário com facilidade utilizando{" "}
          <strong>controlos de zoom intuitivos</strong> e seletores de período
          de tempo. Alterne entre{" "}
          <em>visualizações diárias, semanais e mensais</em> para corresponder
          às suas necessidades de planeamento. O{" "}
          <strong>design responsivo</strong> adapta-se a diferentes tamanhos de
          ecrã para visualização ideal em qualquer dispositivo.
        </>
      ),
    },
    {
      title: "Sistema de Atribuição Drag-and-Drop",
      description: (
        <>
          Atribua intuitivamente membros da equipa aos turnos utilizando a nossa{" "}
          <strong>interface drag-and-drop</strong>. O sistema valida
          automaticamente as atribuições contra{" "}
          <u>requisitos de qualificação</u>,{" "}
          <em>conflitos de disponibilidade</em> e{" "}
          <strong>regras de distribuição de carga de trabalho</strong>. O
          feedback visual ajuda-o a tomar{" "}
          <em>decisões de atribuição informadas</em> rapidamente.
        </>
      ),
    },
    {
      title: "Deteção e Resolução de Conflitos",
      description: (
        <>
          Identifique e sinalize automaticamente conflitos de agendamento
          incluindo <u>reservas duplas</u>,{" "}
          <strong>incompatibilidades de qualificação</strong> e{" "}
          <em>violações de períodos de descanso</em>. O sistema fornece{" "}
          <strong>avisos claros e sugestões</strong> para ajudar a resolver
          problemas antes de se tornarem problemas.
        </>
      ),
    },
  ],
  sections: [
    {
      title: "Começar com a Gestão de Turnos",
      content: (
        <>
          <p>
            Siga estes passos para gerir eficazmente os turnos da sua equipa:
          </p>
          <ol className="space-y-2">
            <li>
              <strong>Defina o Seu Período:</strong> Utilize o seletor de datas
              para selecionar o seu período de planeamento - seja a{" "}
              <em>semana atual</em>, <em>próximo mês</em>, ou um{" "}
              <strong>intervalo personalizado</strong>
            </li>
            <li>
              <strong>Reveja o Estado Atual:</strong> Examine os turnos e
              posições existentes para entender a <em>cobertura atual</em> e
              identificar <u>lacunas</u>
            </li>
            <li>
              <strong>Crie ou Modifique Posições:</strong> Adicione novas
              posições de turno ou edite as existentes com{" "}
              <strong>requisitos específicos</strong> e <em>horários</em>
            </li>
            <li>
              <strong>Atribua Membros da Equipa:</strong> Atribua{" "}
              <u>membros da equipa qualificados</u> para turnos apropriados,
              garantindo <strong>cobertura adequada</strong>
            </li>
            <li>
              <strong>Valide e Publique:</strong> Reveja o horário completo para
              <em>conflitos</em> e <u>publique quando estiver pronto</u>
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Estratégias Avançadas de Agendamento",
      content: (
        <>
          <ul className="space-y-2">
            <li>
              <strong>Planeamento Proativo:</strong> Planeie turnos com pelo
              menos <u>duas semanas de antecedência</u> para permitir
              planeamento dos membros da equipa e reduzir{" "}
              <em>alterações de última hora</em>
            </li>
            <li>
              <strong>Correspondência de Qualificações:</strong> Sempre garanta
              que os membros da equipa atribuídos aos turnos tenham as{" "}
              <strong>qualificações necessárias</strong> e<em>certificações</em>
            </li>
            <li>
              <strong>Equilíbrio de Carga de Trabalho:</strong> Monitore e
              mantenha <em>distribuição justa</em> de turnos entre membros da
              equipa para prevenir <u>esgotamento</u> e garantir{" "}
              <strong>equidade</strong>
            </li>
            <li>
              <strong>Conformidade com Períodos de Descanso:</strong> Respeite
              <u>períodos mínimos de descanso</u> entre turnos para cumprir{" "}
              <strong>regulamentações laborais</strong> e manter o bem-estar da
              equipa
            </li>
            <li>
              <strong>Revisões Regulares:</strong> Realize{" "}
              <em>revisões semanais de horário</em> para identificar padrões,
              otimizar eficiência e abordar{" "}
              <strong>problemas recorrentes</strong>
            </li>
            <li>
              <strong>Comunicação:</strong> Utilize as{" "}
              <u>funcionalidades de notificação</u> do sistema para manter os
              membros da equipa informados sobre alterações e atualizações de
              horário
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Resolução de Problemas Comuns",
      content: (
        <>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-800">
                Nenhum Membro da Equipa Qualificado Disponível
              </h5>
              <p className="text-sm text-gray-600">
                Verifique se os membros da equipa têm as{" "}
                <strong>qualificações necessárias</strong> atribuídas. Considere
                ajustar temporariamente os <em>requisitos de qualificação</em>{" "}
                ou <u>formar membros da equipa</u> para competências
                necessárias.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Conflitos de Agendamento Detetados
              </h5>
              <p className="text-sm text-gray-600">
                Reveja os <strong>detalhes do conflito</strong> e ajuste as
                atribuições. Considere utilizar a{" "}
                <em>funcionalidade de preenchimento automático</em> para
                encontrar soluções ótimas automaticamente.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Cobertura Insuficiente
              </h5>
              <p className="text-sm text-gray-600">
                Analise a <em>disponibilidade</em> da sua equipa e considere
                ajustar <strong>horários de turno</strong>, adicionar{" "}
                <u>posições temporárias</u>, ou solicitar membros adicionais da
                equipa.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Publicação de Horários e Controlo de Versões",
      content: (
        <>
          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-gray-800">
                Fluxo de Trabalho de Publicação de Horários
              </h5>
              <p className="text-sm text-gray-600">
                Quando faz alterações aos turnos, elas são marcadas como{" "}
                <strong>"não publicadas"</strong> até que as publique
                explicitamente. Isto permite-lhe trabalhar nos horários sem
                afetar a <em>versão ativa</em> que os membros da equipa veem.
                Use o <u>botão de publicação</u> para tornar as suas alterações
                visíveis para a equipa.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Publicação para Intervalos de Datas
              </h5>
              <p className="text-sm text-gray-600">
                Pode publicar horários para{" "}
                <strong>intervalos de datas específicos</strong> (ex: uma
                semana, mês, ou período personalizado). Isto dá-lhe{" "}
                <em>controlo sobre quando as alterações se tornam visíveis</em>{" "}
                e permite <u>implementações graduais</u> de atualizações de
                horário. Selecione o seu intervalo de datas desejado e publique
                apenas essas datas.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Reverter para Versão Publicada
              </h5>
              <p className="text-sm text-gray-600">
                Se precisar de desfazer alterações e regressar à{" "}
                <strong>última versão publicada</strong>, use a opção{" "}
                <u>"Reverter para publicado"</u>. Isto irá descartar todas as
                alterações não publicadas e restaurar o horário ao seu último
                estado publicado. Isto é útil para <em>corrigir erros</em> ou
                quando alterações precisam de ser revistas mais.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Boas Práticas para Publicação
              </h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • Reveja todas as alterações antes de publicar para garantir
                  precisão
                </li>
                <li>
                  • Publique horários com antecedência para que os membros da
                  equipa possam planear adequadamente
                </li>
                <li>
                  • Use publicação por intervalo de datas para implementações
                  graduais de alterações importantes
                </li>
                <li>
                  • Comunique com a sua equipa quando publicar alterações
                  significativas de horário
                </li>
                <li>
                  • Mantenha alterações não publicadas mínimas para evitar
                  confusão
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Compreender o Estado de Publicação
              </h5>
              <p className="text-sm text-gray-600">
                O indicador de estado de publicação mostra se a sua vista atual
                tem alterações não publicadas. Um estado verde "Publicado"
                significa que todas as alterações estão ativas, enquanto um
                estado laranja "Não Publicado" indica que tem alterações
                pendentes que precisam de ser publicadas ou revertidas.
              </p>
            </div>
          </div>
        </>
      ),
    },
  ],
  dependencies: <FeatureDependenciesHelp context="shifts-calendar" />,
  roles: <RoleBasedHelp context="shifts-calendar" />,
};
