import { HelpSection } from "../types";
import { FeatureDependenciesHelp } from "../components/FeatureDependenciesHelp.pt";
import { RoleBasedHelp } from "../components/RoleBasedHelp.pt";

export const shiftsCalendarHelp: HelpSection = {
  title: "Gestão e Agendamento de Turnos",
  description: (
    <>
      O coração do sistema de gestão de força de trabalho do TT3. Crie, organize
      e gere horários de trabalho da equipa com precisão e eficiência. Esta
      interface de calendário abrangente permite visualizar turnos ao longo de
      períodos de tempo, atribuir membros da equipa com base em qualificações, e
      garantir cobertura ideal para as suas operações. O sistema atualiza
      automaticamente em tempo real, mantendo todos informados sobre alterações
      de horário.
    </>
  ),
  features: [
    {
      title: "Gestão Inteligente de Intervalos de Datas",
      description:
        "Navegue facilmente entre meses, semanas e intervalos de datas personalizados. Utilize o seletor de datas intuitivo para focar em períodos específicos para planeamento detalhado ou obter uma visão geral de horários a longo prazo. Perfeito tanto para planeamento operacional a curto prazo como para agendamento estratégico a longo prazo.",
    },
    {
      title: "Sincronização em Tempo Real",
      description:
        "Experimente atualizações verdadeiramente em tempo real com sondagem automática que mantém os horários atuais em todos os membros da equipa. As alterações feitas por qualquer utilizador autorizado são refletidas instantaneamente, eliminando confusão e garantindo que todos trabalhem com a informação mais atualizada. Não é necessário atualizar manualmente.",
    },
    {
      title: "Gestão Avançada de Posições",
      description:
        "Crie posições de turno sofisticadas com especificações detalhadas incluindo requisitos de função, horários, pré-requisitos de qualificação e notas personalizadas. Cada posição pode ter requisitos únicos, facilitando a garantia de que a pessoa certa é atribuída à função certa na altura certa.",
    },
    {
      title: "Navegação Flexível no Calendário",
      description:
        "Navegue pelo seu horário com facilidade utilizando controlos de zoom intuitivos e seletores de período de tempo. Alterne entre visualizações diárias, semanais e mensais para corresponder às suas necessidades de planeamento. O design responsivo adapta-se a diferentes tamanhos de ecrã para visualização ideal em qualquer dispositivo.",
    },
    {
      title: "Sistema de Atribuição Drag-and-Drop",
      description:
        "Atribua intuitivamente membros da equipa aos turnos utilizando a nossa interface drag-and-drop. O sistema valida automaticamente as atribuições contra requisitos de qualificação, conflitos de disponibilidade e regras de distribuição de carga de trabalho. O feedback visual ajuda-o a tomar decisões de atribuição informadas rapidamente.",
    },
    {
      title: "Deteção e Resolução de Conflitos",
      description:
        "Identifique e sinalize automaticamente conflitos de agendamento incluindo reservas duplas, incompatibilidades de qualificação e violações de períodos de descanso. O sistema fornece avisos claros e sugestões para ajudar a resolver problemas antes de se tornarem problemas.",
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
              para selecionar o seu período de planeamento - seja a semana
              atual, o próximo mês, ou um intervalo personalizado
            </li>
            <li>
              <strong>Reveja o Estado Atual:</strong> Examine os turnos e
              posições existentes para entender a cobertura atual e identificar
              lacunas
            </li>
            <li>
              <strong>Crie ou Modifique Posições:</strong> Adicione novas
              posições de turno ou edite as existentes com requisitos
              específicos e horários
            </li>
            <li>
              <strong>Atribua Membros da Equipa:</strong> Atribua membros da
              equipa qualificados para turnos apropriados, garantindo cobertura
              adequada
            </li>
            <li>
              <strong>Valide e Publique:</strong> Reveja o horário completo para
              conflitos e publique quando estiver pronto
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
              menos duas semanas de antecedência para permitir planeamento dos
              membros da equipa e reduzir alterações de última hora
            </li>
            <li>
              <strong>Correspondência de Qualificações:</strong> Sempre garanta
              que os membros da equipa atribuídos aos turnos tenham as
              qualificações e certificações necessárias
            </li>
            <li>
              <strong>Equilíbrio de Carga de Trabalho:</strong> Monitore e
              mantenha distribuição justa de turnos entre membros da equipa para
              prevenir esgotamento e garantir equidade
            </li>
            <li>
              <strong>Conformidade com Períodos de Descanso:</strong> Respeite
              períodos mínimos de descanso entre turnos para cumprir
              regulamentações laborais e manter o bem-estar da equipa
            </li>
            <li>
              <strong>Revisões Regulares:</strong> Realize revisões semanais de
              horário para identificar padrões, otimizar eficiência e abordar
              problemas recorrentes
            </li>
            <li>
              <strong>Comunicação:</strong> Utilize as funcionalidades de
              notificação do sistema para manter os membros da equipa informados
              sobre alterações e atualizações de horário
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
                Verifique se os membros da equipa têm as qualificações
                necessárias atribuídas. Considere ajustar temporariamente os
                requisitos de qualificação ou formar membros da equipa para
                competências necessárias.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Conflitos de Agendamento Detetados
              </h5>
              <p className="text-sm text-gray-600">
                Reveja os detalhes do conflito e ajuste as atribuições.
                Considere utilizar a funcionalidade de preenchimento automático
                para encontrar soluções ótimas automaticamente.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Cobertura Insuficiente
              </h5>
              <p className="text-sm text-gray-600">
                Analise a disponibilidade da sua equipa e considere ajustar
                horários de turno, adicionar posições temporárias, ou solicitar
                membros adicionais da equipa.
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
                Quando faz alterações aos turnos, elas são marcadas como "não
                publicadas" até que as publique explicitamente. Isto permite-lhe
                trabalhar nos horários sem afetar a versão ativa que os membros
                da equipa veem. Use o botão de publicação para tornar as suas
                alterações visíveis para a equipa.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Publicação para Intervalos de Datas
              </h5>
              <p className="text-sm text-gray-600">
                Pode publicar horários para intervalos de datas específicos (ex:
                uma semana, mês, ou período personalizado). Isto dá-lhe controlo
                sobre quando as alterações se tornam visíveis e permite
                implementações graduais de atualizações de horário. Selecione o
                seu intervalo de datas desejado e publique apenas essas datas.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800">
                Reverter para Versão Publicada
              </h5>
              <p className="text-sm text-gray-600">
                Se precisar de desfazer alterações e regressar à última versão
                publicada, use a opção "Reverter para publicado". Isto
                descartará todas as alterações não publicadas e restaurará o
                horário ao seu último estado publicado. Isto é útil para
                corrigir erros ou quando as alterações precisam de ser revistas
                mais a fundo.
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
  roles: <RoleBasedHelp />,
};
